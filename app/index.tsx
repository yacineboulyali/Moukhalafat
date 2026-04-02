import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_400Regular_Italic,
  BeVietnamPro_500Medium,
} from '@expo-google-fonts/be-vietnam-pro';
import {
  NotoSansArabic_400Regular,
  NotoSansArabic_700Bold,
} from '@expo-google-fonts/noto-sans-arabic';
import Svg, { Defs, RadialGradient, Stop, Rect, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Zellige SVG Pattern (6% opacity) — same SVG path as in the HTML source
function ZelligePattern() {
  const tiles: { x: number; y: number }[] = [];
  const tileSize = 40;
  const cols = Math.ceil(width / tileSize) + 1;
  for (let i = 0; i < cols; i++) {
    tiles.push({ x: i * tileSize, y: 0 });
  }
  return (
    <Svg width={width} height={40} style={{ opacity: 0.06 }}>
      {tiles.map((tile, idx) => (
        <Polygon
          key={idx}
          points={`${tile.x + 20},${tile.y} ${tile.x + 25},${tile.y + 15} ${tile.x + 40},${tile.y + 15} ${tile.x + 28},${tile.y + 24} ${tile.x + 33},${tile.y + 40} ${tile.x + 20},${tile.y + 30} ${tile.x + 7},${tile.y + 40} ${tile.x + 12},${tile.y + 24} ${tile.x + 0},${tile.y + 15} ${tile.x + 15},${tile.y + 15}`}
          fill="white"
        />
      ))}
    </Svg>
  );
}

export default function SplashScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
    'BeVietnamPro-Italic': BeVietnamPro_400Regular_Italic,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'NotoSansArabic-Regular': NotoSansArabic_400Regular,
    'NotoSansArabic-Bold': NotoSansArabic_700Bold,
  });

  // Bouncing dot animations — replicate CSS keyframes
  const dot1Scale = useRef(new Animated.Value(0)).current;
  const dot2Scale = useRef(new Animated.Value(0)).current;
  const dot3Scale = useRef(new Animated.Value(0)).current;

  const createBounceCycle = (anim: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        // 0% → scale(0)
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        // 0% → 40%: grow to scale(1)
        Animated.timing(anim, { toValue: 1, duration: 560, useNativeDriver: true }),
        // 40% → 80%: shrink to scale(0)
        Animated.timing(anim, { toValue: 0, duration: 560, useNativeDriver: true }),
        // 80% → 100%: stay at 0
        Animated.delay(280),
      ])
    );
  };

  useEffect(() => {
    Animated.parallel([
      createBounceCycle(dot1Scale, 480),   // -0.32s → delay 480ms (1400-320)
      createBounceCycle(dot2Scale, 624),   // -0.16s → delay 624ms (1400-160 mapped)
      createBounceCycle(dot3Scale, 0),     // no delay
    ]).start();

    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>

      {/* Radial gradient background: #2D6A4F center → #1A3D2E edges */}
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height}>
        <Defs>
          <RadialGradient id="splashGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#2D6A4F" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1A3D2E" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#splashGrad)" />
      </Svg>

      {/* Decorative tonal glow overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height} pointerEvents="none">
        <Defs>
          <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F4A261" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#glowGrad)" />
      </Svg>

      {/* Top 15%: Geometric Zellige Band */}
      <View style={styles.zelligeBand}>
        <View style={styles.zellligePatternWrap}>
          <ZelligePattern />
        </View>
      </View>

      {/* Center 55%: Logo Stack */}
      <View style={styles.centerSection}>

        {/* Icon Container — 120×120, rounded-xl, gold gradient + compass icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#F4A261', '#D4AF37']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Subtle mosque silhouette — bottom-right, 20% opacity, rotated 12deg */}
          <View style={styles.mosqueSilhouette}>
            <MaterialCommunityIcons
              name="dome-light"
              size={96}
              color="white"
              style={{ opacity: 0.2, transform: [{ rotate: '12deg' }] }}
            />
          </View>
          {/* Main icon: "explore" → compass */}
          <MaterialCommunityIcons
            name="compass"
            size={64}
            color="white"
            style={{ zIndex: 10 }}
          />
        </View>

        {/* Title Stack */}
        <View style={styles.titleStack}>
          {/* H1 — Plus Jakarta Sans ExtraBold 32px white */}
          <Text
            style={[
              styles.title,
              fontsLoaded && { fontFamily: 'PlusJakartaSans-ExtraBold' },
            ]}
          >
            Le Voyage des Compétences
          </Text>

          {/* H2 Arabic — Noto Sans Arabic 22px white/75 RTL */}
          <Text
            style={[
              styles.arabicTitle,
              fontsLoaded && { fontFamily: 'NotoSansArabic-Regular' },
            ]}
          >
            {'رحلة المهارات'}
          </Text>

          {/* P — Be Vietnam Pro italic sm white/60 */}
          <Text
            style={[
              styles.subtitle,
              fontsLoaded && { fontFamily: 'BeVietnamPro-Italic' },
            ]}
          >
            Développe tes compétences à travers le Maroc
          </Text>
        </View>
      </View>

      {/* Bottom 30%: Loading + Skyline */}
      <View style={styles.bottomSection}>

        {/* Loading indicator: 3 bouncing dots #F4A261 */}
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot1Scale }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot2Scale }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot3Scale }] }]}
          />
        </View>

        {/* Moroccan City Skyline Silhouette — opacity 8% */}
        <View style={styles.skyline}>
          {/* architecture, mosque, fort, castle, domain → best MaterialCommunityIcons equivalents */}
          <MaterialCommunityIcons name="city-variant-outline" size={120} color="white" style={styles.skylineIcon} />
          <MaterialCommunityIcons name="dome-light" size={160} color="white" style={[styles.skylineIcon, { marginBottom: -30 }]} />
          <MaterialCommunityIcons name="chess-rook" size={100} color="white" style={[styles.skylineIcon, { marginBottom: -15 }]} />
          <MaterialCommunityIcons name="castle" size={140} color="white" style={[styles.skylineIcon, { marginBottom: -25 }]} />
          <MaterialCommunityIcons name="domain" size={110} color="white" style={[styles.skylineIcon, { marginBottom: -18 }]} />
        </View>

        {/* Safe area bottom spacing */}
        <View style={{ height: 32 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A3D2E',  // fallback while SVG loads
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // Top section — 132px
  zelligeBand: {
    width: '100%',
    height: 132,
    justifyContent: 'flex-end',
    paddingBottom: 0,
    overflow: 'hidden',
  },
  zellligePatternWrap: {
    position: 'absolute',
    bottom: 12,
    left: 0,
  },

  // Center section — flex-1, vertically centered
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },

  // Logo icon container — 120×120, rounded-xl (16px), shadow-2xl
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  mosqueSilhouette: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    zIndex: 5,
  },

  // Title stack
  titleStack: {
    alignItems: 'center',
    gap: 16,
  },
  // H1 — font-headline font-extrabold text-[32px] text-white leading-tight tracking-tight
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  // H2 arabic — font-arabic text-[22px] text-white/75 dir=rtl
  arabicTitle: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 36,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  // P — font-body italic text-sm text-white/60 max-w-[240px]
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    fontWeight: '500',
    maxWidth: 240,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Bottom section — 265px
  bottomSection: {
    width: '100%',
    height: 265,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Loading dots — 3 dots #F4A261, mb-24
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 96,
    zIndex: 20,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#F4A261',
    borderRadius: 6,
  },
  // Skyline silhouette — opacity 8%, h-24, overflow hidden
  skyline: {
    width: '100%',
    height: 96,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    opacity: 0.08,
    overflow: 'hidden',
  },
  skylineIcon: {
    marginBottom: -20,
  },
});
