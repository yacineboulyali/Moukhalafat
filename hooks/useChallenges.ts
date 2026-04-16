/**
 * hooks/useChallenges.ts
 * ─────────────────────────────────────────────────────────────────
 * Fetches all challenges from Supabase and exposes them as a
 * map keyed by city_id.  Results are cached in-memory for the
 * session so subsequent navigations are instant.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ─── Type ─────────────────────────────────────────────────────────
export interface Challenge {
  id: string;
  city_id: string;
  city_name_fr: string;
  city_name_ar: string | null;
  city_color: string;
  headline_fr: string;
  headline_ar: string | null;
  description_fr: string;
  description_ar: string | null;
  focus_fr: string | null;
  step_label: string | null;
  progress: number;
  illustration_url: string | null;
  sort_order: number;
  is_published: boolean;
  missions_title_fr: string | null;
  missions_title_ar: string | null;
}

// ─── In-memory cache ──────────────────────────────────────────────
let _cache: Record<string, Challenge> | null = null;

// ─── Hook ─────────────────────────────────────────────────────────
export function useChallenges() {
  const [challenges, setChallenges] = useState<Record<string, Challenge>>(
    _cache ?? {}
  );
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('challenges')
      .select('*')
      .order('sort_order');

    if (err) {
      console.warn('Supabase fetch failed:', err.message);
      setError(err.message);
      setLoading(false);
      return;
    }

    const finalMap: Record<string, Challenge> = {};
    (data ?? []).forEach((c: Challenge) => {
      finalMap[c.city_id] = c;
    });

    _cache = finalMap;
    setChallenges(finalMap);
    setLoading(false);
  };

  return { challenges, loading, error, refresh };
}

/** Preload all challenges into the cache */
export async function preloadAllChallenges() {
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .order('sort_order');

  if (data) {
    const map: Record<string, Challenge> = {};
    data.forEach((c: Challenge) => {
      map[c.city_id] = c;
    });
    _cache = map;
  }
}
