import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_400Regular_Italic, BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro';
import Svg, { RadialGradient, Stop, Rect, Defs } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const CONFETTI = [
  { top: '10%', left: '15%', color: '#cca72f', shape: 'circle' },
  { top: '25%', left: '80%', color: '#ffab69', shape: 'square' },
  { top: '45%', left: '10%', color: '#fff', shape: 'circle' },
  { top: '65%', left: '85%', color: '#cca72f', shape: 'square' },
  { top: '85%', left: '20%', color: '#ffab69', shape: 'circle' },
  { top: '15%', left: '50%', color: '#fff', shape: 'square' },
];

const SKILLS = ['Gestion du stress', 'Prise de décision', 'Travail en équipe'];

export default function RevelationScreen() {
  const router = useRouter();
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'BeVietnamPro-Italic': BeVietnamPro_400Regular_Italic,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* ── Background: radial gradient #2D6A4F → #1A3D2E ── */}
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height}>
        <Defs>
          <RadialGradient id="revGrad" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#2D6A4F" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1A3D2E" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#revGrad)" />
      </Svg>

      {/* ── Confetti particles ── */}
      {CONFETTI.map((c, i) => (
        <View
          key={i}
          style={[
            styles.confetti,
            {
              top: c.top as any,
              left: c.left as any,
              backgroundColor: c.color,
              borderRadius: c.shape === 'circle' ? 3 : 0,
            },
          ]}
        />
      ))}

      {/* ── Nav dots ── */}
      <View style={styles.nav}>
        <View style={styles.navDots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.navDot, { backgroundColor: '#cca72f' }]} />
          ))}
        </View>
        <View style={styles.navLabel}>
          <Text style={[styles.navText, f('PlusJakartaSans-Bold')]}>TON PROFIL</Text>
          <Text style={[styles.navArabic, f('BeVietnamPro-Medium')]}>{'ملفك الشخصي'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Avatar badge ── */}
        <View style={styles.badgeWrap}>
          <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <Image
                source={require('../assets/images/avatar-stratege.jpg')}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={styles.identity}>
          <Text style={[styles.profileTitle, f('PlusJakartaSans-ExtraBold')]}>Le Stratège</Text>
          <Text style={[styles.profileTitleAr, f('BeVietnamPro-Medium')]}>{'الاستراتيجي'}</Text>
          <Text style={[styles.profileDesc, f('BeVietnamPro-Italic')]}>
            Tu analyses, tu planifies, tu maîtrises.
          </Text>
        </View>

        {/* ── Detail card ── */}
        <View style={styles.detailCard}>
          {/* Purple top bar */}
          <View style={styles.cardAccent} />
          <View style={styles.cardContent}>
            <View style={styles.cardIconWrap}>
              <MaterialCommunityIcons name="clipboard-text" size={36} color="#7B2D8B" />
            </View>
            <Text style={[styles.cardText, f('BeVietnamPro-Medium')]}>
              Tu es méthodique et organisé. Ta vision claire te permet de transformer chaque défi en
              une opportunité structurée.
            </Text>
            <View style={styles.cardDivider} />
            <View style={styles.traitRow}>
              {[
                { emoji: '🎯', label: 'Décision' },
                { emoji: '📊', label: 'Analyse' },
                { emoji: '🧩', label: 'Planification' },
              ].map((t, i) => (
                <View key={i} style={styles.trait}>
                  <Text style={styles.traitEmoji}>{t.emoji}</Text>
                  <Text style={[styles.traitLabel, f('PlusJakartaSans-Bold')]}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Unlockables ── */}
        <View style={styles.unlockables}>
          <Text style={[styles.unlockTitle, f('PlusJakartaSans-Bold')]}>
            Compétences à débloquer
          </Text>
          <View style={styles.chips}>
            {SKILLS.map((s) => (
              <View key={s} style={styles.chip}>
                <Text style={[styles.chipText, f('PlusJakartaSans-Bold')]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Footer CTA ── */}
      <LinearGradient
        colors={['transparent', 'rgba(26,61,46,0.9)', '#1A3D2E']}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.9}
          onPress={() => router.push('/map')}
        >
          <Text style={[styles.ctaText, f('PlusJakartaSans-ExtraBold')]}>
            Partir en voyage ! 🗺️
          </Text>
        </TouchableOpacity>
        <Text style={[styles.footerArabic, f('BeVietnamPro-Medium')]}>{'!ابدأ رحلتك'}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A3D2E' },

  confetti: {
    position: 'absolute',
    width: 6,
    height: 6,
    opacity: 0.6,
    zIndex: 1,
    pointerEvents: 'none',
  } as any,

  nav: {
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  navDots: { flexDirection: 'row', gap: 8 },
  navDot: { width: 10, height: 10, borderRadius: 5 },
  navLabel: { alignItems: 'center' },
  navText: { fontSize: 10, fontWeight: '700', color: '#cca72f', letterSpacing: 3 },
  navArabic: { fontSize: 12, color: '#cca72f', marginTop: 2 },

  scrollContent: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, zIndex: 5 },

  // Badge
  badgeWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    shadowColor: '#cca72f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  outerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(204,167,47,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(204,167,47,0.05)',
  },
  innerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    elevation: 12,
  },
  avatarImg: { width: '100%', height: '100%' },

  // Identity
  identity: { alignItems: 'center', marginBottom: 32 },
  profileTitle: { fontSize: 30, fontWeight: '800', color: '#fff', lineHeight: 38, textAlign: 'center' },
  profileTitleAr: { fontSize: 18, color: '#FFE4B5', marginTop: 4, textAlign: 'center' },
  profileDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },

  // Detail card
  detailCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  cardAccent: { height: 6, backgroundColor: '#7B2D8B' },
  cardContent: { padding: 24, alignItems: 'center' },
  cardIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(123,45,139,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardText: { fontSize: 15, color: '#404943', lineHeight: 24, textAlign: 'center', marginBottom: 24 },
  cardDivider: { width: '100%', height: 1, backgroundColor: 'rgba(191,201,193,0.3)', marginBottom: 24 },
  traitRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  trait: { alignItems: 'center', gap: 6 },
  traitEmoji: { fontSize: 18 },
  traitLabel: { fontSize: 11, fontWeight: '700', color: '#2c4e3e', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Unlockables
  unlockables: { width: '100%', alignItems: 'center', gap: 16 },
  unlockTitle: { fontSize: 10, fontWeight: '700', color: '#FFE4B5', letterSpacing: 2, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(123,45,139,0.2)',
    borderRadius: 99,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
  },
  ctaBtn: {
    width: '100%',
    maxWidth: 380,
    paddingVertical: 16,
    backgroundColor: '#F4A261',
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: 'rgba(244,162,97)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  footerArabic: { fontSize: 14, color: '#FFE4B5', fontWeight: '500' },
});
