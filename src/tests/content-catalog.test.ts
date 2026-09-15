import { describe, expect, it } from 'vitest';
import type { Question } from '../domain/types';
import { aggregateVerifiedBatches, type VerifiedContentBatch } from '../content/catalog';

const question = (id: string, factId = id): Question => ({
  id,
  factId,
  version: 1,
  type: 'flashcard',
  question: `Question ${id}`,
  answer: `Réponse ${id}`,
  explanation: `Explication ${id}`,
  category: 'Histoire',
  difficulty: 1,
  provenance: {
    factId,
    source: 'Test source',
    url: `https://example.test/${id}`,
    license: 'CC BY 4.0',
    checkedAt: '2026-09-15',
    method: 'test-editorial-review',
    status: 'approved',
  },
});
const batch = (id: string, questions: Question[] = [question(`${id}-question`)]): VerifiedContentBatch => ({
  id,
  questions,
  source: 'Test source',
  sourceUrl: 'https://example.test/source',
  license: 'CC BY 4.0',
  checkedAt: '2026-09-15',
  method: 'test-editorial-review',
  status: 'approved',
});

describe('verified content batches', () => {
  it('agrège plusieurs lots approuvés', () => {
    expect(aggregateVerifiedBatches([batch('history'), batch('science')])).toHaveLength(2);
  });

  it('refuse un lot ou un fait dupliqué', () => {
    expect(() => aggregateVerifiedBatches([batch('history'), batch('history')])).toThrow(/Lot dupliqué/);
    expect(() => aggregateVerifiedBatches([batch('history', [question('a', 'same-fact')]), batch('science', [question('b', 'same-fact')])])).toThrow(/factId dupliqué/);
  });

  it('refuse les métadonnées de source incomplètes', () => {
    expect(() => aggregateVerifiedBatches([{ ...batch('history'), sourceUrl: '' }])).toThrow(/sourceUrl/);
    expect(() => aggregateVerifiedBatches([{ ...batch('history'), status: 'draft' as 'approved' }])).toThrow(/non approuvé/);
  });
});
