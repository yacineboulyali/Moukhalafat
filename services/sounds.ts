import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export const SOUNDS = {
  click: require('../assets/sounds/click.mp3'),
  success: require('../assets/sounds/success.mp3'),
  whoosh: require('../assets/sounds/whoosh.mp3'),
  // levelUp n'est pas encore présent, on peut utiliser success en attendant ou le laisser vide
  levelUp: require('../assets/sounds/success.mp3'), 
};

export class SoundService {
  private static instance: SoundService;

  private constructor() {}

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public async triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light') {
    try {
      switch (type) {
        case 'light': await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
        case 'medium': await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
        case 'success': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
        case 'warning': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
        case 'error': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
      }
    } catch (e) {}
  }

  public async playSound(soundKey: string) {
    // Les vibrations restent actives et prioritaires pour le ressenti physique
    if (soundKey === 'success' || soundKey === 'levelUp') {
      this.triggerHaptic('success');
    } else {
      this.triggerHaptic('light');
    }

    // Sound disabled by user request
    return;
    /*
    try {
      const source = (SOUNDS as any)[soundKey];
      if (!source) return;

      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();
      
      // Libération automatique de la mémoire après lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log(`Erreur Audio [${soundKey}]:`, error);
    }
    */
  }
}
