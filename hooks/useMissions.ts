import { useEffect, useState } from 'react';
import { dbService } from '../services/database';
import { syncMissions } from '../services/sync';

export const preloadAllMissions = syncMissions;

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

export function useMissions(cityId: string | null) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async (targetCityId: string) => {
    setLoading(true);
    try {
      const result = await dbService.getMissionsByCity(targetCityId);
      setMissions(result);
    } catch (err: any) {
      console.error('Failed to fetch missions from SQLite:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cityId) return;
    fetchMissions(cityId);
  }, [cityId]);

  return { missions, loading, error, refresh: () => cityId && fetchMissions(cityId) };
}
