/**
 * services/DiagnosticService.ts
 * ─────────────────────────────────────────────────────────────────
 * Systéme d'Anticipation de Bugs (Self-Healing & Diagnostics)
 * Ce service vérifie l'intégrité de l'application au démarrage
 * et répare automatiquement les problèmes courants.
 */
import { supabase } from '../lib/supabase';
import { dbService } from './database';
import { useAuthStore } from '../stores/authStore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiagnosticResult {
  status: 'ok' | 'warning' | 'error';
  checks: {
    database: boolean;
    network: boolean;
    auth: boolean;
    profile: boolean;
    curriculum: boolean;
  };
  errors: string[];
}

export class DiagnosticService {
  private static instance: DiagnosticService;

  private constructor() {}

  public static getInstance(): DiagnosticService {
    if (!DiagnosticService.instance) {
      DiagnosticService.instance = new DiagnosticService();
    }
    return DiagnosticService.instance;
  }

  /**
   * Exécute une série de tests et tente de réparer les erreurs connues.
   */
  public async performFullCheck(): Promise<DiagnosticResult> {
    const crashCount = await this.trackCrashes();
    console.log(`🔍 Diagnostic: Démarrage (Crash count: ${crashCount})`);
    
    if (crashCount > 3) {
      console.warn('🚨 Système d\'Anticipation: Trop d\'échecs successifs. Tentative de nettoyage forcé...');
      await this.emergencyCleanUp();
    }
    
    const result: DiagnosticResult = {
      status: 'ok',
      checks: {
        database: false,
        network: false,
        auth: false,
        profile: false,
        curriculum: false,
      },
      errors: []
    };

    // 1. Vérification Base de données Locale
    try {
      const isDbReady = await dbService.init();
      result.checks.database = true;
    } catch (e: any) {
      result.errors.push(`DB_LOCAL_ERROR: ${e.message}`);
      result.status = 'error';
    }

    // 2. Vérification Connectivité Supabase
    try {
      const { error } = await supabase.from('app_settings').select('count', { count: 'exact', head: true });
      if (error) throw error;
      result.checks.network = true;
    } catch (e: any) {
      result.errors.push(`NETWORK_SUPABASE_ERROR: ${e.message}`);
      // On ne met pas en 'error' car l'app doit fonctionner offline
      result.status = result.status === 'error' ? 'error' : 'warning';
    }

    // 3. Vérification Auth & Profil (Anticipation FK Violations)
    const user = useAuthStore.getState().user;
    if (user) {
      result.checks.auth = true;
      try {
        // Tenter de récupérer le profil
        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (pErr || !profile) {
          console.warn('🛠 Auto-Healing: Profil manquant détecté. Création en cours...');
          // Réparation automatique
          const { error: insErr } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: user.full_name || 'Voyageur',
            xp: user.xp || 0,
            level: user.level || 1
          });
          if (insErr) throw insErr;
          console.log('✅ Profil réparé.');
        }
        result.checks.profile = true;

        // Tenter de vérifier la progression
        const { data: progress, error: prgErr } = await supabase
          .from('player_city_progress')
          .select('id')
          .eq('player_id', user.id);

        if (!prgErr && (!progress || progress.length === 0)) {
          console.warn('🛠 Auto-Healing: Progression manquante. Initialisation...');
          // On laisse usePlayerCityProgress le faire ou on peut le centraliser ici
          // Pour l'anticipation, on va juste logger le besoin
          result.status = result.status === 'error' ? 'error' : 'warning';
          result.errors.push('PROGRESS_MISSING: Le joueur n\'a pas de progression initialisée.');
        } else {
          result.checks.curriculum = true; // On réutilise curriculum ou on ajoute une clé
        }
      } catch (e: any) {
        result.errors.push(`PROFILE_INTEGRITY_ERROR: ${e.message}`);
        result.status = 'error';
      }
    }

    // 4. Vérification Données de Jeu (Curriculum)
    try {
      const challenges = await dbService.getChallenges();
      if (challenges.length === 0) {
        result.errors.push('CURRICULUM_EMPTY: Aucune donnée locale.');
        result.status = result.status === 'error' ? 'error' : 'warning';
      } else {
        result.checks.curriculum = true;
      }
    } catch (e: any) {
      result.errors.push(`DATA_QUERY_ERROR: ${e.message}`);
    }

    this.reportToTerminal(result);
    return result;
  }

    console.log(`--------------------------------\n`);
  }

  private async trackCrashes(): Promise<number> {
    try {
      const countStr = await AsyncStorage.getItem('app_crash_count');
      let count = countStr ? parseInt(countStr, 10) : 0;
      count++;
      await AsyncStorage.setItem('app_crash_count', count.toString());
      
      // Si l'app reste ouverte plus de 10s, on reset le compteur (considéré comme succès)
      setTimeout(async () => {
        await AsyncStorage.setItem('app_crash_count', '0');
      }, 10000);
      
      return count;
    } catch {
      return 0;
    }
  }

  private async emergencyCleanUp() {
    try {
      // Nettoyer les caches SQLite corrompus si nécessaire
      // await dbService.reset(); // Trop dangereux par défaut, on peut juste vider le cache de sync
      await AsyncStorage.removeItem('last_sync_timestamp');
      console.log('🧹 Nettoyage d\'urgence terminé.');
    } catch (e) {
      console.error('Failed emergency cleanup', e);
    }
  }
}

export const diagnosticService = DiagnosticService.getInstance();
