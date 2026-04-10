import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useChallenges } from '../hooks/useChallenges';

const { width, height } = Dimensions.get('window');

// ─── Fallback couleurs par ville (si DB vide) ─────────────────────
const CITY_COLORS: Record<string, string> = {
  rabat:       '#735c00',
  chefchaouen: '#4A90D9',
  fes:         '#d4a843',
  marrakech:   '#e2711d',
  laayoune:    '#f4a261',
  dakhla:      '#2a9d8f',
};

// ─── Fallback images locales (si illustration_url absent) ────────
const FALLBACK_IMAGES: Record<string, any> = {
  rabat:       require('../assets/images/intro-rabat-full.png'),
  chefchaouen: require('../assets/images/intro-chefchaouen-v2.png'),
  fes:         require('../assets/images/intro-fes-v2.png'),
  marrakech:   require('../assets/images/intro-marrakech-full.png'),
  laayoune:    require('../assets/images/intro-laayoune-v3.png'),
  dakhla:      require('../assets/images/intro-dakhla-full.png'),
};

export default function IntroDefiScreen() {
  const router = useRouter();
  const { city } = useLocalSearchParams();
  const cityName = (city as string) || 'rabat';

  // ── Fetch challenges from Supabase ────────────────────────────
  const { challenges, loading } = useChallenges();
  const dbData = challenges[cityName];

  // ── Build display data — DB first, fallback to sensible defaults ─
  const cityColor = dbData?.city_color ?? CITY_COLORS[cityName] ?? '#735c00';
  const cityTitle = dbData
    ? `${dbData.city_name_fr}${dbData.city_name_ar ? ' | ' + dbData.city_name_ar : ''}`
    : cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const headline   = dbData?.headline_fr   ?? '...';
  const desc       = dbData?.description_fr ?? '...';
  const focus      = dbData?.focus_fr       ?? '';
  const stepLabel  = dbData?.step_label     ?? '';
  const progress   = dbData?.progress       ?? 0.25;

  // ── Bottom-sheet animation ─────────────────────────────────────
  const translateY   = useSharedValue(height);
  const context      = useSharedValue({ y: 0 });
  const isExpanded   = useSharedValue(true);
  const expandedY    = 0;
  const collapsedY   = height * 0.4;

  useEffect(() => {
    translateY.value = withSpring(expandedY, { damping: 15, mass: 1, stiffness: 100 });
  }, []);

  const toggleSheet = () => {
    if (isExpanded.value) {
      translateY.value = withSpring(collapsedY, { damping: 15 });
      isExpanded.value = false;
    } else {
      translateY.value = withSpring(expandedY, { damping: 15 });
      isExpanded.value = true;
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => { context.value = { y: translateY.value }; })
    .onUpdate((event) => {
      let y = event.translationY + context.value.y;
      if (y < 0) y = y / 3;
      translateY.value = y;
    })
    .onEnd((event) => {
      if (event.translationY > 50 || event.velocityY > 300) {
        translateY.value = withSpring(collapsedY, { damping: 15 });
        isExpanded.value = false;
      } else if (event.translationY < -50 || event.velocityY < -300) {
        translateY.value = withSpring(expandedY, { damping: 15 });
        isExpanded.value = true;
      } else {
        translateY.value = withSpring(isExpanded.value ? expandedY : collapsedY, { damping: 15 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // ── Navigate to challenge ─────────────────────────────────────
  const handleStart = () => {
    if (cityName === 'marrakech') router.push('/pedago');
    else if (cityName === 'fes')  router.push('/defi-resultat');
    else router.back();
  };

  return (
    <View style={styles.container}>

      {/* ── Image locale de chaque ville ─────────────────────── */}
      <Animated.Image
        entering={FadeIn.duration(800)}
        source={FALLBACK_IMAGES[cityName] ?? FALLBACK_IMAGES.rabat}
        style={[StyleSheet.absoluteFillObject, styles.bgImage]}
        resizeMode="cover"
      />



      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* ── Top App Bar ──────────────────────────────────────── */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: cityColor }]} />
          </View>
          {!!stepLabel && <Text style={styles.stepTitle}>{stepLabel}</Text>}
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Bottom Sheet ─────────────────────────────────────── */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>

            <TouchableOpacity onPress={toggleSheet} style={styles.dragHandleContainer} activeOpacity={0.8}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>

            {/* City badge */}
            <Animated.View entering={FadeInUp.delay(700)} style={styles.badgeContainer}>
              <View style={[styles.cityBadge, { backgroundColor: `${cityColor}15`, borderColor: `${cityColor}30` }]}>
                <MaterialIcons name="location-on" size={18} color={cityColor} />
                <Text style={[styles.cityBadgeText, { color: cityColor }]}>{cityTitle}</Text>
              </View>
            </Animated.View>

            {/* Headline from DB */}
            <Animated.Text entering={FadeInUp.delay(800)} style={styles.title}>
              {headline}
            </Animated.Text>

            {/* Description from DB */}
            <Animated.Text entering={FadeInUp.delay(900)} style={styles.description}>
              {desc}
            </Animated.Text>

            {/* CTA Button */}
            <Animated.View entering={FadeInUp.delay(1000)} style={{ width: '100%', marginTop: 24 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: cityColor }]}
                onPress={handleStart}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Découvrir le défi</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.socialProof}>
                <View style={styles.avatarsRow}>
                  <Image source={require('../assets/images/avatar-1.jpg')} style={styles.avatarMini} />
                  <Image source={require('../assets/images/avatar-2.jpg')} style={[styles.avatarMini, { marginLeft: -10 }]} />
                  <View style={[styles.avatarMiniNum, { marginLeft: -10, backgroundColor: `${cityColor}20` }]}>
                    <Text style={[styles.avatarNumText, { color: cityColor }]}>+12</Text>
                  </View>
                </View>
                <Text style={styles.socialText}>12 autres voyageurs</Text>
              </View>
            </Animated.View>

            {/* Focus chip from DB */}
            {!!focus && (
              <Animated.View entering={FadeIn.delay(1200)} style={styles.focusChip}>
                <MaterialIcons name="menu-book" size={14} color="rgba(26,26,46,0.6)" />
                <Text style={styles.focusText}>Focus: {focus}</Text>
              </Animated.View>
            )}

          </BlurView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    width,
    height,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  blurContainer: {
    padding: 32,
    paddingTop: 36,
    paddingBottom: 48,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  badgeContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  cityBadgeText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#404943',
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  avatarsRow: {
    flexDirection: 'row',
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  avatarMiniNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarNumText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  socialText: {
    fontSize: 12,
    color: 'rgba(26,26,46,0.5)',
    fontWeight: '600',
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  focusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(26,26,46,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
