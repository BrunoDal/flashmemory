import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../content/questions';
import type { ExportBundle, Profile, ReviewEvent, ReviewState, Settings } from '../domain/types';
import { TOPICS } from '../domain/types';
import { exportValidationErrors, migrateSettings, validateCatalog, validateExport, validateProfile, validateReviewEvent, validateReviewState, validateSettings } from '../domain/validation';
import { importProfile } from '../services/data';

const at = '2025-01-01T00:00:00.000Z';
const profile: Profile = { id: 'profile-1', name: 'Bruno', createdAt: at, activeTopics: ['Géographie'], level: 'any' };
const settings: Settings = { id: profile.id, newCardsPerDay: 10, maxReviewsPerSession: 20, theme: 'system', sound: false, haptics: false, desiredDifficulty: 'any' };
const newState: ReviewState = { id: 'profile-1:question-1', questionId: 'question-1', profileId: profile.id, state: 'new', dueAt: at, reviewCount: 0, lapseCount: 0, difficulty: 5, stability: 0.5 };
const event: ReviewEvent = { id: 'event-1', profileId: profile.id, questionId: 'question-1', reviewedAt: at, rating: 'good', nextDueAt: '2025-01-02T00:00:00.000Z' };
const bundle = (): ExportBundle => ({ format: 'general-knowledge-trainer', version: 1, exportedAt: at, profile, reviewStates: [newState], reviewEvents: [], settings });

describe('catalogue and import validation', () => {
  it('valide le catalogue fourni', () => expect(validateCatalog(QUESTIONS)).toEqual([]));
  it('impose un corpus conséquent, équilibré et varié', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(300);
    expect(new Set(QUESTIONS.map((question) => question.category))).toEqual(new Set(TOPICS));
    expect(new Set(QUESTIONS.map((question) => question.type))).toEqual(new Set(['flashcard', 'multiple-choice', 'true-false']));
    for (const type of ['flashcard', 'multiple-choice', 'true-false'] as const) {
      expect(QUESTIONS.filter((question) => question.type === type).length).toBeGreaterThanOrEqual(20);
    }
  });
  it('associe chaque carte à un fait et une provenance approuvée distincts', () => {
    expect(new Set(QUESTIONS.map(question => question.factId)).size).toBe(QUESTIONS.length);
    for (const question of QUESTIONS) {
      expect(question.provenance.factId).toBe(question.factId);
      expect(question.provenance.status).toBe('approved');
      expect(question.provenance.url).toMatch(/^https:\/\//);
    }
  });
  it('refuse une carte sans preuve approuvée avant publication', () => {
    const draft = { ...QUESTIONS[0], provenance: { ...QUESTIONS[0].provenance, status: 'draft' as const } };
    expect(validateCatalog([draft])).toEqual(['Question 1 invalide']);
  });
  it('garantit la cohérence des interactions générées', () => {
    for (const question of QUESTIONS) {
      if (question.type === 'multiple-choice') expect(question.answer).toBe(question.choices?.[question.correctChoice ?? -1]);
      if (question.type === 'true-false') expect(['Vrai', 'Faux']).toContain(question.answer);
      expect(question.explanation.trim()).not.toBe('');
    }
  });
  it('refuse les exports corrompus et explique les erreurs', () => {
    const errors: string[] = [];
    expect(validateExport({ format: 'bad' }, errors)).toBe(false);
    expect(errors.join('\n')).toContain('format');
    expect(errors.join('\n')).toContain('version');
    expect(errors.join('\n')).toContain('profile');
  });
  it('accepte une enveloppe complète et strictement structurée', () => expect(validateExport(bundle())).toBe(true));
  it('valide chaque modèle et rejette les champs inattendus', () => {
    expect(validateProfile(profile)).toBe(true);
    expect(validateSettings(settings)).toBe(true);
    expect(validateReviewState(newState)).toBe(true);
    expect(validateReviewEvent(event)).toBe(true);
    expect(validateProfile({ ...profile, unknown: true })).toBe(false);
    expect(validateSettings({ ...settings, newCardsPerDay: 1.5 })).toBe(false);
    expect(validateReviewState({ ...newState, state: 'review' })).toBe(false);
    expect(validateReviewEvent({ ...event, reviewedAt: 'not-a-date' })).toBe(false);
  });
  it('migre les réglages v1/v2 sans perdre les valeurs connues', () => {
    expect(migrateSettings({ id: profile.id, newCardsPerDay: 8, maxReviewsPerSession: 12, theme: 'dark' })).toEqual({ ...settings, newCardsPerDay: 8, maxReviewsPerSession: 12, theme: 'dark' });
    expect(migrateSettings({ version: 2, id: profile.id, newCardsPerDay: 8, maxReviewsPerSession: 12, theme: 'light', sound: true, haptics: true })).toEqual({ ...settings, newCardsPerDay: 8, maxReviewsPerSession: 12, theme: 'light', sound: true, haptics: true });
    expect(validateExport({ ...bundle(), settings: { id: profile.id, newCardsPerDay: 10, maxReviewsPerSession: 20, theme: 'system' } })).toBe(true);
    expect(validateExport({ ...bundle(), settings: { newCardsPerDay: 10, maxReviewsPerSession: 20, theme: 'system' } })).toBe(false);
  });
  it('refuse les dates, IDs et relations inter-profil incohérentes', () => {
    const invalid = bundle();
    invalid.profile = { ...profile, id: 'profile-2' };
    invalid.settings = { ...settings, id: 'profile-1' };
    invalid.reviewStates = [{ ...newState, profileId: 'profile-1', dueAt: '2025-02-30T00:00:00.000Z' }];
    invalid.reviewEvents = [{ ...event, profileId: 'profile-3' }];
    expect(validateExport(invalid)).toBe(false);
    expect(exportValidationErrors(invalid).some(error => error.includes('profileId'))).toBe(true);
  });
  it('refuse les doublons de states et d’événements', () => {
    const invalid = bundle();
    invalid.reviewStates = [newState, { ...newState }];
    invalid.reviewEvents = [event, { ...event }];
    expect(validateExport(invalid)).toBe(false);
    expect(exportValidationErrors(invalid).join('\n')).toContain('dupliqué');
  });
  it('exige qu’un événement appartienne à un état exporté du même profil', () => {
    const invalid = bundle();
    invalid.reviewEvents = [{ ...event, questionId: 'question-missing' }];
    expect(validateExport(invalid)).toBe(false);
    expect(exportValidationErrors(invalid).join('\n')).toContain('aucun état');
  });
  it('rejette un import avant d’ouvrir une écriture de stockage', async () => {
    await expect(importProfile({ format: 'general-knowledge-trainer', version: 1 })).rejects.toThrow(/profile|reviewStates|settings/);
  });
});
