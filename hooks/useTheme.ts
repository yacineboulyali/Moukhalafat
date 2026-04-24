import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { THEME } from '../constants/theme';
import { settingsService } from '../services/SettingsService';
import { useGameStore } from '../stores/gameStore';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    // Charger le thème initial
    const loadTheme = async () => {
      const savedTheme = await settingsService.getTheme();
      setThemeMode(savedTheme);
    };
    loadTheme();

    // Écouter les changements
    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
      setThemeMode(newTheme);
    };

    settingsService.on('themeChanged', handleThemeChange);
    return () => {
      settingsService.off('themeChanged', handleThemeChange);
    };
  }, []);

  const isDark = false;
  const uiScale = useGameStore((state) => state.uiScale);
  const colors = THEME.light;

  // Helper function to scale values
  const s = (val: number) => val * uiScale;

  return { 
    isDark, 
    colors, 
    themeMode, 
    uiScale,
    s,
    setTheme: (mode: 'light' | 'dark' | 'system') => settingsService.setTheme(mode) 
  };
}
