import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export type CityStatus = 'locked' | 'current' | 'done';

export interface PlayerCityProgress {
  city_id: string;
  status: CityStatus;
  missions_completed: number;
  missions_total: number;
  xp_earned: number;
}

export function usePlayerCityProgress() {
  const user = useAuthStore((state) => state.user);
  const [progress, setProgress] = useState<Record<string, PlayerCityProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from('player_city_progress')
        .select('*')
        .eq('player_id', user.id);

      if (err) throw err;

      const progressMap: Record<string, PlayerCityProgress> = {};
      (data || []).forEach((p: any) => {
        progressMap[p.city_id] = {
          city_id: p.city_id,
          status: p.status,
          missions_completed: p.missions_completed,
          missions_total: p.missions_total,
          xp_earned: p.xp_earned,
        };
      });

      setProgress(progressMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();

    if (!user) return;

    // Real-time subscription
    const channel = supabase
      .channel('player_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_city_progress',
          filter: `player_id=eq.${user.id}`,
        },
        () => {
          fetchProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const incrementMissionProgress = async (cityId: string) => {
    if (!user) return;

    try {
      // Find current progress for this city
      const current = progress[cityId];
      const nextCount = (current?.missions_completed ?? 0) + 1;
      
      const { error: err } = await supabase
        .from('player_city_progress')
        .update({ 
          missions_completed: nextCount,
          status: nextCount >= (current?.missions_total ?? 5) ? 'done' : 'current'
        })
        .eq('player_id', user.id)
        .eq('city_id', cityId);

      if (err) throw err;
      await fetchProgress();
    } catch (err: any) {
      console.error('Failed to increment mission progress:', err.message);
    }
  };

  return { progress, loading, error, refresh: fetchProgress, incrementMissionProgress };
}
