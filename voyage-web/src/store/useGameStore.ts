import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CityId, GameState } from '../types';
import { supabase } from '../utils/supabase';

const DEMO_PLAYER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

interface GameStore extends GameState {
  playerName: string;
  playerLevel: number;
  fetchProfile: () => Promise<void>;
  setCity: (cityId: CityId) => void;
  addXP: (amount: number) => void;
  updateFamilyTrust: (amount: number) => void;
  unlockCity: (cityId: CityId) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      playerName: 'Voyageur',
      playerLevel: 1,
      currentCity: 'casablanca',
      unlockedCities: ['casablanca'],
      totalXP: 0,
      familyTrust: 50,
      skills: [],

      fetchProfile: async () => {
        try {
          const { data, error: _error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', DEMO_PLAYER_ID)
            .single();
          
          if (data) {
            set({ 
              playerName: data.full_name || 'Voyageur',
              totalXP: data.xp || 0,
              playerLevel: Math.floor((data.xp || 0) / 1000) + 1
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      },

      setCity: (cityId) => set({ currentCity: cityId }),
      
      addXP: async (amount) => {
        const newXP = get().totalXP + amount;
        set({ totalXP: newXP, playerLevel: Math.floor(newXP / 1000) + 1 });
        
        // Sync with Supabase
        await supabase
          .from('profiles')
          .update({ xp: newXP })
          .eq('id', DEMO_PLAYER_ID);
      },

      updateFamilyTrust: (amount) => set((state) => ({ 
        familyTrust: Math.max(0, Math.min(100, state.familyTrust + amount)) 
      })),

      unlockCity: (cityId) => set((state) => ({
        unlockedCities: state.unlockedCities.includes(cityId) 
          ? state.unlockedCities 
          : [...state.unlockedCities, cityId]
      })),
    }),
    {
      name: 'voyage-storage',
    }
  )
);
