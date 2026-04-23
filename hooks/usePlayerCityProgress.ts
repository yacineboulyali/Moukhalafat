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

  const checkAndInitializeProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error: err } = await supabase
        .from('player_city_progress')
        .select('id')
        .eq('player_id', user.id);
        
      if (err) throw err;
      
      if (!data || data.length === 0) {
        // Initialize all cities
        const CITY_SEQUENCE = ['rabat', 'chefchaouen', 'fes', 'marrakech', 'laayoune', 'dakhla'];
        const initialProgress = CITY_SEQUENCE.map((cityId, index) => ({
          player_id: user.id,
          city_id: cityId,
          status: index === 0 ? 'current' : 'locked',
          missions_completed: 0,
          missions_total: 5 
        }));
        
        const { error: insErr } = await supabase.from('player_city_progress').insert(initialProgress);
        if (insErr) throw insErr;
        await fetchProgress();
      }
    } catch (err: any) {
      console.error('Failed to initialize progress:', err.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchProgress();
    checkAndInitializeProgress();

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
      // 1. Define city sequence
      const CITY_SEQUENCE = ['rabat', 'chefchaouen', 'fes', 'marrakech', 'laayoune', 'dakhla'];
      
      // 2. Find current progress for this city
      const current = progress[cityId];
      const nextCount = (current?.missions_completed ?? 0) + 1;
      const total = current?.missions_total ?? 5;
      const isDone = nextCount >= total;
      
      // 3. Update current city
      const { error: err } = await supabase
        .from('player_city_progress')
        .update({ 
          missions_completed: nextCount,
          status: isDone ? 'done' : 'current'
        })
        .eq('player_id', user.id)
        .eq('city_id', cityId);

      if (err) throw err;

      // 4. Unlock next city if current is done
      if (isDone) {
        const currentIndex = CITY_SEQUENCE.indexOf(cityId);
        if (currentIndex !== -1 && currentIndex < CITY_SEQUENCE.length - 1) {
          const nextCityId = CITY_SEQUENCE[currentIndex + 1];
          const nextProgress = progress[nextCityId];
          
          // Only unlock if it's currently locked
          if (!nextProgress || nextProgress.status === 'locked') {
            await supabase
              .from('player_city_progress')
              .update({ status: 'current' })
              .eq('player_id', user.id)
              .eq('city_id', nextCityId);
          }
        }
      }

      await fetchProgress();
    } catch (err: any) {
      console.error('Failed to increment mission progress:', err.message);
    }
  };

  return { progress, loading, error, refresh: fetchProgress, incrementMissionProgress };
}
