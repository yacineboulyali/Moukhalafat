import { create } from 'zustand';
import { CityId, Skill } from '../types';

interface GameState {
  currentCity: CityId;
  unlockedCities: CityId[];
  totalXP: number;
  familyTrust: number; // 0 to 100
  skills: Skill[];
  uiScale: number; // 0.8, 1.0, 1.2
  setCity: (cityId: CityId) => void;
  addXP: (amount: number) => void;
  updateFamilyTrust: (amount: number) => void;
  unlockCity: (cityId: CityId) => void;
  updateSkill: (skillId: string, xpGain: number) => void;
  setUiScale: (scale: number) => void;
  loadSettings: () => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  currentCity: 'casablanca',
  unlockedCities: ['casablanca'],
  totalXP: 0,
  familyTrust: 50, // Starts at neutral/medium
  skills: [],
  uiScale: 1.0,
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
  setUiScale: (scale: number) => {
    set({ uiScale: scale });
    // Persist to storage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.setItem('ui-scale', scale.toString());
  },
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
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      const savedScale = await AsyncStorage.getItem('ui-scale');
      if (savedScale) {
        set({ uiScale: parseFloat(savedScale) });
      }
    } catch (err) {
      console.warn("Failed to load settings in store:", err);
    }
  }
}));
