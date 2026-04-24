import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { dbService } from '../services/database';
import { syncPlayerProgress } from '../services/sync';

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
      // 1. Try local data first (Fast)
      const localData = await dbService.getCitiesProgression();
      if (localData.length > 0) {
        const progressMap: Record<string, PlayerCityProgress> = {};
        localData.forEach((p: any) => {
          progressMap[p.id] = {
            city_id: p.id,
            status: p.status as CityStatus,
            missions_completed: p.missions_completed || 0,
            missions_total: p.missions_total || 5,
            xp_earned: p.score || 0,
          };
        });
        setProgress(progressMap);
      }

      // 2. Fetch from Supabase (Source of truth)
      const { data, error: err } = await supabase
        .from('player_city_progress')
        .select('*')
        .eq('player_id', user.id);

      if (err) throw err;

      if (data) {
        const progressMap: Record<string, PlayerCityProgress> = {};
        data.forEach((p: any) => {
          progressMap[p.city_id] = {
            city_id: p.city_id,
            status: p.status,
            missions_completed: p.missions_completed,
            missions_total: p.missions_total,
            xp_earned: p.xp_earned,
          };
        });
        setProgress(progressMap);
        // Persist to local for offline use
        await dbService.savePlayerProgress(data);
      }
    } catch (err: any) {
      console.error('Failed to fetch player progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAndInitializeProgress = async () => {
    if (!user) return;
    
    // Only proceed if user.id is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    if (!isUuid) {
      console.warn('⚠️ Skipping progress initialization: User ID is not a valid UUID');
      return;
    }
    
    try {
      const { data, error: err } = await supabase
        .from('player_city_progress')
        .select('id')
        .eq('player_id', user.id);
        
      if (err) throw err;
      
      if (!data || data.length === 0) {
        // Ensure profile exists first to satisfy FK constraint
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: user.id,
          full_name: user.full_name || 'Voyageur',
          xp: user.xp || 0,
          level: user.level || 1,
        });

        if (profileErr) {
          console.error('Failed to ensure profile exists:', profileErr.message);
          // If it's a constraint error here, it means we can't even create the profile
          // But usually upsert handles existence.
        }

        // Initialize all cities
        const CITY_DATA: Record<string, { fr: string, ar: string }> = {
          'rabat': { fr: 'Rabat', ar: 'الرباط' },
          'chefchaouen': { fr: 'Chefchaouen', ar: 'شفشاون' },
          'fes': { fr: 'Fès', ar: 'فاس' },
          'marrakech': { fr: 'Marrakech', ar: 'مراكش' },
          'laayoune': { fr: 'Laâyoune', ar: 'العيون' },
          'dakhla': { fr: 'Dakhla', ar: 'الداخلة' }
        };

        const CITY_SEQUENCE = Object.keys(CITY_DATA);
        const initialProgress = CITY_SEQUENCE.map((cityId, index) => ({
          player_id: user.id,
          city_id: cityId,
          city_name_fr: CITY_DATA[cityId].fr,
          city_name_ar: CITY_DATA[cityId].ar,
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

    // Real-time subscription - Only if user.id is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    
    if (!isUuid) {
      console.warn('⚠️ Skipping realtime subscription: User ID is not a valid UUID');
      return;
    }

    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`player_progress_${user.id}_${channelId}`)
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
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('📡 Subscribed to player progress changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime subscription error');
        }
      });

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
      // Optimistic local update
      await dbService.updateLocalCityProgress(cityId, nextCount, isDone ? 'done' : 'current');

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
            // Optimistic local update
            await dbService.updateLocalCityProgress(nextCityId, 0, 'current');

            await supabase
              .from('player_city_progress')
              .update({ status: 'current' })
              .eq('player_id', user.id)
              .eq('city_id', nextCityId);
          }
        }
      }

      // Background sync to ensure local is up to date with server
      await syncPlayerProgress(user.id);
      await fetchProgress();
    } catch (err: any) {
      console.error('Failed to increment mission progress:', err.message);
    }
  };

  return { progress, loading, error, refresh: fetchProgress, incrementMissionProgress };
}
