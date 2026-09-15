import { validateCatalog } from '../domain/validation.ts';
import type { Question } from '../domain/types.ts';

/**
 * Editorial metadata attached to a batch of questions.
 *
 * A batch is deliberately independent from the question wording: a future
 * `src/content/batches/*.ts` module can export one without changing the app's
 * catalogue entry point. Question-level provenance remains authoritative for
 * each individual claim, while this manifest documents the source used to
 * review the batch as a whole.
 */
export interface VerifiedContentBatch {
  id: string;
  questions: readonly Question[];
  source: string;
  sourceUrl: string;
  license: string;
  checkedAt: string;
  method: string;
  status: 'approved';
}

const nonEmpty = (value: string) => typeof value === 'string' && value.trim().length > 0;

function validateBatchManifest(batch: VerifiedContentBatch): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(batch.id)) errors.push(`Lot invalide: ${batch.id}`);
  for (const field of ['source', 'sourceUrl', 'license', 'checkedAt', 'method'] as const) {
    if (!nonEmpty(batch[field])) errors.push(`${batch.id}: métadonnée ${field} vide`);
  }
  if (!/^https:\/\//.test(batch.sourceUrl)) errors.push(`${batch.id}: sourceUrl HTTPS attendue`);
  if (batch.status !== 'approved') errors.push(`${batch.id}: lot non approuvé`);
  if (!Array.isArray(batch.questions) || batch.questions.length === 0) errors.push(`${batch.id}: lot vide`);
  return errors;
}

/**
 * Aggregates independently reviewed batches and fails closed on catalogue
 * errors. This keeps generated/repeated cards from being made publishable by
 * merely appending another file.
 */
export function aggregateVerifiedBatches(batches: readonly VerifiedContentBatch[]): Question[] {
  const errors: string[] = [];
  const batchIds = new Set<string>();
  for (const batch of batches) {
    if (batchIds.has(batch.id)) errors.push(`Lot dupliqué: ${batch.id}`);
    batchIds.add(batch.id);
    errors.push(...validateBatchManifest(batch));
  }
  const questions = batches.flatMap(batch => [...batch.questions]);
  errors.push(...validateCatalog(questions));
  if (errors.length) throw new Error(`Catalogue invalide : ${errors.join('; ')}`);
  return questions;
}
