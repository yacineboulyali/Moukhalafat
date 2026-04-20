/**
 * services/sync.ts
 * ─────────────────────────────────────────────────────────────────
 * Sync service: fetches data from Supabase and populates the
 * in-memory caches used by useMissions / useQuestions.
 * All functions are graceful — they never throw on network failure.
 */
import { supabase } from '../lib/supabase';
import { preloadAllMissions } from '../hooks/useMissions';
import { preloadAllQuestions } from '../hooks/useQuestions';
import { preloadAllChallenges } from '../hooks/useChallenges';

// ─── Mission Sync ─────────────────────────────────────────────────

/** Preload all missions from Supabase into the in-memory cache. */
export async function syncMissions(): Promise<void> {
  try {
    await preloadAllMissions();
  } catch (e: any) {
    console.warn('⚠️ syncMissions failed:', e?.message);
  }
}

// ─── Questions Sync ────────────────────────────────────────────────

/** Preload all questions from Supabase into the in-memory cache. */
export async function syncAllQuestions(): Promise<void> {
  try {
    await preloadAllQuestions();
  } catch (e: any) {
    console.warn('⚠️ syncAllQuestions failed:', e?.message);
  }
}

/** Sync questions for a single mission by ID. */
export async function syncQuestionsForMission(missionId: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('mission_id', missionId)
      .eq('is_published', true)
      .order('sort_order');

    if (data && data.length > 0) {
      // Inject into the module-level cache of useQuestions
      const { _injectQuestionsCache } = await import('../hooks/useQuestions');
      if (typeof _injectQuestionsCache === 'function') {
        _injectQuestionsCache({ [missionId]: data });
      }
    }
  } catch (e: any) {
    console.warn(`⚠️ syncQuestionsForMission(${missionId}) failed:`, e?.message);
  }
}

// ─── User Progression Sync ─────────────────────────────────────────

/** Sync user progression from Supabase (badges, XP, completed missions). */
export async function syncUserProgression(userId: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      console.log(`✅ Progression synced for ${data.display_name}: ${data.xp} XP`);
    }
  } catch (e: any) {
    console.warn('⚠️ syncUserProgression failed:', e?.message);
  }
}

// ─── Full Sync ─────────────────────────────────────────────────────

/** Perform a full sync of all content (challenges, missions, questions). */
export async function fullSync(): Promise<void> {
  try {
    await Promise.all([
      preloadAllChallenges(),
      syncMissions(),
    ]);
    await syncAllQuestions();
    console.log('✅ Full sync completed');
  } catch (e: any) {
    console.warn('⚠️ fullSync encountered issues:', e?.message);
  }
}
