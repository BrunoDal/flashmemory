import type { Question, ReviewEvent, ReviewState } from './types';

/** Calendar windows are evaluated in the user's local timezone. */
export type StatisticsPeriod = 'today' | '7d' | '30d' | 'all';
/** Three completed reviews make a day count toward the daily learning streak. */
export const DAILY_STREAK_THRESHOLD = 3;

export interface StatisticsWindow {
  period: StatisticsPeriod;
  /** Start is omitted for the all-time window. */
  start: Date | undefined;
  /** The upper bound is inclusive and defaults to `now`. */
  end: Date;
}

export interface Statistics {
  period: StatisticsPeriod;
  rangeStart?: string;
  rangeEnd: string;
  answers: number;
  successRate: number;
  seen: number;
  learned: number;
  mastered: number;
  forgotten: number;
  streak: number;
  /** Sum of responseTimeMs, with a small per-answer estimate when unavailable. */
  timeMs: number;
  minutes: number;
  /** Percentage score by category, derived from current ReviewStates. */
  byCategory: Record<string, number>;
}

const startOfLocalDay = (value: Date) => {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);
  return start;
};

const localDayKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns calendar-day boundaries rather than subtracting 24 hours. This keeps
 * "today", 7d and 30d correct across DST changes in the local timezone.
 */
export function getStatisticsWindow(period: StatisticsPeriod, now = new Date()): StatisticsWindow {
  const end = new Date(now);
  if (Number.isNaN(end.getTime())) throw new Error('Date de statistiques invalide.');
  if (period === 'all') return { period, start: undefined, end };
  const days = period === 'today' ? 1 : period === '7d' ? 7 : 30;
  const start = startOfLocalDay(end);
  start.setDate(start.getDate() - (days - 1));
  return { period, start, end };
}

const eventTimestamp = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
};

const isInWindow = (event: ReviewEvent, window: StatisticsWindow) => {
  const timestamp = eventTimestamp(event.reviewedAt);
  if (timestamp === undefined) return false;
  const time = timestamp;
  return (!window.start || time >= window.start.getTime()) && time <= window.end.getTime();
};

const toMinutes = (milliseconds: number) => Math.round(milliseconds / 60_000);

/**
 * Calculates all statistics from immutable review events and current review
 * states. No category counters or aggregate statistics are persisted.
 *
 * For a bounded period, card metrics only include cards with at least one
 * event in that period. The current ReviewState supplies the latest derived
 * proficiency for those cards (the app does not maintain a second aggregate).
 */
export function calculateStatistics(
  events: ReviewEvent[],
  states: ReviewState[],
  questions: Question[],
  now = new Date(),
  period: StatisticsPeriod = 'today',
): Statistics {
  const window = getStatisticsWindow(period, now);
  const recent = events.filter(event => isInWindow(event, window));
  const seenIds = new Set(recent.map(event => event.questionId));
  const statesByQuestion = new Map(states.map(state => [state.questionId, state]));
  const questionsById = new Map(questions.map(question => [question.id, question]));

  const successful = recent.filter(event => event.rating !== 'again').length;
  const learnedIds = [...seenIds].filter(id => {
    const state = statesByQuestion.get(id);
    return Boolean(state && state.state !== 'new');
  });
  const masteredIds = [...seenIds].filter(id => (statesByQuestion.get(id)?.stability ?? 0) >= 30);
  const forgottenIds = new Set(recent.filter(event => event.rating === 'again').map(event => event.questionId));

  // responseTimeMs is the only persisted timing truth. Older events do not
  // have it, so use a transparent 24-second estimate for those events only.
  const timeMs = recent.reduce((total, event) => {
    const measured = event.responseTimeMs;
    return total + (measured !== undefined && Number.isFinite(measured) && measured >= 0 ? measured : 24_000);
  }, 0);

  const categoryTotals: Record<string, { total: number; score: number }> = {};
  for (const questionId of seenIds) {
    const question = questionsById.get(questionId);
    if (!question) continue;
    const state = statesByQuestion.get(questionId);
    const bucket = categoryTotals[question.category] ??= { total: 0, score: 0 };
    bucket.total += 1;
    bucket.score += Math.min(100, ((state?.stability ?? 0) / 30) * 100);
  }
  const byCategory: Record<string, number> = {};
  for (const [category, bucket] of Object.entries(categoryTotals)) {
    byCategory[category] = bucket.total ? bucket.score / bucket.total : 0;
  }

  const reviewsByDay = new Map<string, number>();
  for (const event of recent) {
    const timestamp = eventTimestamp(event.reviewedAt);
    if (timestamp !== undefined) {
      const day = localDayKey(new Date(timestamp));
      reviewsByDay.set(day, (reviewsByDay.get(day) ?? 0) + 1);
    }
  }
  const activeDays = new Set([...reviewsByDay.entries()]
    .filter(([, count]) => count >= DAILY_STREAK_THRESHOLD)
    .map(([day]) => day));
  let streak = 0;
  const cursor = startOfLocalDay(window.end);
  // Keep the streak scoped to the selected period. For example, Today is
  // either 0 or 1 and a 7-day window cannot report more than 7 days.
  const maxDays = period === 'today' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : undefined;
  while (activeDays.has(localDayKey(cursor)) && (maxDays === undefined || streak < maxDays)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    period,
    rangeStart: window.start?.toISOString(),
    rangeEnd: window.end.toISOString(),
    answers: recent.length,
    successRate: recent.length ? Math.round((successful / recent.length) * 100) : 0,
    seen: seenIds.size,
    learned: learnedIds.length,
    mastered: masteredIds.length,
    forgotten: forgottenIds.size,
    streak,
    timeMs,
    minutes: toMinutes(timeMs),
    byCategory,
  };
}
