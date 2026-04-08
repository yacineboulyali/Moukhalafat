import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const COLORS = {
  surface: '#fdf9f3',
  primary: '#2c4e3e',
  primaryContainer: '#436655',
  tertiary: '#735c00',
  tertiaryContainer: '#cca72f',
  tertiaryFixed: '#ffe088',
  secondaryContainer: '#ffab69',
  onBackground: '#1c1c18',
  onSurfaceVariant: '#404943',
  surfaceContainerLowest: '#ffffff',
};

export default function SplashScreen() {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    // Initial animations
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 90 }));

    // Progress bar fills over 2 seconds
    progressWidth.value = withTiming(100, { duration: 2000, easing: Easing.out(Easing.ease) });

    // continuous rotation for the outer ring
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );

    // Initialize Database
    const initDb = async () => {
      try {
        const { dbService } = require('../services/database');
        await dbService.init();
        console.log("SQLite Database initialized successfully");
      } catch (err) {
        console.error("Failed to initialize database:", err);
      }
    };
    initDb();

    // Navigate to accueil after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/accueil');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
      {/* Background Decor */}
      <View style={[styles.decorBand, { backgroundColor: COLORS.primaryContainer }]} />
      <View style={[styles.decorBandThin, { backgroundColor: COLORS.tertiary }]} />

      {/* Zellige Pattern Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={width} height={height}>
          {/* Creating a simplistic repeating pattern representation */}
          {Array.from({ length: 20 }).map((_, i) =>
            Array.from({ length: 30 }).map((_, j) => (
              <Path
                key={`${i}-${j}`}
                d="M30 0l5 5h10l5 5v10l5 5-5 5v10l-5 5h-10l-5 5-5-5h-10l-5-5v-10l-5-5 5-5v-10l5-5h10z"
                fill={COLORS.tertiaryContainer}
                fillOpacity={0.05}
                x={i * 60 - 30}
                y={j * 60 - 30}
              />
            ))
          )}
        </Svg>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Animated.View style={[styles.outerRing, ringAnimatedStyle]} />
          
          <View style={styles.mainCircle}>
            <MaterialIcons name="map" size={80} color={COLORS.tertiary} style={styles.bgIcon} />
            <View style={styles.iconWrapper}>
              <MaterialIcons name="explore" size={60} color={COLORS.secondaryContainer} />
              <View style={styles.compassNeedle} />
            </View>
          </View>

          <View style={styles.floatingStar}>
            <MaterialIcons name="star" size={18} color="#241a00" />
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
        <Text style={styles.progressText}>INITIALISATION DU VOYAGE...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 16,
    opacity: 0.2,
  },
  decorBandThin: {
    position: 'absolute',
    top: 16,
    left: 0,
    width: '100%',
    height: 4,
    opacity: 0.1,
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
    borderWidth: 2,
    borderColor: 'rgba(204, 167, 47, 0.3)',
    borderStyle: 'dashed',
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surfaceContainerLowest,
    shadowColor: COLORS.tertiary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    opacity: 0.1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassNeedle: {
    position: 'absolute',
    width: 4,
    height: 32,
    backgroundColor: COLORS.tertiaryContainer,
    borderRadius: 2,
    opacity: 0.2,
  },
  floatingStar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '800',
    fontSize: 28,
    color: COLORS.onBackground,
    textAlign: 'center',
    marginBottom: 8,
  },
  arabicSubtitle: {
    fontFamily: 'Noto Sans Arabic',
    fontWeight: '700',
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 2,
    opacity: 0.6,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
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
    backgroundColor: '#e6e2dc',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.tertiaryContainer,
  },
  progressText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: COLORS.onSurfaceVariant,
    opacity: 0.5,
  },
});
