import { useEffect, useState } from 'react';
import { dbService } from '../services/database';
import { syncQuestions } from '../services/sync';

export const preloadAllQuestions = syncQuestions;

export interface Question {
  id: string;
  mission_id: string;
  question_fr: string;
  question_ar: string | null;
  title_fr?: string; // Optional title for splash screens
  title_ar?: string; // Optional title for splash screens
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

export function useQuestions(missionId: string | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (targetMissionId: string) => {
    setLoading(true);
    try {
      const result = await dbService.getQuestionsByMission(targetMissionId);
      setQuestions(result);
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
