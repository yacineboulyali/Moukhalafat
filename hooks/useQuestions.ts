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
  sort_order: number;
  context_dialogue?: any;
  soft_skills_impact?: any;
}

// ─── In-memory cache ──────────────────────────────────────────────
let _questionCache: Record<string, Question[]> = {};

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
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');

  if (data) {
    const newCache: Record<string, Question[]> = {};
    data.forEach((q: Question) => {
      if (!newCache[q.mission_id]) newCache[q.mission_id] = [];
      newCache[q.mission_id].push(q);
    });
    _questionCache = newCache;
  }
}
