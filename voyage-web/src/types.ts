export type CityId = 'casablanca' | 'rabat' | 'marrakech' | 'fes' | 'tanger' | 'chefchaouen';

export interface Skill {
  id: string;
  name: string;
  arabicName: string;
  category: 'soft' | 'hard' | 'meta';
  level: number;
  xp: number;
}

export interface GameState {
  currentCity: CityId;
  unlockedCities: CityId[];
  totalXP: number;
  skills: Skill[];
  familyTrust: number;
}
