import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { preloadAllChallenges } from '../hooks/useChallenges';
import { preloadAllMissions } from '../hooks/useMissions';
import { preloadAllQuestions } from '../hooks/useQuestions';
import { useAuthStore } from '../stores/authStore';
import { SoundService } from '../services/sounds';

const { width, height } = Dimensions.get('window');
const COLORS = THEME.light;

// Nombre réduit de confettis sur Android pour les performances
const IS_ANDROID = Platform.OS === 'android';

export default function SplashScreen() {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const ringRotation = useSharedValue(0);
  const [loadPercentage, setLoadPercentage] = React.useState(0);
  const { user, loading: authLoading } = useAuthStore();

  useEffect(() => {
    // Initial animations
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 90 }));

    // Continuous rotation for the outer ring
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // ─── Pré-chargement des sons + données ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const initApp = async () => {
      try {
        // Pré-charger les sons en parallèle du reste
        SoundService.getInstance().preloadAll();

        // Step 1: Challenges
        await preloadAllChallenges();
        if (cancelled) return;
        progressWidth.value = withTiming(33, { duration: 500 });
        setLoadPercentage(33);

        // Step 2: Missions 
        await preloadAllMissions();
        if (cancelled) return;
        progressWidth.value = withTiming(66, { duration: 500 });
        setLoadPercentage(66);

        // Step 3: Questions (no-op actuellement, futur use)
        await preloadAllQuestions();
        if (cancelled) return;
        progressWidth.value = withTiming(100, { duration: 500 });
        setLoadPercentage(100);

        // Timeout de sécurité — on navigue dans tous les cas après 5 secondes
        // OPTIMISATION: remplace le busy-wait `while (authLoading)` qui bloquait le thread
        const NAVIGATION_TIMEOUT = 5000;
        const navTimer = setTimeout(() => {
          if (!cancelled) {
            router.replace('/map');
          }
        }, NAVIGATION_TIMEOUT);

        // Navigation immédiate si l'auth est déjà résolue
        if (!authLoading) {
          clearTimeout(navTimer);
          setTimeout(() => {
            if (!cancelled) router.replace('/map');
          }, 800);
        }
        // Sinon, le useEffect sur [authLoading] ci-dessous prend le relais

      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        if (!cancelled) router.replace('/accueil');
      }
    };

    initApp();

    return () => { cancelled = true; };
  }, []);

  // ─── Réagit dès que l'état auth se résout ────────────────────────────────
  useEffect(() => {
    if (!authLoading && loadPercentage === 100) {
      const t = setTimeout(() => {
        router.replace('/map');
      }, 400);
      return () => clearTimeout(t);
    }
  }, [authLoading, loadPercentage]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decor (Zellige Stripes) */}
      <View style={[styles.decorBand, { backgroundColor: COLORS.primary }]} />
      <View style={[styles.decorBandThin, { backgroundColor: COLORS.gold }]} />

      {/* Zellige Pattern Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <Image 
          source={require('../assets/images/zellige_splash.png')}
          style={[styles.splashBg, { opacity: 0.1 }]}
          resizeMode="repeat"
        />
        {/* Tint Overlay */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgb(212, 175, 55)', opacity: 0.5 }]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Animated.View style={[styles.outerRing, ringAnimatedStyle]} />
          
          <View style={styles.mainCircle}>
            <MaterialIcons name="map" size={80} color={COLORS.gold} style={styles.bgIcon} />
            <View style={styles.iconWrapper}>
              <MaterialIcons name="explore" size={60} color={COLORS.primary} />
            </View>
          </View>

          <View style={styles.floatingStar}>
            <MaterialIcons name="star" size={18} color={COLORS.white} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.title}>Le Voyage des Compétences</Text>
          <Text style={styles.arabicSubtitle}>رحلة المهارات</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>Développe tes compétences à travers le Maroc</Text>
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </View>
        <Text style={styles.progressText}>
          {loadPercentage === 100 ? "VOYAGE PRÊT !" : `CHARGEMENT DES RESSOURCES... ${loadPercentage}%`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBg: {
    width: '100%',
    height: '100%',
  },
  decorBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 8,
    opacity: 0.1,
  },
  decorBandThin: {
    position: 'absolute',
    top: 8,
    left: 0,
    width: '100%',
    height: 2,
    opacity: 0.05,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderStyle: 'dashed',
  },
  mainCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fff',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    opacity: 0.05,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingStar: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.light.gold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    fontSize: 28,
    color: THEME.light.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  arabicSubtitle: {
    fontSize: 32,
    color: THEME.light.gold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 48,
    height: 4,
    backgroundColor: THEME.light.gold,
    borderRadius: 2,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    width: 200,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.light.primary,
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: THEME.light.onSurfaceVariant,
    opacity: 0.6,
  },
});
