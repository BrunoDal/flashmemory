import { describe, expect, it } from 'vitest';
import type { Question, ReviewEvent, ReviewState } from '../domain/types';
import { chooseSession } from '../services/study';

const now = new Date('2026-01-02T12:00:00.000Z');
const question = (id: string): Question => ({ id, factId: `fact-${id}`, version: 1, type: 'flashcard', question: id, answer: id, explanation: id, category: 'Histoire', difficulty: 2, provenance: { factId: `fact-${id}`, source: 'test', url: 'https://example.test/fact', license: 'test', checkedAt: '2026-09-15', method: 'test', status: 'approved' } });
const state = (id: string, status: ReviewState['state'], dueAt: string): ReviewState => ({ id: `p:${id}`, questionId: id, profileId: 'p', state: status, dueAt, reviewCount: 1, lapseCount: 0, difficulty: 5, stability: 1 });
const event = (profileId: string, questionId: string, reviewedAt: string, rating: ReviewEvent['rating'] = 'good'): ReviewEvent => ({ id: `${profileId}:${questionId}:${reviewedAt}`, profileId, questionId, reviewedAt, rating, nextDueAt: reviewedAt });

describe('chooseSession', () => {
  it('priorise les retards, puis les dues, apprentissages et nouvelles cartes', () => {
    const questions = ['overdue', 'due', 'learning', 'fresh-a', 'fresh-b', 'fresh-c'].map(question);
    const result = chooseSession({
      questions,
      states: [
        state('overdue', 'review', '2026-01-01T12:00:00.000Z'),
        state('due', 'review', '2026-01-02T11:00:00.000Z'),
        state('learning', 'learning', '2026-01-03T12:00:00.000Z'),
      ],
      events: [event('p', 'fresh-a', '2026-01-02T09:00:00.000Z')],
      topics: ['Histoire'],
      profileId: 'p',
      mode: 'daily',
      newCardsPerDay: 2,
      maxReviewsPerSession: 10,
      now,
      seed: 'priority-test',
    });

    expect(result.slice(0, 3).map(item => item.id)).toEqual(['overdue', 'due', 'learning']);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(item => item.id)).size).toBe(result.length);
  });

  it('compte seulement les premières introductions du profil dans la limite du jour', () => {
    const questions = ['fresh-a', 'fresh-b', 'fresh-c'].map(question);
    const result = chooseSession({
      questions,
      states: [],
      events: [
        event('p', 'fresh-a', '2026-01-02T09:00:00.000Z'),
        event('p', 'fresh-a', '2026-01-02T09:30:00.000Z'),
        event('other', 'fresh-b', '2026-01-02T10:00:00.000Z'),
      ],
      topics: ['Histoire'],
      profileId: 'p',
      mode: 'daily',
      newCardsPerDay: 1,
      maxReviewsPerSession: 10,
      now,
      seed: 'daily-cap-test',
    });

    expect(result).toHaveLength(0);
    expect(result.every(item => item.id !== 'fresh-a')).toBe(true);
  });

  it('respecte le plafond de session et isole les événements des autres profils', () => {
    const questions = ['a', 'b', 'c', 'd'].map(question);
    const options = {
      questions,
      states: [],
      events: [event('other', 'a', '2026-01-02T09:00:00.000Z')],
      topics: ['Histoire'],
      profileId: 'p',
      mode: 'daily' as const,
      newCardsPerDay: 4,
      maxReviewsPerSession: 4,
      now,
      seed: 'isolation-test',
    };
    const first = chooseSession(options);
    const second = chooseSession(options);

    expect(first).toHaveLength(4);
    expect(first).toEqual(second);
    expect(first).toContainEqual(question('a'));
  });

  it('classe les nouvelles cartes par proximité de la difficulté souhaitée', () => {
    const questions = [1, 2, 3, 4, 5].map(difficulty => ({ ...question(`level-${difficulty}`), difficulty: difficulty as 1 | 2 | 3 | 4 | 5 }));
    const result = chooseSession({ questions, states: [], events: [], topics: ['Histoire'], profileId: 'p', mode: 'discover', desiredDifficulty: 4, newCardsPerDay: 5, maxReviewsPerSession: 5, now, seed: 'difficulty-test' });
    expect(result[0].difficulty).toBe(4);
    expect(new Set(result.slice(1, 3).map(item => item.difficulty))).toEqual(new Set([3, 5]));
  });
});
