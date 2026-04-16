/**
 * constants/navigation.ts
 * Centralized mapping for challenge types to their respective screen paths.
 */

export const CHALLENGE_TYPE_TO_PATH: Record<string, string> = {
  'matching': '/(challenges)/matching',
  'qcm': '/(challenges)/multiple-choice',
  'multiple_choice': '/(challenges)/multiple-choice',
  'vrai_faux': '/(challenges)/true-false',
  'true_false': '/(challenges)/true-false',
  'ranking': '/(challenges)/ranking-challenge',
  'time_attack': '/(challenges)/time-attack',
  'scenario_cascade': '/(challenges)/scenario-cascade',
  'team_roles': '/(challenges)/team-roles',
  'short_answer': '/(challenges)/short-answer',
  'error_detection': '/(challenges)/error-detection',
  'puzzle_riddle': '/(challenges)/puzzle-riddle',
  'fill_blanks': '/(challenges)/fill-blanks',
  'scenario_dialogue': '/(challenges)/scenario-dialogue',
  'scenario_decision': '/(challenges)/scenario-decision',
  'zellige_v2': '/(challenges)/zellige-v2'
};

export const getChallengePath = (type?: string) => {
  return CHALLENGE_TYPE_TO_PATH[type || ''] || '/(challenges)/multiple-choice';
};
