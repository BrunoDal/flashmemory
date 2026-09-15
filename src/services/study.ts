import { defaultReviewState, SpacedRepetitionScheduler } from '../domain/scheduler';
import { isDue } from '../domain/validation';
import { persistReviewAndSession, sessionRepo } from '../storage/db';
import type { DifficultyPreference, Question, ReviewEvent, ReviewRating, ReviewState, SessionMode, StudySession } from '../domain/types';

export type { SessionMode } from '../domain/types';

export interface SessionSelectionInput {
  questions: Question[];
  states: ReviewState[];
  events: ReviewEvent[];
  topics: string[];
  mode?: SessionMode;
  maxReviewsPerSession?: number;
  newCardsPerDay?: number;
  desiredDifficulty?: DifficultyPreference;
  now?: Date;
  /** The profile is explicit so events from another profile can never affect the cap. */
  profileId?: string;
  /** A stable seed makes the choice reproducible while still avoiding catalogue order. */
  seed?: string;
}

export interface CreateStudySessionInput extends SessionSelectionInput {
  profileId: string;
  mode?: SessionMode;
  topics: string[];
}

const dayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const timestamp = (value: string | undefined) => {
  if (!value) return Number.NaN;
  const result = Date.parse(value);
  return Number.isNaN(result) ? Number.NaN : result;
};

/** A tiny deterministic hash used instead of Math.random, keeping selection pure and testable. */
const hash = (value: string) => {
  let result = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }
  return result >>> 0;
};

const stableShuffle = (questions: Question[], seed: string) => [...questions].sort((a, b) => {
  const difference = hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`);
  return difference || a.id.localeCompare(b.id);
});

const clampCount = (value: number | undefined, fallback: number) => {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
};

/**
 * Selects a session without touching storage or mutating its arguments.
 *
 * New cards are capped by first review events recorded during the user's local
 * calendar day. A normal successful review is not immediately repeated; an
 * `again` review can return when its short due interval has elapsed.
 */
export function chooseSession(input: SessionSelectionInput): Question[];
export function chooseSession(
  questions: Question[],
  states: ReviewState[],
  topics: string[],
  mode?: SessionMode,
  limit?: number,
  now?: Date,
  events?: ReviewEvent[],
  newCardsPerDay?: number,
  profileId?: string,
): Question[];
export function chooseSession(
  inputOrQuestions: SessionSelectionInput | Question[],
  legacyStates?: ReviewState[],
  legacyTopics?: string[],
  legacyMode: SessionMode = 'daily',
  legacyLimit = 20,
  legacyNow = new Date(),
  legacyEvents: ReviewEvent[] = [],
  legacyNewCardsPerDay = 10,
  legacyProfileId?: string,
): Question[] {
  const input: SessionSelectionInput = Array.isArray(inputOrQuestions)
    ? {
      questions: inputOrQuestions,
      states: legacyStates ?? [],
      events: legacyEvents,
      topics: legacyTopics ?? [],
      mode: legacyMode,
      maxReviewsPerSession: legacyLimit,
      newCardsPerDay: legacyNewCardsPerDay,
      now: legacyNow,
      profileId: legacyProfileId,
    }
    : inputOrQuestions;

  const now = input.now ?? new Date();
  const mode = input.mode ?? 'daily';
  const maxReviews = clampCount(input.maxReviewsPerSession, 20);
  const newCardsPerDay = clampCount(input.newCardsPerDay, 10);
  if (maxReviews === 0) return [];

  const profileIds = new Set(input.states.map(state => state.profileId));
  const scopedStates = input.profileId
    ? input.states.filter(state => state.profileId === input.profileId)
    : input.states;
  const scopedEvents = input.profileId
    ? input.events.filter(event => event.profileId === input.profileId)
    : profileIds.size === 1
      ? input.events.filter(event => event.profileId === [...profileIds][0])
      : input.events;
  const statesByQuestion = new Map(scopedStates.map(state => [state.questionId, state]));
  const eventsByQuestion = new Map<string, ReviewEvent[]>();
  for (const event of scopedEvents) {
    const current = eventsByQuestion.get(event.questionId) ?? [];
    current.push(event);
    eventsByQuestion.set(event.questionId, current);
  }
  for (const events of eventsByQuestion.values()) {
    events.sort((a, b) => timestamp(a.reviewedAt) - timestamp(b.reviewedAt));
  }

  const today = dayKey(now);
  const introducedToday = new Set(
    [...eventsByQuestion.entries()]
      .filter(([, events]) => events.length > 0 && dayKey(new Date(timestamp(events[0].reviewedAt))) === today)
      .map(([questionId]) => questionId),
  );
  const remainingNew = Math.max(0, newCardsPerDay - introducedToday.size);
  const seed = input.seed ?? `${today}:${mode}`;
  const uniqueQuestions = [...new Map(input.questions.map(question => [question.id, question])).values()]
    .filter(question => input.topics.includes(question.category));

  const isRecentlySuccessful = (questionId: string) => {
    const latest = eventsByQuestion.get(questionId)?.at(-1);
    return !!latest && dayKey(new Date(timestamp(latest.reviewedAt))) === today && latest.rating !== 'again';
  };
  const fresh = uniqueQuestions.filter(question => !statesByQuestion.has(question.id) && !introducedToday.has(question.id));
  const desiredDifficulty = input.desiredDifficulty ?? 'any';
  // Difficulty is an editorial preference for new cards only. Due cards stay
  // due; new cards are ranked by proximity so a narrow preference never makes
  // a session unexpectedly empty when the exact level is scarce.
  const preferredFresh = stableShuffle(fresh, `${seed}:new`).sort((a, b) => {
    if (desiredDifficulty === 'any') return 0;
    return Math.abs(a.difficulty - desiredDifficulty) - Math.abs(b.difficulty - desiredDifficulty);
  });
  const due = uniqueQuestions.filter(question => {
    const state = statesByQuestion.get(question.id);
    return !!state && isDue(state, now) && !isRecentlySuccessful(question.id);
  });
  const overdue = due.filter(question => {
    const state = statesByQuestion.get(question.id);
    return !!state && dayKey(new Date(timestamp(state.dueAt))) < today;
  });
  const dueToday = due.filter(question => !overdue.some(item => item.id === question.id));
  const learning = uniqueQuestions.filter(question => {
    const state = statesByQuestion.get(question.id);
    return !!state && (state.state === 'learning' || state.state === 'relearning') && !isDue(state, now) && !isRecentlySuccessful(question.id);
  });

  if (mode === 'free') return stableShuffle(uniqueQuestions, seed).slice(0, maxReviews);
  if (mode === 'review') return stableShuffle([...overdue, ...dueToday, ...learning], `${seed}:review`).slice(0, maxReviews);
  if (mode === 'discover') return preferredFresh.slice(0, Math.min(maxReviews, remainingNew));

  // Priority is intentional: overdue/due cards are consumed before learning,
  // and learning before the daily allowance of genuinely new cards.
  const ordered = [
    ...stableShuffle(overdue, `${seed}:overdue`),
    ...stableShuffle(dueToday, `${seed}:due`),
    ...stableShuffle(learning, `${seed}:learning`),
    ...preferredFresh.slice(0, remainingNew),
  ];
  return ordered.slice(0, maxReviews);
}

// Named alias for callers that want to make the pure use-case explicit.
export const selectSession = chooseSession;

/** Creates a durable snapshot of the selected question order. */
export async function createStudySession(input: CreateStudySessionInput, now = new Date()): Promise<{ session: StudySession; questions: Question[] }> {
  const questions = chooseSession({ ...input, now });
  const timestamp = now.toISOString();
  const session: StudySession = {
    id: crypto.randomUUID(),
    profileId: input.profileId,
    mode: input.mode ?? 'daily',
    questionIds: questions.map(question => question.id),
    currentIndex: 0,
    startedAt: timestamp,
    updatedAt: timestamp,
    status: questions.length ? 'active' : 'completed',
    ...(questions.length ? {} : { completedAt: timestamp }),
    ...(input.mode === 'topic' ? { topics: input.topics } : {}),
  };
  // There is one resumable session per profile. Starting a deliberate new
  // session abandons the previous cursor, preserving its history safely.
  const previous = await sessionRepo.active(input.profileId);
  if (previous) await sessionRepo.put({ ...previous, status: 'abandoned', updatedAt: timestamp });
  await sessionRepo.put(session);
  return { session, questions };
}

export async function getActiveStudySession(profileId: string) {
  return sessionRepo.active(profileId);
}

export async function updateStudySession(session: StudySession, patch: Partial<Pick<StudySession, 'currentIndex' | 'status' | 'completedAt'>>, now = new Date()) {
  const next: StudySession = { ...session, ...patch, updatedAt: now.toISOString() };
  await sessionRepo.put(next);
  return next;
}

export async function completeStudySession(session: StudySession, now = new Date()) {
  return updateStudySession(session, { currentIndex: session.questionIds.length, status: 'completed', completedAt: now.toISOString() }, now);
}

export async function saveReview(
  profileId: string,
  questionId: string,
  rating: ReviewRating,
  states: ReviewState[],
  now = new Date(),
  responseTimeMs?: number,
  activeSession?: StudySession,
) {
  if (activeSession?.mode === 'free') {
    const session = await updateStudySession(activeSession, {
      currentIndex: Math.min(activeSession.questionIds.length, activeSession.currentIndex + 1),
      status: activeSession.currentIndex + 1 >= activeSession.questionIds.length ? 'completed' : 'active',
      ...(activeSession.currentIndex + 1 >= activeSession.questionIds.length ? { completedAt: now.toISOString() } : {}),
    }, now);
    return { next: undefined, event: undefined, session };
  }
  const old = states.find(state => state.questionId === questionId) ?? defaultReviewState(profileId, questionId, now);
  const next = new SpacedRepetitionScheduler().review(old, rating, now);
  const event: ReviewEvent = { id: crypto.randomUUID(), profileId, questionId, reviewedAt: now.toISOString(), rating, previousDueAt: old.dueAt, nextDueAt: next.dueAt, ...(responseTimeMs === undefined ? {} : { responseTimeMs }) };
  const session = activeSession
    ? {
      ...activeSession,
      currentIndex: Math.min(activeSession.questionIds.length, activeSession.currentIndex + 1),
      status: activeSession.currentIndex + 1 >= activeSession.questionIds.length ? 'completed' as const : 'active' as const,
      updatedAt: now.toISOString(),
      ...(activeSession.currentIndex + 1 >= activeSession.questionIds.length ? { completedAt: now.toISOString() } : {}),
    }
    : undefined;
  await persistReviewAndSession(next, event, session);
  return { next, event, session };
}
