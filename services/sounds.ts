/**
 * services/sounds.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SoundService avec pré-chargement des sons pour éviter la latence et les
 * memory leaks liés à la création d'objets Audio.Sound à chaque appel.
 *
 * OPTIMISATION ANDROID :
 * - Les sons sont chargés une seule fois au démarrage (preloadAll).
 * - On utilise un pool de Sound pré-chargés → zéro latence à l'appui.
 * - Les sons de feedback utilisent setPositionAsync(0) pour rejouer sans recréer.
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

type SoundKey = 'click' | 'success' | 'whoosh' | 'levelUp' | 'correct' | 'wrong' | 'match';

const SOUND_SOURCES: Record<SoundKey, any> = {
  click:   require('../assets/sounds/click.mp3'),
  success: require('../assets/sounds/success.mp3'),
  whoosh:  require('../assets/sounds/whoosh.mp3'),
  levelUp: require('../assets/sounds/success.mp3'),
  correct: require('../assets/sounds/correct.mp3'),
  wrong:   require('../assets/sounds/wrong.mp3'),
  match:   require('../assets/sounds/match.mp3'),
};

export class SoundService {
  private static instance: SoundService;

  // Pool de sons pré-chargés
  private pool: Partial<Record<SoundKey, Audio.Sound>> = {};
  private loaded = false;
  private loading = false;

  private constructor() {}

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  /**
   * Pré-charge tous les sons en mémoire.
   * À appeler une seule fois au démarrage (depuis index.tsx ou _layout.tsx).
   */
  public async preloadAll(): Promise<void> {
    if (this.loaded || this.loading) return;
    this.loading = true;

    try {
      // Configure le mode audio pour Android
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Charger tous les sons en parallèle
      const entries = Object.entries(SOUND_SOURCES) as [SoundKey, any][];
      await Promise.all(
        entries.map(async ([key, source]) => {
          try {
            const { sound } = await Audio.Sound.createAsync(source, {
              shouldPlay: false,
              volume: 0.8,
            });
            this.pool[key] = sound;
          } catch (e) {
            console.warn(`[SoundService] Impossible de charger le son: ${key}`, e);
          }
        })
      );

      this.loaded = true;
    } catch (e) {
      console.warn('[SoundService] preloadAll failed:', e);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Joue un son depuis le pool pré-chargé.
   * Si le son n'est pas encore chargé, on fait un fallback haptique uniquement.
   */
  public async playSound(soundKey: string): Promise<void> {
    // Déclencher le feedback haptique immédiatement (zéro latence)
    this._triggerHapticForSound(soundKey);

    const key = soundKey as SoundKey;
    const sound = this.pool[key];

    if (!sound) {
      // Son pas encore chargé → on tente un chargement à la volée
      if (!this.loaded) {
        this.preloadAll(); // async, sans await pour ne pas bloquer
      }
      return;
    }

    try {
      // Revenir au début et jouer — beaucoup plus rapide que createAsync
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (e) {
      // En cas d'erreur (interruption, appel téléphonique...), on recrée le son
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          SOUND_SOURCES[key],
          { shouldPlay: true, volume: 0.8 }
        );
        this.pool[key] = newSound;
      } catch {
        // Silence si tout échoue
      }
    }
  }

  /**
   * Déclencheur haptique découplé du son pour un feedback immédiat.
   */
  public async triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light') {
    try {
      switch (type) {
        case 'light':   await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
        case 'medium':  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
        case 'success': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
        case 'warning': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
        case 'error':   await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
      }
    } catch {
      // Silencieux si les haptiques ne sont pas disponibles (émulateur)
    }
  }

  private _triggerHapticForSound(soundKey: string) {
    if (soundKey === 'success' || soundKey === 'levelUp' || soundKey === 'correct') {
      this.triggerHaptic('success');
    } else if (soundKey === 'wrong') {
      this.triggerHaptic('error');
    } else {
      this.triggerHaptic('light');
    }
  }

  /**
   * Libère toutes les ressources audio (à appeler si l'app passe en arrière-plan prolongé).
   */
  public async unloadAll(): Promise<void> {
    const sounds = Object.values(this.pool);
    await Promise.all(sounds.map(s => s?.unloadAsync().catch(() => {})));
    this.pool = {};
    this.loaded = false;
  }
}
