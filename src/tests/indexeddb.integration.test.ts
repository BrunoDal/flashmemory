import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { defaultReviewState, SpacedRepetitionScheduler } from '../domain/scheduler';
import type { ExportBundle, Profile, ReviewEvent, ReviewState, StudySession } from '../domain/types';
import { defaultSettings, importProfile } from '../services/data';
import { getActiveStudySession, saveReview } from '../services/study';
import { closeDbForTests, profileRepo, resetDbForTests, reviewRepo, sessionRepo, settingsRepo } from '../storage/db';

const firstReview = new Date('2026-02-03T10:00:00.000Z');

const makeProfile = (id: string): Profile => ({
  id,
  name: id === 'profile-a' ? 'Alice' : 'Bob',
  createdAt: '2026-02-01T10:00:00.000Z',
  activeTopics: ['Histoire', 'Sciences'],
  level: 'any',
});

const makeState = (profileId: string, questionId: string, now = firstReview): ReviewState =>
  new SpacedRepetitionScheduler().review(defaultReviewState(profileId, questionId, now), 'good', now);

const makeEvent = (profileId: string, questionId: string, state: ReviewState, id = `${profileId}:${questionId}:event`): ReviewEvent => ({
  id,
  profileId,
  questionId,
  reviewedAt: state.lastReviewedAt ?? firstReview.toISOString(),
  rating: state.lastRating ?? 'good',
  previousDueAt: firstReview.toISOString(),
  nextDueAt: state.dueAt,
});

const makeSession = (profileId: string, questionIds: string[] = ['question-1', 'question-2']): StudySession => ({
  id: `${profileId}:session`,
  profileId,
  mode: 'daily',
  questionIds,
  currentIndex: 0,
  startedAt: firstReview.toISOString(),
  updatedAt: firstReview.toISOString(),
  status: 'active',
});

const seedProfile = async (profile: Profile, withDependents = true) => {
  await profileRepo.put(profile);
  await settingsRepo.put(defaultSettings(profile.id));
  if (!withDependents) return;
  const state = makeState(profile.id, 'question-1');
  await reviewRepo.putState(state);
  await reviewRepo.putEvent(makeEvent(profile.id, 'question-1', state));
  await sessionRepo.put(makeSession(profile.id));
};

const bundleFor = (profile: Profile): ExportBundle => {
  const state = makeState(profile.id, 'question-imported');
  return {
    format: 'general-knowledge-trainer',
    version: 1,
    exportedAt: firstReview.toISOString(),
    profile,
    reviewStates: [state],
    reviewEvents: [makeEvent(profile.id, 'question-imported', state, `${profile.id}:import-event`)],
    settings: { ...defaultSettings(profile.id), maxReviewsPerSession: 7 },
  };
};

describe('IndexedDB persistence integration', () => {
  beforeEach(async () => {
    await resetDbForTests();
  });

  afterAll(async () => {
    await closeDbForTests();
  });

  it('réouvre la base et relit les profils, réglages, révisions et session', async () => {
    const profile = makeProfile('profile-a');
    await seedProfile(profile);

    // A real app restart closes the IDB connection; the next repository call
    // must create a fresh connection and observe the same durable records.
    await closeDbForTests();

    await expect(profileRepo.get(profile.id)).resolves.toEqual(profile);
    await expect(settingsRepo.get(profile.id)).resolves.toEqual(defaultSettings(profile.id));
    await expect(reviewRepo.states(profile.id)).resolves.toHaveLength(1);
    await expect(reviewRepo.events(profile.id)).resolves.toHaveLength(1);
    await expect(sessionRepo.active(profile.id)).resolves.toMatchObject({ profileId: profile.id, status: 'active' });
  });

  it('isole toutes les lectures et écritures entre deux profils', async () => {
    await seedProfile(makeProfile('profile-a'));
    await seedProfile(makeProfile('profile-b'));

    const profileAStates = await reviewRepo.states('profile-a');
    const profileBStates = await reviewRepo.states('profile-b');
    expect(profileAStates).toHaveLength(1);
    expect(profileBStates).toHaveLength(1);
    expect(profileAStates[0].profileId).toBe('profile-a');
    expect(profileBStates[0].profileId).toBe('profile-b');
    expect((await reviewRepo.events('profile-a'))[0].profileId).toBe('profile-a');
    expect((await sessionRepo.all('profile-b'))[0].profileId).toBe('profile-b');
    expect(await settingsRepo.get('profile-a')).toEqual(defaultSettings('profile-a'));
    expect(await settingsRepo.get('profile-b')).toEqual(defaultSettings('profile-b'));
  });

  it('supprime atomiquement le profil et tous ses enregistrements dépendants', async () => {
    await seedProfile(makeProfile('profile-a'));
    await seedProfile(makeProfile('profile-b'));

    await profileRepo.remove('profile-a');

    await expect(profileRepo.get('profile-a')).resolves.toBeUndefined();
    await expect(settingsRepo.get('profile-a')).resolves.toBeUndefined();
    await expect(reviewRepo.states('profile-a')).resolves.toEqual([]);
    await expect(reviewRepo.events('profile-a')).resolves.toEqual([]);
    await expect(sessionRepo.all('profile-a')).resolves.toEqual([]);

    // The transaction must not affect another profile.
    await expect(profileRepo.get('profile-b')).resolves.toEqual(makeProfile('profile-b'));
    await expect(reviewRepo.states('profile-b')).resolves.toHaveLength(1);
    await expect(reviewRepo.events('profile-b')).resolves.toHaveLength(1);
    await expect(sessionRepo.active('profile-b')).resolves.toMatchObject({ profileId: 'profile-b' });
  });

  it('valide un import avant toute écriture et remplace atomiquement les dépendances', async () => {
    const existing = makeProfile('profile-a');
    await seedProfile(existing);

    const valid = bundleFor(existing);
    const invalid = { ...valid, settings: { ...valid.settings, newCardsPerDay: 'invalid' } } as unknown;
    await expect(importProfile(invalid)).rejects.toThrow(/invalide|réglages/);

    // Invalid input is rejected before getDb(), leaving every old record intact.
    await expect(profileRepo.get(existing.id)).resolves.toEqual(existing);
    await expect(reviewRepo.states(existing.id)).resolves.toHaveLength(1);
    await expect(reviewRepo.events(existing.id)).resolves.toHaveLength(1);
    await expect(sessionRepo.all(existing.id)).resolves.toHaveLength(1);

    await expect(importProfile(valid)).rejects.toThrow(/existe déjà/);
    await importProfile(valid, true);

    await expect(settingsRepo.get(existing.id)).resolves.toEqual(valid.settings);
    await expect(reviewRepo.states(existing.id)).resolves.toEqual(valid.reviewStates);
    await expect(reviewRepo.events(existing.id)).resolves.toEqual(valid.reviewEvents);
    // Sessions are intentionally not part of the export format; overwrite
    // removes the old cursor so no stale session can resume imported data.
    await expect(sessionRepo.all(existing.id)).resolves.toEqual([]);
  });

  it('persiste la réponse et avance le curseur de session, puis reprend après réouverture', async () => {
    const profile = makeProfile('profile-a');
    await seedProfile(profile, false);
    const initial = defaultReviewState(profile.id, 'question-1', firstReview);
    const activeSession = makeSession(profile.id);

    const result = await saveReview(profile.id, 'question-1', 'good', [initial], firstReview, 123, activeSession);

    expect(result.session).toMatchObject({ currentIndex: 1, status: 'active' });
    await expect(reviewRepo.states(profile.id)).resolves.toEqual([result.next]);
    await expect(reviewRepo.events(profile.id)).resolves.toEqual([result.event]);
    await expect(sessionRepo.get(activeSession.id)).resolves.toEqual(result.session);

    await closeDbForTests();
    await expect(getActiveStudySession(profile.id)).resolves.toEqual(result.session);
  });

  it('avance un quiz libre sans modifier la répétition espacée', async () => {
    const profile = makeProfile('profile-free');
    await seedProfile(profile, false);
    const activeSession = { ...makeSession(profile.id, ['question-1']), mode: 'free' as const };
    await sessionRepo.put(activeSession);

    const result = await saveReview(profile.id, 'question-1', 'good', [], firstReview, 123, activeSession);

    expect(result).toMatchObject({ next: undefined, event: undefined, session: { currentIndex: 1, status: 'completed' } });
    await expect(reviewRepo.states(profile.id)).resolves.toEqual([]);
    await expect(reviewRepo.events(profile.id)).resolves.toEqual([]);
    await expect(sessionRepo.get(activeSession.id)).resolves.toEqual(result.session);
  });
});
