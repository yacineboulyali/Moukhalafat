import { supabase } from '../lib/supabase';
import { dbService } from './database';

export const ProgressService = {
  /**
   * Increments the number of completed missions for a player in a city.
   * If all missions are completed, marks the city as 'done' and unlocks the next one.
   */
  async completeMission(playerId: string, cityId: string) {
    try {
      // ─── 1. Update Local SQLite (Source of truth for offline) ───
      // Get current local progression
      const localCities = await dbService.getCitiesProgression();
      const localCity = localCities.find(c => c.id === cityId);
      
      // In this simple model, we just record completion. 
      // For more granular tracking, we'd need missions_completed in SQLite.
      await dbService.completeCity(cityId, localCity?.score ?? 0);
      
      // ─── 2. Update Supabase (Best effort) ───
      // We don't await this or we handle failures gracefully
      this.syncProgressToRemote(playerId, cityId).catch(err => {
        console.warn('Could not sync progress to remote (offline?):', err.message);
      });

      return { success: true };
    } catch (err) {
      console.error('Error completing mission:', err);
      return { success: false, error: err };
    }
  },

  async syncProgressToRemote(playerId: string, cityId: string) {
    // 1. Get current remote progress
    const { data: progress, error: fetchErr } = await supabase
      .from('player_city_progress')
      .select('*')
      .eq('player_id', playerId)
      .eq('city_id', cityId)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr;

    const currentCompleted = progress?.missions_completed ?? 0;
    const totalMissions = progress?.missions_total ?? 4;
    const newCompleted = currentCompleted + 1;

    // 2. Update current city progress
    const isCityDone = newCompleted >= totalMissions;
    
    const { error: updateErr } = await supabase
      .from('player_city_progress')
      .upsert({
        player_id: playerId,
        city_id: cityId,
        missions_completed: newCompleted,
        status: isCityDone ? 'done' : 'current',
        completed_at: isCityDone ? new Date().toISOString() : null,
        city_name_fr: progress?.city_name_fr ?? cityId,
        city_name_ar: progress?.city_name_ar ?? '',
      });

    if (updateErr) throw updateErr;

    // 3. If city is done, unlock the next city
    if (isCityDone) {
      const { data: allChallenges } = await supabase
        .from('challenges')
        .select('city_id, sort_order')
        .order('sort_order');

      if (allChallenges) {
        const currentCity = allChallenges.find(c => c.city_id === cityId);
        const nextCity = allChallenges.find(c => c.sort_order > (currentCity?.sort_order ?? 0));

        if (nextCity) {
          await supabase
            .from('player_city_progress')
            .upsert({
              player_id: playerId,
              city_id: nextCity.city_id,
              status: 'current',
              city_name_fr: nextCity.city_id,
            });
          
          // Also unlock locally
          await dbService.unlockCity(nextCity.city_id);
        }
      }
    }
  }
};
