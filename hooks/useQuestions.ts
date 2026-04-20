import { useEffect, useState } from 'react';
import { dbService } from '../services/database';

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

export function useQuestions(missionId: string | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (targetMissionId: string) => {
    setLoading(true);
    try {
      const result = await dbService.getQuestionsByMission(targetMissionId);
      setQuestions(result as Question[]);
    } catch (err: any) {
      console.error('Failed to fetch questions from SQLite:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!missionId) return;
    fetchQuestions(missionId);
  }, [missionId]);

  return { questions, loading, error, refresh: () => missionId && fetchQuestions(missionId) };
}

/** 
 * Preload helper (now no-op as the background sync populates SQLite)
 * Kept for compatibility with SplashScreen
 */
export async function preloadAllQuestions() {
  return Promise.resolve();
}
