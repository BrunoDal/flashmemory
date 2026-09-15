import { describe, expect, it } from 'vitest';
import { calculateStatistics, getStatisticsWindow } from '../domain/statistics';
import type { Question, ReviewEvent, ReviewState } from '../domain/types';

const question = (id: string, category = 'Géographie'): Question => ({
  id,
  factId: `fact-${id}`,
  version: 1,
  type: 'flashcard',
  question: id,
  answer: 'réponse',
  explanation: 'explication',
  category,
  difficulty: 2,
  provenance: { factId: `fact-${id}`, source: 'test', url: 'https://example.test/fact', license: 'test', checkedAt: '2026-09-15', method: 'test', status: 'approved' },
});

const state = (questionId: string, overrides: Partial<ReviewState> = {}): ReviewState => ({
  id: `p:${questionId}`,
  profileId: 'p',
  questionId,
  state: 'review',
  dueAt: '2026-01-10T00:00:00.000Z',
  reviewCount: 2,
  lapseCount: 0,
  difficulty: 4,
  stability: 20,
  ...overrides,
});

const event = (id: string, questionId: string, reviewedAt: string, rating: ReviewEvent['rating'], responseTimeMs?: number): ReviewEvent => ({
  id,
  profileId: 'p',
  questionId,
  reviewedAt,
  rating,
  nextDueAt: '2026-01-10T00:00:00.000Z',
  ...(responseTimeMs === undefined ? {} : { responseTimeMs }),
});

describe('statistics', () => {
  it('calcule les métriques de la fenêtre et la série du jour', () => {
    const now = new Date('2026-01-03T12:00:00Z');
    const events = [
      event('1', 'q1', '2026-01-03T10:00:00Z', 'good', 60_000),
      event('2', 'q2', '2026-01-02T10:00:00Z', 'again', 30_000),
    ];
    const result = calculateStatistics(events, [state('q1', { stability: 35 }), state('q2')], [question('q1'), question('q2')], now);
    expect(result.answers).toBe(1);
    expect(result.successRate).toBe(100);
    expect(result.seen).toBe(1);
    expect(result.learned).toBe(1);
    expect(result.mastered).toBe(1);
    expect(result.forgotten).toBe(0);
    expect(result.minutes).toBe(1);
    expect(result.streak).toBe(0);
    expect(result.byCategory.Géographie).toBe(100);
  });

  it('filtre correctement 7 jours et inclut la borne de début locale', () => {
    const now = new Date('2026-01-08T12:00:00Z');
    const window = getStatisticsWindow('7d', now);
    expect(window.start).toBeDefined();
    const start = window.start!;
    const atStart = event('at-start', 'q1', start.toISOString(), 'good');
    const beforeStart = event('before-start', 'q2', new Date(start.getTime() - 1).toISOString(), 'good');
    const atEnd = event('at-end', 'q3', now.toISOString(), 'again');
    const afterEnd = event('after-end', 'q4', new Date(now.getTime() + 1).toISOString(), 'good');
    const result = calculateStatistics([atStart, beforeStart, atEnd, afterEnd], [state('q1'), state('q3')], [question('q1'), question('q3')], now, '7d');
    expect(result.answers).toBe(2);
    expect(result.seen).toBe(2);
    expect(result.successRate).toBe(50);
    expect(result.forgotten).toBe(1);
  });

  it('ne mélange pas les fenêtres bornées avec le tout historique', () => {
    const now = new Date('2026-01-10T12:00:00Z');
    const events = [
      event('old', 'old', '2025-12-01T12:00:00Z', 'again'),
      event('recent', 'recent', '2026-01-10T11:00:00Z', 'good', 120_000),
    ];
    const states = [state('old', { stability: 40 }), state('recent', { stability: 10 })];
    const questions = [question('old', 'Histoire'), question('recent', 'Sciences')];
    const today = calculateStatistics(events, states, questions, now, 'today');
    expect(today.answers).toBe(1);
    expect(today.forgotten).toBe(0);
    expect(today.byCategory).toEqual({ Sciences: expect.closeTo(33.333, 0.01) });
    const all = calculateStatistics(events, states, questions, now, 'all');
    expect(all.answers).toBe(2);
    expect(all.forgotten).toBe(1);
    expect(all.seen).toBe(2);
    expect(all.minutes).toBe(2);
  });

  it('calcule la série avec les jours calendaires locaux, sans dépasser la fenêtre', () => {
    const now = new Date('2026-01-07T12:00:00Z');
    const events = Array.from({ length: 7 }, (_, day) => Array.from({ length: 3 }, (_, review) =>
      event(`d${day}-${review}`, `q${day}-${review}`, `2026-01-${String(7 - day).padStart(2, '0')}T${String(9 + review).padStart(2, '0')}:00:00Z`, 'good'),
    )).flat();
    expect(calculateStatistics(events, [], [], now, '7d').streak).toBe(7);
    expect(calculateStatistics(events, [], [], now, 'today').streak).toBe(1);
  });
});
