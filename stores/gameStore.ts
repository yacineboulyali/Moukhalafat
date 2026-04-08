import { create } from 'zustand';
import { CityId, Skill } from '../types';

interface GameState {
  currentCity: CityId;
  unlockedCities: CityId[];
  totalXP: number;
  skills: Skill[];
  setCity: (cityId: CityId) => void;
  addXP: (amount: number) => void;
  unlockCity: (cityId: CityId) => void;
  updateSkill: (skillId: string, xpGain: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentCity: 'casablanca',
  unlockedCities: ['casablanca'],
  totalXP: 0,
  skills: [],
  setCity: (cityId) => set({ currentCity: cityId }),
  addXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount })),
  unlockCity: (cityId) => set((state) => ({
    unlockedCities: state.unlockedCities.includes(cityId) 
      ? state.unlockedCities 
      : [...state.unlockedCities, cityId]
  })),
  updateSkill: (skillId, xpGain) => set((state) => {
    const existingSkill = state.skills.find(s => s.id === skillId);
    if (existingSkill) {
      return {
        skills: state.skills.map(s => s.id === skillId 
          ? { ...s, xp: s.xp + xpGain, level: Math.floor((s.xp + xpGain) / 500) + 1 } 
          : s
        )
      };
    }
    return state;
  }),
}));
