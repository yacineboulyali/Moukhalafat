/**
 * Types globaux pour Le Voyage des Compétences
 */

export type CityId = 'casablanca' | 'rabat' | 'marrakech' | 'fes' | 'tanger' | 'chefchaouen';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  xp: number;
  level: number;
  badges: string[];
  created_at: string;
}

export interface CityData {
  id: CityId;
  name: string;
  arabicName: string;
  description: string;
  coordinates: { latitude: number; longitude: number };
  image_url: string;
  isUnlocked: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  arabicName: string;
  category: 'soft' | 'hard' | 'meta';
  level: number;
  xp: number;
}

export interface ScenarioStep {
  id: string;
  type: 'dialogue' | 'decision' | 'minigame' | 'result';
  content: string;
  choices?: {
    id: string;
    text: string;
    outcome: string;
    xpImpact: number;
  }[];
}

export interface GameState {
  currentCity: CityId;
  unlockedCities: CityId[];
  totalXP: number;
  skills: Skill[];
  isFirstLaunch: boolean;
}
