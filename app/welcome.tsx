import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
} from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ──────────────────────────────────────────────────────
// Design tokens — direct match to the Tailwind config
// ──────────────────────────────────────────────────────
const COLORS = {
  background: '#fdf9f3',
  primary: '#2c4e3e',
  onPrimary: '#ffffff',
  secondaryContainer: '#ffab69',       // divider bar
  onSurface: '#1c1c18',                // h1 title
  outline: '#707973',                  // arabic subtitle
  onSurfaceVariant: '#404943',         // body text
  surfaceContainerLow: '#f7f3ed',      // footer bg
  surfaceTint: '#426655',              // copyright
  // hero gradient
  heroTop: '#FFF8F0',
  heroBottom: '#FFE8CC',
  // zellige dots
  zelligeDot: '#F4A261',
  zellligeBg: '#f1ede7',
};

// ──────────────────────────────────────────────────────
// Dot Zellige Pattern — radial dots ≈ the CSS texture
// background-image: radial-gradient(#F4A261 0.5px, transparent 0.5px),
//                   radial-gradient(#F4A261 0.5px, #f1ede7 0.5px);
// background-size: 20px 20px; background-position: 0 0, 10px 10px; opacity: 0.2;
// ──────────────────────────────────────────────────────
function ZelligeDotPattern({ w, h }: { w: number; h: number }) {
  const gridSize = 20;
  const dotRadius = 0.5;
  const dotsA: { x: number; y: number }[] = [];
  const dotsB: { x: number; y: number }[] = [];
  for (let row = 0; row * gridSize < h + gridSize; row++) {
    for (let col = 0; col * gridSize < w + gridSize; col++) {
      dotsA.push({ x: col * gridSize, y: row * gridSize });
      dotsB.push({ x: col * gridSize + 10, y: row * gridSize + 10 });
    }
  }
  return (
    <Svg
      width={w}
      height={h}
      style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}
    >
      <G>
        {dotsA.map((d, i) => (
          <Circle key={`a-${i}`} cx={d.x} cy={d.y} r={dotRadius} fill={COLORS.zelligeDot} />
        ))}
        {dotsB.map((d, i) => (
          <Circle key={`b-${i}`} cx={d.x} cy={d.y} r={dotRadius} fill={COLORS.zelligeDot} />
        ))}
      </G>
    </Svg>
  );
}

// ──────────────────────────────────────────────────────
// Footer grid icons — "grid_view" repeated × 10
// ──────────────────────────────────────────────────────
function ZelliBorderStrip() {
  return (
    <View style={styles.footer}>
      {/* Orange accent line at top */}
      <View style={styles.footerTopLine} />
      {/* Grid icons row */}
      <View style={styles.footerIcons}>
        {Array.from({ length: 10 }).map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name="grid"
            size={10}
            color={COLORS.onSurface}
            style={{ opacity: 0.3 }}
          />
        ))}
      </View>
      {/* Copyright */}
      <Text style={styles.copyright}>© 2024 Le Voyage des Compétences</Text>
    </View>
  );
}

// ──────────────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });

  // Helper to conditionally apply font family
  const font = (name: string) => (fontsLoaded ? { fontFamily: name } : {});

  return (
    <View style={styles.root}>
      {/* ════════════════════════════════════════════
          TOP 35% — Hero Illustration Section (353px)
          ════════════════════════════════════════════ */}
      <View style={styles.hero}>
        {/* Sky gradient: #FFF8F0 → #FFE8CC */}
        <LinearGradient
          colors={[COLORS.heroTop, COLORS.heroBottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Zellige dot texture overlay, opacity 0.2 */}
        <ZelligeDotPattern w={width} h={353} />

        {/* Hero image: Ben Ali family — object-cover, anchored bottom */}
        <Image
          source={require('../assets/images/welcome-hero.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Decorative arch: rounded top + background colour = seamless transition */}
        <View style={styles.heroArch} />
      </View>

      {/* ════════════════════════════════════════════
          MIDDLE — Content Block (flex-grow)
          ════════════════════════════════════════════ */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title group */}
        <View style={styles.titleGroup}>
          {/* H1 — font-headline text-3xl font-extrabold text-on-surface */}
          <Text style={[styles.h1, font('PlusJakartaSans-ExtraBold')]}>
            Bienvenue dans le Voyage !
          </Text>

          {/* Arabic — font-headline text-xl font-semibold text-outline RTL */}
          <Text style={[styles.arabicTitle, font('PlusJakartaSans-SemiBold')]}>
            {'!أهلاً بك في رحلة المهارات'}
          </Text>
        </View>

        {/* Short divider — w-10 h-1 bg-secondary-container */}
        <View style={styles.divider} />

        {/* Body text — text-on-surface-variant max-w-[280px] font-medium */}
        <Text style={[styles.body, font('BeVietnamPro-Medium')]}>
          Suis la famille Ben Ali à travers le Maroc et développe tes compétences
          professionnelles en t'amusant.
        </Text>
      </ScrollView>

      {/* ════════════════════════════════════════════
          BOTTOM — Action Buttons (px-8 pb-12)
          ════════════════════════════════════════════ */}
      <View style={styles.buttons}>
        {/* Primary CTA — bg-primary text-on-primary h-[56px] rounded-xl */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.95}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={[styles.primaryBtnText, font('PlusJakartaSans-Bold')]}>
            Commencer le voyage / ابدأ الرحلة
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.onPrimary} />
        </TouchableOpacity>

        {/* Secondary — border-2 border-primary text-primary h-[52px] rounded-xl */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.9}
          onPress={() => {/* TODO: sign in flow */}}
        >
          <Text style={[styles.secondaryBtnText, font('PlusJakartaSans-Bold')]}>
            J'ai déjà un compte
          </Text>
        </TouchableOpacity>
      </View>

      {/* ════════════════════════════════════════════
          FOOTER — Zellige border strip
          ════════════════════════════════════════════ */}
      <ZelliBorderStrip />
    </View>
  );
}

// ──────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'column',
  },

  // ── Hero ──
  hero: {
    width: '100%',
    height: 353,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  // rounded arch at bottom of hero blending into background
  heroArch: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },

  // ── Content ──
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 24,
  },
  titleGroup: {
    alignItems: 'center',
    gap: 8,
  },
  // H1 — font-headline text-3xl font-extrabold tracking-tight text-on-surface
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  // Arabic — text-xl font-semibold text-outline dir=rtl
  arabicTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.outline,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 32,
  },
  // Divider — w-10 h-1 bg-secondary-container rounded-full
  divider: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 999,
  },
  // Body text — text-on-surface-variant max-w-[280px] leading-relaxed font-medium
  body: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },

  // ── Buttons ──
  buttons: {
    paddingHorizontal: 32,
    paddingBottom: 80,  // extra space for footer
    gap: 16,
    width: '100%',
  },
  // Primary — bg-primary text-on-primary h-[56px] rounded-xl shadow
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
  // Secondary — border-2 border-primary text-primary h-[52px] rounded-xl
  secondaryBtn: {
    height: 52,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 56,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  footerTopLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 4,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.4,
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 10,
    color: COLORS.surfaceTint,
    opacity: 0.6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: undefined,
  },
});
