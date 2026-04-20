/**
 * hooks/useQuestions.ts
 * ─────────────────────────────────────────────────────────────────
 * Fetches questions for a specific mission from Supabase.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Question {
  id: string;
  mission_id: string;
  title_fr?: string | null;
  title_ar?: string | null;
  presentation_fr?: string | null;
  presentation_ar?: string | null;
  question_fr: string;
  question_ar: string | null;
  question_type: string;
  options: any; // JSON structure depends on type
  correct_answer: string;
  score_decision: number;
  score_equipe: number;
  score_stress: number;
  xp_reward: number;
  time_limit_sec: number;
  hint_fr: string | null;
  hint_ar: string | null;
  explanation_fr: string | null;
  explanation_ar: string | null;
  audio_url?: string | null;
  character_id?: string | null;
  feedback_positive_fr?: string | null;
  feedback_positive_ar?: string | null;
  feedback_negative_fr?: string | null;
  feedback_negative_ar?: string | null;
  sort_order: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  context_dialogue?: any;
  soft_skills_impact?: any;
}

// ─── In-memory cache ──────────────────────────────────────────────
let _questionCache: Record<string, Question[]> = {};

export function _injectQuestionsCache(cache: Record<string, Question[]>) {
  _questionCache = cache;
}

export function useQuestions(missionId: string | null) {
  const [questions, setQuestions] = useState<Question[]>(
    missionId ? (_questionCache[missionId] ?? []) : []
  );
  const [loading, setLoading] = useState(missionId ? !_questionCache[missionId] : false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (targetMissionId: string) => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('questions')
      .select('*')
      .eq('mission_id', targetMissionId)
      .eq('is_published', true)
      .order('sort_order');

    if (err) {
      setError(err.message);
    } else {
      const result = data || [];
      _questionCache[targetMissionId] = result;
      setQuestions(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!missionId) return;
    if (_questionCache[missionId]) {
      setQuestions(_questionCache[missionId]);
      setLoading(false);
      return;
    }
    
    fetchQuestions(missionId);
  }, [missionId]);

  return { questions, loading, error, refresh: () => missionId && fetchQuestions(missionId) };
}

/** Preload all questions into the cache */
export async function preloadAllQuestions() {
  // No-op: Data is now synced via syncMissions
}
