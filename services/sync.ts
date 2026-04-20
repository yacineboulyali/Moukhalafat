/**
 * services/sync.ts
 * ─────────────────────────────────────────────────────────────────
 * Sync service: fetches data from Supabase and populates the
 * local SQLite database for offline-first support.
 */
import { supabase } from '../lib/supabase';
import { dbService } from './database';

export async function syncChallenges() {
  const { data: challenges, error: cErr } = await supabase
    .from('challenges')
    .select('*')
    .order('sort_order');
  
  if (cErr) throw cErr;
  if (challenges) {
    await dbService.saveChallenges(challenges);
    console.log(`✅ ${challenges.length} challenges synced.`);
  }
  return challenges;
}

export async function syncMissions() {
  const { data: missions, error: mErr } = await supabase
    .from('missions')
    .select('*')
    .order('sort_order');
  
  if (mErr) throw mErr;
  if (missions) {
    await dbService.saveMissions(missions);
    console.log(`✅ ${missions.length} missions synced.`);
  }
  return missions;
}

export async function syncQuestions() {
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .order('sort_order');
  
  if (qErr) throw qErr;
  if (questions) {
    await dbService.saveQuestions(questions);
    console.log(`✅ ${questions.length} questions synced.`);
  }
  return questions;
}

/** 
 * Main curriculum sync entry point.
 * Populates SQLite with challenges, missions, and questions.
 */
export async function syncCurriculum() {
  console.log('🔄 Starting curriculum sync...');
  try {
    // Run in sequence to preserve relational order
    await syncChallenges();
    await syncMissions();
    await syncQuestions();
    console.log('🎉 Curriculum sync complete!');
    return true;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return false;
  }
}

/** Placeholder for fullSync if referenced elsewhere */
export const fullSync = syncCurriculum;
