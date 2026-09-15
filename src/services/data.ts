import { importProfileBundle, reviewRepo, settingsRepo } from '../storage/db';
import type { ExportBundle, Profile, Settings } from '../domain/types';
import { normalizeExport } from '../domain/validation';
export const defaultSettings = (id: string): Settings => ({ id, newCardsPerDay: 10, maxReviewsPerSession: 20, theme: 'system', sound: false, haptics: false, desiredDifficulty: 'any' });
export async function exportProfile(profile: Profile): Promise<ExportBundle> { return { format: 'general-knowledge-trainer', version: 1, exportedAt: new Date().toISOString(), profile, reviewStates: await reviewRepo.states(profile.id), reviewEvents: await reviewRepo.events(profile.id), settings: await settingsRepo.get(profile.id) ?? defaultSettings(profile.id) }; }
/** Validates the complete payload before opening the write transaction. */
export async function importProfile(value: unknown, overwrite = false): Promise<void> {
  const bundle = normalizeExport(value);
  await importProfileBundle(bundle, overwrite);
}
