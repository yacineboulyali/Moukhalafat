/**
 * Logique de scoring et progression
 */

export const LEVEL_XP_THRESHOLD = 1000;

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / LEVEL_XP_THRESHOLD) + 1;
}

export function getXpProgress(totalXp: number): number {
  return (totalXp % LEVEL_XP_THRESHOLD) / LEVEL_XP_THRESHOLD;
}

export function calculateXpGain(baseXp: number, performance: number): number {
  // performance de 0.0 à 1.0 (ex: pourcentage de réussite d'un mini-jeu)
  return Math.round(baseXp * performance);
}

export const CITIES_DATA_ORDER = [
  'casablanca',
  'rabat',
  'marrakech',
  'fes',
  'tanger',
  'chefchaouen'
];
