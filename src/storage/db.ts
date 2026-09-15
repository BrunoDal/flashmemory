import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ExportBundle, Profile, ReviewEvent, ReviewState, Settings, StudySession } from '../domain/types';
import { assertValidSettings, migrateSettings } from '../domain/validation';

interface FlashSchema extends DBSchema {
  profiles: { key: string; value: Profile };
  states: { key: string; value: ReviewState; indexes: { profile: string; due: string } };
  events: { key: string; value: ReviewEvent; indexes: { profile: string; reviewedAt: string } };
  settings: { key: string; value: Settings };
  sessions: { key: string; value: StudySession; indexes: { profile: string; status: string; updatedAt: string } };
}

const DATABASE_NAME = 'flashmemory';
let dbPromise: Promise<IDBPDatabase<FlashSchema>> | undefined;
export const getDb = () => dbPromise ??= openDB<FlashSchema>(DATABASE_NAME, 3, { upgrade(db) {
  if (!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles', { keyPath: 'id' });
  if (!db.objectStoreNames.contains('states')) {
    const states = db.createObjectStore('states', { keyPath: 'id' }); states.createIndex('profile', 'profileId'); states.createIndex('due', 'dueAt');
  }
  if (!db.objectStoreNames.contains('events')) {
    const events = db.createObjectStore('events', { keyPath: 'id' }); events.createIndex('profile', 'profileId'); events.createIndex('reviewedAt', 'reviewedAt');
  }
  if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
  if (!db.objectStoreNames.contains('sessions')) {
    const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
    sessions.createIndex('profile', 'profileId');
    sessions.createIndex('status', 'status');
    sessions.createIndex('updatedAt', 'updatedAt');
  }
} });

/**
 * Test-only lifecycle hooks. Production code should keep the database open;
 * integration tests use these hooks to simulate an application restart and to
 * remove all state between isolated cases without changing the production DB
 * name or schema.
 */
export async function closeDbForTests(): Promise<void> {
  const current = dbPromise;
  dbPromise = undefined;
  const db = await current?.catch(() => undefined);
  db?.close();
}

export async function resetDbForTests(): Promise<void> {
  await closeDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Impossible de supprimer la base de test.'));
    request.onblocked = () => reject(new Error('La suppression de la base de test est bloquée.'));
  });
}

export const profileRepo = {
  async all() { return (await getDb()).getAll('profiles'); },
  async get(id: string) { return (await getDb()).get('profiles', id); },
  async put(profile: Profile) { return (await getDb()).put('profiles', profile); },
  /** Delete a profile and every dependent record in one IndexedDB transaction. */
  async remove(id: string) {
    const db = await getDb();
    const transaction = db.transaction(['profiles', 'settings', 'states', 'events', 'sessions'], 'readwrite');
    const states = transaction.objectStore('states');
    const events = transaction.objectStore('events');
    const sessions = transaction.objectStore('sessions');
    const [stateKeys, eventKeys, sessionKeys] = await Promise.all([
      states.index('profile').getAllKeys(id),
      events.index('profile').getAllKeys(id),
      sessions.index('profile').getAllKeys(id),
    ]);
    for (const key of stateKeys) states.delete(key);
    for (const key of eventKeys) events.delete(key);
    for (const key of sessionKeys) sessions.delete(key);
    transaction.objectStore('settings').delete(id);
    transaction.objectStore('profiles').delete(id);
    await transaction.done;
  }
};
export const reviewRepo = {
  async states(profileId: string) { return (await getDb()).getAllFromIndex('states', 'profile', profileId); },
  async putState(state: ReviewState) { return (await getDb()).put('states', state); },
  async events(profileId: string) { return (await getDb()).getAllFromIndex('events', 'profile', profileId); },
  async putEvent(event: ReviewEvent) { return (await getDb()).put('events', event); }
};
export const settingsRepo = {
  async get(id: string) {
    const db = await getDb();
    const stored = await db.get('settings', id);
    if (!stored) return undefined;
    const migrated = migrateSettings(stored, id);
    if (!migrated) throw new Error('Les réglages enregistrés sont invalides.');
    // Upgrade v1/v2 records lazily as they are read, which also works when an
    // older database was opened by a browser that cannot run an async upgrade.
    if (JSON.stringify(stored) !== JSON.stringify(migrated)) await db.put('settings', migrated);
    return migrated;
  },
  async put(settings: Settings) { assertValidSettings(settings); return (await getDb()).put('settings', settings); }
};

/** Repository for the resumable study cursor. The UI never needs to know that
 * this is backed by IndexedDB. */
export const sessionRepo = {
  async get(id: string) { return (await getDb()).get('sessions', id); },
  async put(session: StudySession) { return (await getDb()).put('sessions', session); },
  async active(profileId: string) {
    const sessions = await (await getDb()).getAllFromIndex('sessions', 'profile', profileId);
    return sessions
      .filter(session => session.status === 'active')
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
  },
  async all(profileId: string) { return (await getDb()).getAllFromIndex('sessions', 'profile', profileId); },
  async remove(id: string) { return (await getDb()).delete('sessions', id); },
};

/** Persist a review and the advanced session cursor as one transaction. A
 * crash between these writes can otherwise make the same answer appear twice
 * or move the cursor without the corresponding ReviewState. */
export async function persistReviewAndSession(state: ReviewState, event: ReviewEvent, session?: StudySession): Promise<void> {
  const db = await getDb();
  const stores = session ? ['states', 'events', 'sessions'] as const : ['states', 'events'] as const;
  const transaction = db.transaction(stores, 'readwrite');
  transaction.objectStore('states').put(state);
  transaction.objectStore('events').put(event);
  if (session) transaction.objectStore('sessions').put(session);
  await transaction.done;
}

/**
 * Replaces one profile and all of its dependent data in one IDB transaction.
 * The caller must validate the bundle before invoking this storage primitive.
 * Existing data is only removed when overwrite is explicitly true.
 */
export async function importProfileBundle(bundle: ExportBundle, overwrite = false): Promise<void> {
  const db = await getDb();
  const transaction = db.transaction(['profiles', 'settings', 'states', 'events', 'sessions'], 'readwrite');
  try {
    const profiles = transaction.objectStore('profiles');
    const existing = await profiles.get(bundle.profile.id);
    if (existing && !overwrite) {
      transaction.abort();
      try { await transaction.done; } catch { /* expected abort */ }
      throw new Error('Ce profil existe déjà. Choisissez un autre profil ou confirmez le remplacement explicite.');
    }

    if (existing) {
      const states = transaction.objectStore('states');
      const events = transaction.objectStore('events');
      const sessions = transaction.objectStore('sessions');
      const [stateKeys, eventKeys, sessionKeys] = await Promise.all([
        states.index('profile').getAllKeys(bundle.profile.id),
        events.index('profile').getAllKeys(bundle.profile.id),
        sessions.index('profile').getAllKeys(bundle.profile.id),
      ]);
      for (const key of stateKeys) states.delete(key);
      for (const key of eventKeys) events.delete(key);
      for (const key of sessionKeys) sessions.delete(key);
      transaction.objectStore('settings').delete(bundle.profile.id);
      profiles.delete(bundle.profile.id);
    }

    profiles.put(bundle.profile);
    transaction.objectStore('settings').put({ ...bundle.settings, id: bundle.profile.id });
    const states = transaction.objectStore('states');
    const events = transaction.objectStore('events');
    for (const state of bundle.reviewStates) states.put(state);
    for (const event of bundle.reviewEvents) events.put(event);
    await transaction.done;
  } catch (error) {
    try { transaction.abort(); } catch { /* already completed or aborted */ }
    throw error;
  }
}
