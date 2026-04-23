import { create } from 'zustand';
import { CityId, Skill } from '../types';

interface GameState {
  currentCity: CityId;
  unlockedCities: CityId[];
  totalXP: number;
  familyTrust: number; // 0 to 100
  skills: Skill[];
  setCity: (cityId: CityId) => void;
  addXP: (amount: number) => void;
  updateFamilyTrust: (amount: number) => void;
  unlockCity: (cityId: CityId) => void;
  updateSkill: (skillId: string, xpGain: number) => void;
  loadSettings: () => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  currentCity: 'casablanca',
  unlockedCities: ['casablanca'],
  totalXP: 0,
  familyTrust: 50, // Starts at neutral/medium
  skills: [],
  setCity: (cityId: CityId) => set({ currentCity: cityId }),
  addXP: (amount: number) => set((state) => ({ totalXP: state.totalXP + amount })),
  updateFamilyTrust: (amount: number) => set((state) => ({ 
    familyTrust: Math.max(0, Math.min(100, state.familyTrust + amount)) 
  })),
  unlockCity: (cityId: CityId) => set((state) => ({
    unlockedCities: state.unlockedCities.includes(cityId) 
      ? state.unlockedCities 
      : [...state.unlockedCities, cityId]
  })),
  updateSkill: (skillId: string, xpGain: number) => set((state) => {
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
  loadSettings: async () => {
    try {
      const { dbService } = require('../services/database');
      // No settings to load into store currently, but keeping the method for future use
    } catch (err) {
      console.warn("Failed to load settings in store:", err);
    }
  }
}));
