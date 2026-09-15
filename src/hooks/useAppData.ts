import { useCallback, useEffect, useState } from 'react';
import { profileRepo, reviewRepo, settingsRepo } from '../services/repositories';
import type { Profile, ReviewEvent, ReviewState, Settings } from '../domain/types';
import { defaultSettings } from '../services/data';
export function useAppData(profileId?: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]); const [states, setStates] = useState<ReviewState[]>([]); const [events, setEvents] = useState<ReviewEvent[]>([]); const [settings, setSettings] = useState<Settings>();
  const [profilesLoading, setProfilesLoading] = useState(true);
  const refreshProfiles = useCallback(async () => {
    setProfilesLoading(true);
    try {
      setProfiles(await profileRepo.all());
    } finally {
      setProfilesLoading(false);
    }
  }, []);
  const refresh = useCallback(async () => { if (!profileId) return; const [s, e, set] = await Promise.all([reviewRepo.states(profileId), reviewRepo.events(profileId), settingsRepo.get(profileId)]); setStates(s); setEvents(e); setSettings(set ?? defaultSettings(profileId)); }, [profileId]);
  useEffect(() => { void refreshProfiles(); }, [refreshProfiles]); useEffect(() => { void refresh(); }, [refresh]);
  return { profiles, profilesLoading, states, events, settings, refreshProfiles, refresh, setStates, setEvents, setSettings };
}
