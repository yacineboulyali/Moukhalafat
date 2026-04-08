import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';

const THEME_KEY = '@voyage_theme';

class SettingsService extends EventEmitter {
  private static instance: SettingsService;
  
  private constructor() {
    super();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getTheme(): Promise<'light' | 'dark' | 'system'> {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return (theme as any) || 'light';
  }

  async setTheme(theme: 'light' | 'dark' | 'system') {
    await AsyncStorage.setItem(THEME_KEY, theme);
    this.emit('themeChanged', theme);
  }
}

export const settingsService = SettingsService.getInstance();
