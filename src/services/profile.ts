import { profileRepo, settingsRepo } from '../storage/db';
import type { Profile } from '../domain/types';
import { defaultSettings } from './data';
const id = () => crypto.randomUUID();
export async function createProfile(name: string, topics: string[], level: Profile['level'] = 'any') { const profile: Profile = { id: id(), name: name.trim(), activeTopics: topics, level, createdAt: new Date().toISOString() }; await profileRepo.put(profile); await settingsRepo.put(defaultSettings(profile.id)); return profile; }
export async function renameProfile(profile: Profile, name: string) { const updated = { ...profile, name: name.trim() }; await profileRepo.put(updated); return updated; }
export async function deleteProfile(profileId: string) { await profileRepo.remove(profileId); }
