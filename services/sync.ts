import { supabase } from '../lib/supabase';
import { dbService } from './database';

export async function syncCurriculum() {
  console.log('🔄 Starting curriculum sync...');
  
  try {
    // 1. Sync Challenges
    const { data: challenges, error: cErr } = await supabase
      .from('challenges')
      .select('*')
      .order('sort_order');
    
    if (cErr) throw cErr;
    if (challenges) {
      await dbService.saveChallenges(challenges);
      console.log(`✅ ${challenges.length} challenges synced.`);
    }

    // 2. Sync Missions
    const { data: missions, error: mErr } = await supabase
      .from('missions')
      .select('*')
      .order('sort_order');
    
    if (mErr) throw mErr;
    if (missions) {
      await dbService.saveMissions(missions);
      console.log(`✅ ${missions.length} missions synced.`);
    }

    // 3. Sync Questions
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('*')
      .order('sort_order');
    
    if (qErr) throw qErr;
    if (questions) {
      await dbService.saveQuestions(questions);
      console.log(`✅ ${questions.length} questions synced.`);
    }

    console.log('🎉 Curriculum sync complete!');
    return true;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return false;
  }
}
