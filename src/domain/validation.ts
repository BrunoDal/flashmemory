import type {
  ExportBundle,
  Profile,
  Question,
  ReviewEvent,
  ReviewRating,
  ReviewState,
  Settings,
} from './types.ts';
import { REVIEW_RATINGS, TOPICS } from './types.ts';

/** A validation issue always includes a path that can be shown to the user. */
export type ValidationIssue = string;

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const PROFILE_KEYS = ['id', 'name', 'createdAt', 'activeTopics', 'level'];
const SETTINGS_KEYS = ['id', 'newCardsPerDay', 'maxReviewsPerSession', 'theme', 'sound', 'haptics', 'desiredDifficulty'];
const LEGACY_SETTINGS_KEYS = [...SETTINGS_KEYS, 'version', 'settingsVersion'];
const STATE_KEYS = ['id', 'questionId', 'profileId', 'state', 'dueAt', 'lastReviewedAt', 'reviewCount', 'lapseCount', 'difficulty', 'stability', 'lastRating'];
const EVENT_KEYS = ['id', 'profileId', 'questionId', 'reviewedAt', 'rating', 'previousDueAt', 'nextDueAt', 'responseTimeMs'];
const EXPORT_KEYS = ['format', 'version', 'exportedAt', 'profile', 'reviewStates', 'reviewEvents', 'settings'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasOnlyKeys = (value: Record<string, unknown>, allowed: string[], path: string, errors: string[]) => {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push(`${path}.${key}: propriété inattendue`);
  }
};

const validId = (value: unknown) => typeof value === 'string' && ID.test(value);
const validText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
const validIsoDate = (value: unknown) => {
  if (typeof value !== 'string' || !ISO_UTC.test(value)) return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(value);
  if (!match) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getUTCFullYear() === Number(match[1])
    && date.getUTCMonth() + 1 === Number(match[2])
    && date.getUTCDate() === Number(match[3])
    && date.getUTCHours() === Number(match[4])
    && date.getUTCMinutes() === Number(match[5])
    && date.getUTCSeconds() === Number(match[6])
    && date.getUTCMilliseconds() === Number((match[7] ?? '').padEnd(3, '0') || '0');
};
const validInteger = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
const validProvenance = (value: unknown, factId: unknown) => {
  if (!isRecord(value) || !validId(factId) || value.factId !== factId) return false;
  if (!validText(value.source) || !validText(value.url) || !validText(value.license) || !validText(value.method)) return false;
  if (typeof value.checkedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.checkedAt)) return false;
  return value.status === 'approved';
};

const issue = (errors: string[], path: string, message: string) => errors.push(`${path}: ${message}`);

function profileErrors(value: unknown, path: string, errors: string[]): value is Profile {
  if (!isRecord(value)) {
    issue(errors, path, 'doit être un objet');
    return false;
  }
  hasOnlyKeys(value, PROFILE_KEYS, path, errors);
  let valid = true;
  if (!validId(value.id)) { issue(errors, `${path}.id`, 'identifiant invalide'); valid = false; }
  if (!validText(value.name) || (typeof value.name === 'string' && value.name !== value.name.trim())) { issue(errors, `${path}.name`, 'nom non vide attendu'); valid = false; }
  if (!validIsoDate(value.createdAt)) { issue(errors, `${path}.createdAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (!Array.isArray(value.activeTopics) || value.activeTopics.some(topic => typeof topic !== 'string' || !TOPICS.includes(topic)) || new Set(value.activeTopics).size !== value.activeTopics.length) {
    issue(errors, `${path}.activeTopics`, 'liste de thèmes valides et sans doublon attendue'); valid = false;
  }
  if (!['beginner', 'intermediate', 'advanced', 'any'].includes(value.level as string)) { issue(errors, `${path}.level`, 'niveau invalide'); valid = false; }
  return valid;
}

function settingsErrors(value: unknown, path: string, errors: string[]): value is Settings {
  if (!isRecord(value)) {
    issue(errors, path, 'doit être un objet');
    return false;
  }
  hasOnlyKeys(value, SETTINGS_KEYS, path, errors);
  let valid = true;
  if (!validId(value.id)) { issue(errors, `${path}.id`, 'identifiant invalide'); valid = false; }
  if (!validInteger(value.newCardsPerDay, 0, 10000)) { issue(errors, `${path}.newCardsPerDay`, 'entier entre 0 et 10000 attendu'); valid = false; }
  if (!validInteger(value.maxReviewsPerSession, 0, 10000)) { issue(errors, `${path}.maxReviewsPerSession`, 'entier entre 0 et 10000 attendu'); valid = false; }
  if (!['light', 'dark', 'system'].includes(value.theme as string)) { issue(errors, `${path}.theme`, 'thème light, dark ou system attendu'); valid = false; }
  if (typeof value.sound !== 'boolean') { issue(errors, `${path}.sound`, 'booléen attendu'); valid = false; }
  if (typeof value.haptics !== 'boolean') { issue(errors, `${path}.haptics`, 'booléen attendu'); valid = false; }
  if (!(value.desiredDifficulty === 'any' || [1, 2, 3, 4, 5].includes(value.desiredDifficulty as number))) { issue(errors, `${path}.desiredDifficulty`, 'difficulté entre 1 et 5 ou any attendue'); valid = false; }
  return valid;
}

/**
 * Converts settings written by the first two app schemas to the current
 * shape. v1 had no feedback toggles, v2 added sound/haptics, and the current
 * shape adds desiredDifficulty. Unknown keys are rejected so imports cannot
 * smuggle arbitrary data into IndexedDB.
 */
export function migrateSettings(value: unknown, fallbackId?: string): Settings | undefined {
  if (!isRecord(value)) return undefined;
  if (Object.keys(value).some(key => !LEGACY_SETTINGS_KEYS.includes(key))) return undefined;
  const version = value.version ?? value.settingsVersion;
  if (version !== undefined && (!validInteger(version, 1, 3))) return undefined;
  const id = value.id ?? fallbackId;
  if (typeof id !== 'string') return undefined;
  const migrated: Record<string, unknown> = {
    id,
    newCardsPerDay: value.newCardsPerDay,
    maxReviewsPerSession: value.maxReviewsPerSession,
    theme: value.theme,
    sound: value.sound ?? false,
    haptics: value.haptics ?? false,
    desiredDifficulty: value.desiredDifficulty ?? 'any',
  };
  const errors: string[] = [];
  if (!settingsErrors(migrated, 'settings', errors)) return undefined;
  return migrated as Settings;
}

function reviewStateErrors(value: unknown, path: string, errors: string[]): value is ReviewState {
  if (!isRecord(value)) {
    issue(errors, path, 'doit être un objet');
    return false;
  }
  hasOnlyKeys(value, STATE_KEYS, path, errors);
  let valid = true;
  if (!validId(value.id)) { issue(errors, `${path}.id`, 'identifiant invalide'); valid = false; }
  if (!validId(value.questionId)) { issue(errors, `${path}.questionId`, 'identifiant de question invalide'); valid = false; }
  if (!validId(value.profileId)) { issue(errors, `${path}.profileId`, 'identifiant de profil invalide'); valid = false; }
  if (!['new', 'learning', 'review', 'relearning'].includes(value.state as string)) { issue(errors, `${path}.state`, 'état de révision invalide'); valid = false; }
  if (!validIsoDate(value.dueAt)) { issue(errors, `${path}.dueAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (value.lastReviewedAt !== undefined && !validIsoDate(value.lastReviewedAt)) { issue(errors, `${path}.lastReviewedAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (validIsoDate(value.dueAt) && validIsoDate(value.lastReviewedAt) && Date.parse(value.dueAt as string) < Date.parse(value.lastReviewedAt as string)) { issue(errors, path, 'dueAt ne peut pas précéder lastReviewedAt'); valid = false; }
  if (!validInteger(value.reviewCount, 0)) { issue(errors, `${path}.reviewCount`, 'entier positif attendu'); valid = false; }
  if (!validInteger(value.lapseCount, 0) || (typeof value.reviewCount === 'number' && typeof value.lapseCount === 'number' && value.lapseCount > value.reviewCount)) { issue(errors, `${path}.lapseCount`, 'nombre de lapses incohérent'); valid = false; }
  if (typeof value.difficulty !== 'number' || !Number.isFinite(value.difficulty) || value.difficulty < 1 || value.difficulty > 10) { issue(errors, `${path}.difficulty`, 'nombre entre 1 et 10 attendu'); valid = false; }
  if (typeof value.stability !== 'number' || !Number.isFinite(value.stability) || value.stability <= 0 || value.stability > 3650) { issue(errors, `${path}.stability`, 'nombre strictement positif et inférieur à 3650 attendu'); valid = false; }
  if (value.lastRating !== undefined && !REVIEW_RATINGS.includes(value.lastRating as ReviewRating)) { issue(errors, `${path}.lastRating`, 'note de révision invalide'); valid = false; }
  if (value.state === 'new' && (value.reviewCount !== 0 || value.lastReviewedAt !== undefined || value.lastRating !== undefined)) { issue(errors, path, 'un état new ne peut pas avoir été révisé'); valid = false; }
  if (value.state !== 'new' && (value.reviewCount === 0 || value.lastReviewedAt === undefined || value.lastRating === undefined)) { issue(errors, path, 'un état révisé doit avoir une date, une note et un compteur'); valid = false; }
  if (value.state === 'relearning' && value.lastRating !== 'again') { issue(errors, `${path}.lastRating`, 'un état relearning doit provenir de again'); valid = false; }
  return valid;
}

function reviewEventErrors(value: unknown, path: string, errors: string[]): value is ReviewEvent {
  if (!isRecord(value)) {
    issue(errors, path, 'doit être un objet');
    return false;
  }
  hasOnlyKeys(value, EVENT_KEYS, path, errors);
  let valid = true;
  if (!validId(value.id)) { issue(errors, `${path}.id`, 'identifiant invalide'); valid = false; }
  if (!validId(value.profileId)) { issue(errors, `${path}.profileId`, 'identifiant de profil invalide'); valid = false; }
  if (!validId(value.questionId)) { issue(errors, `${path}.questionId`, 'identifiant de question invalide'); valid = false; }
  if (!validIsoDate(value.reviewedAt)) { issue(errors, `${path}.reviewedAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (!REVIEW_RATINGS.includes(value.rating as ReviewEvent['rating'])) { issue(errors, `${path}.rating`, 'note de révision invalide'); valid = false; }
  if (value.previousDueAt !== undefined && !validIsoDate(value.previousDueAt)) { issue(errors, `${path}.previousDueAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (!validIsoDate(value.nextDueAt)) { issue(errors, `${path}.nextDueAt`, 'date ISO 8601 UTC invalide'); valid = false; }
  if (value.responseTimeMs !== undefined && !validInteger(value.responseTimeMs, 0, 86_400_000)) { issue(errors, `${path}.responseTimeMs`, 'durée entière entre 0 et 86400000 ms attendue'); valid = false; }
  return valid;
}

export function validateProfile(value: unknown, errors: ValidationIssue[] = []): value is Profile {
  const before = errors.length;
  profileErrors(value, 'profile', errors);
  return errors.length === before;
}

export function validateSettings(value: unknown, errors: ValidationIssue[] = []): value is Settings {
  const before = errors.length;
  const migrated = migrateSettings(value);
  if (!migrated) issue(errors, 'settings', 'réglages v1, v2 ou actuels attendus');
  else settingsErrors(migrated, 'settings', errors);
  return errors.length === before;
}

export function assertValidSettings(value: unknown): asserts value is Settings {
  const errors: string[] = [];
  settingsErrors(value, 'settings', errors);
  if (errors.length) throw new Error(`Réglages invalides : ${errors.join('; ')}`);
}

export function validateReviewState(value: unknown, errors: ValidationIssue[] = []): value is ReviewState {
  const before = errors.length;
  reviewStateErrors(value, 'reviewState', errors);
  return errors.length === before;
}

export function validateReviewEvent(value: unknown, errors: ValidationIssue[] = []): value is ReviewEvent {
  const before = errors.length;
  reviewEventErrors(value, 'reviewEvent', errors);
  return errors.length === before;
}

/** Returns every structural/coherence issue, suitable for an import error message. */
export function exportValidationErrors(value: unknown): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  if (!isRecord(value)) {
    issue(errors, 'export', 'doit être un objet');
    return errors;
  }
  hasOnlyKeys(value, EXPORT_KEYS, 'export', errors);
  if (value.format !== 'general-knowledge-trainer') issue(errors, 'format', 'doit être general-knowledge-trainer');
  if (value.version !== 1) issue(errors, 'version', 'version 1 attendue');
  if (!validIsoDate(value.exportedAt)) issue(errors, 'exportedAt', 'date ISO 8601 UTC invalide');

  const profileValid = profileErrors(value.profile, 'profile', errors);
  const migratedSettings = migrateSettings(value.settings);
  const settingsValid = migratedSettings !== undefined;
  if (!settingsValid) issue(errors, 'settings', 'réglages v1, v2 ou actuels invalides');
  else settingsErrors(migratedSettings, 'settings', errors);
  const profile = profileValid ? value.profile as Profile : undefined;
  const settings = settingsValid ? migratedSettings : undefined;
  if (profile && settings && settings.id !== profile.id) issue(errors, 'settings.id', 'doit correspondre à profile.id');

  const states = value.reviewStates;
  const events = value.reviewEvents;
  if (!Array.isArray(states)) issue(errors, 'reviewStates', 'tableau attendu');
  if (!Array.isArray(events)) issue(errors, 'reviewEvents', 'tableau attendu');
  const stateKeys = new Set<string>();
  const stateIds = new Set<string>();
  const eventIds = new Set<string>();
  const stateQuestionIds = new Set<string>();
  if (Array.isArray(states)) {
    states.forEach((state, index) => {
      const path = `reviewStates[${index}]`;
      const valid = reviewStateErrors(state, path, errors);
      if (valid) {
        const typedState = state as ReviewState;
        if (profile && typedState.profileId !== profile.id) issue(errors, `${path}.profileId`, 'doit correspondre à profile.id');
        const key = `${typedState.profileId}:${typedState.questionId}`;
        if (stateKeys.has(key)) issue(errors, path, 'une seule ReviewState est autorisée par profil et question');
        stateKeys.add(key);
        stateQuestionIds.add(typedState.questionId);
        if (stateIds.has(typedState.id)) issue(errors, `${path}.id`, 'identifiant dupliqué');
        stateIds.add(typedState.id);
      }
    });
  }
  if (Array.isArray(events)) {
    events.forEach((event, index) => {
      const path = `reviewEvents[${index}]`;
      const valid = reviewEventErrors(event, path, errors);
      if (valid) {
        const typedEvent = event as ReviewEvent;
        if (profile && typedEvent.profileId !== profile.id) issue(errors, `${path}.profileId`, 'doit correspondre à profile.id');
        if (!stateQuestionIds.has(typedEvent.questionId)) issue(errors, `${path}.questionId`, 'ne correspond à aucun état de révision exporté');
        if (eventIds.has(typedEvent.id)) issue(errors, `${path}.id`, 'identifiant dupliqué');
        eventIds.add(typedEvent.id);
      }
    });
  }
  return errors;
}

export function validateExport(value: unknown, errors: ValidationIssue[] = []): value is ExportBundle {
  const found = exportValidationErrors(value);
  errors.push(...found);
  return found.length === 0;
}

export function assertValidExport(value: unknown): asserts value is ExportBundle {
  const errors = exportValidationErrors(value);
  if (errors.length > 0) throw new Error(`Fichier Flashmemory invalide : ${errors.join('; ')}`);
}

/** Validates and materialises a current-shape bundle from a legacy export. */
export function normalizeExport(value: unknown): ExportBundle {
  assertValidExport(value);
  const migrated = migrateSettings(value.settings);
  if (!migrated) throw new Error('Fichier Flashmemory invalide : réglages impossibles à migrer.');
  return { ...value, settings: migrated };
}

export function validateCatalog(catalog: unknown[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const factIds = new Set<string>();
  catalog.forEach((q, i) => {
    if (!validateQuestion(q)) errors.push(`Question ${i + 1} invalide`);
    else {
      if (ids.has(q.id)) errors.push(`ID dupliqué: ${q.id}`);
      ids.add(q.id);
      if (factIds.has(q.factId)) errors.push(`factId dupliqué: ${q.factId}`);
      factIds.add(q.factId);
    }
  });
  return errors;
}

export function validateQuestion(q: unknown): q is Question {
  if (!isRecord(q)) return false;
  const x = q as Partial<Question>;
  if (!validId(x.id) || !validId(x.factId) || !validProvenance(x.provenance, x.factId) || !validText(x.question) || !validText(x.answer) || !validText(x.explanation) || !validText(x.category) || typeof x.category !== 'string' || !TOPICS.includes(x.category) || ![1, 2, 3, 4, 5].includes(x.difficulty as number)) return false;
  if (!['flashcard', 'multiple-choice', 'true-false'].includes(x.type || '')) return false;
  if (x.type === 'multiple-choice' && (!Array.isArray(x.choices) || x.choices.length < 2 || x.choices.some(choice => !validText(choice)) || x.correctChoice === undefined || !Number.isInteger(x.correctChoice) || x.correctChoice < 0 || x.correctChoice >= x.choices.length || new Set(x.choices).size !== x.choices.length || x.answer !== x.choices[x.correctChoice])) return false;
  if (x.type === 'true-false' && x.answer !== 'Vrai' && x.answer !== 'Faux') return false;
  return true;
}

export const isDue = (state: ReviewState, now = new Date()) => new Date(state.dueAt).getTime() <= now.getTime();
