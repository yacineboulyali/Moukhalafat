import { useEffect, useState } from 'react';
import { dbService } from '../services/database';
import { syncCurriculum } from '../services/sync';

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

// ─── Hook ─────────────────────────────────────────────────────────
export function useChallenges() {
  const [challenges, setChallenges] = useState<Record<string, Challenge>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      let data = await dbService.getChallenges();
      
      // If no data in SQLite, try to sync once
      if (data.length === 0) {
        console.log('No challenges in SQLite, attempting initial sync...');
        await syncCurriculum();
        data = await dbService.getChallenges();
      }

      const finalMap: Record<string, Challenge> = {};
      data.forEach((c: any) => {
        finalMap[c.city_id] = {
          ...c,
          is_published: c.is_published === 1
        };
      });

      setChallenges(finalMap);
    } catch (err: any) {
      console.error('Failed to load challenges from SQLite:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    // Force sync from remote then reload
    await syncCurriculum();
    await loadChallenges();
  };

  return { challenges, loading, error, refresh };
}
