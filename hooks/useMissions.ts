/**
 * hooks/useMissions.ts
 * ─────────────────────────────────────────────────────────────────
 * Fetches missions for a specific city/challenge.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Mission {
  id: string;
  challenge_id: string;
  city_id: string;
  title_fr: string;
  title_ar: string | null;
  description_fr: string | null;
  mission_type: 'challenge' | 'dialogue' | 'minigame' | 'scenario';
  narration?: any;
  profils?: any;
  metadata?: any;
}

// ─── In-memory cache ──────────────────────────────────────────────
let _missionCache: Record<string, Mission[]> = {};

export function useMissions(cityId: string | null) {
  const [missions, setMissions] = useState<Mission[]>(
    cityId ? (_missionCache[cityId] ?? []) : []
  );
  const [loading, setLoading] = useState(cityId ? !_missionCache[cityId] : false);

  const fetchMissions = async (targetCityId: string) => {
    const { data } = await supabase
      .from('missions')
      .select('*')
      .eq('city_id', targetCityId)
      .eq('is_published', true)
      .order('sort_order');
    
    const result = data || [];
    _missionCache[targetCityId] = result;
    setMissions(result);
    setLoading(false);
  };

  useEffect(() => {
    if (!cityId) return;
    if (_missionCache[cityId]) {
      setMissions(_missionCache[cityId]);
      setLoading(false);
      return;
    }
    
    fetchMissions(cityId);
  }, [cityId]);

  return { missions, loading, refresh: () => cityId && fetchMissions(cityId) };
}

/** Preload all missions into the cache */
export async function preloadAllMissions() {
  const { data } = await supabase
    .from('missions')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');

  if (data) {
    const newCache: Record<string, Mission[]> = {};
    data.forEach((m: Mission) => {
      if (!newCache[m.city_id]) newCache[m.city_id] = [];
      newCache[m.city_id].push(m);
    });
    _missionCache = newCache;
  }
}
