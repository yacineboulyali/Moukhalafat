import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro';

const { width, height } = Dimensions.get('window');

const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  surfaceContainerLow: '#f7f3ed',
  primaryFixed: '#c4ebd6',
  primaryFixedVariant: '#2b4e3e',
  secondaryFixed: '#ffdcc4',
  secondaryFixedVariant: '#6f3800',
  tertiaryFixed: '#ffe088',
  tertiaryFixedVariant: '#574500',
  marrakechRed: '#C1440E',
};

const SHEET_HEIGHT = height * 0.78;

export default function MarrakechScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  return (
    <View style={styles.root}>
      {/* ── Fixed background: dimmed map ── */}
      <Image
        source={require('../assets/images/marrakech-bg-map.jpg')}
        style={styles.bgMap}
        resizeMode="cover"
      />

      {/* ── Top app bar (transparent) ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={22} color={C.bg} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, f('PlusJakartaSans-Bold')]}>Select Destination</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="map" size={22} color={C.bg} />
        </TouchableOpacity>
      </View>

      {/* ── Bottom sheet ── */}
      <View style={[styles.sheet, { height: SHEET_HEIGHT }]}>
        {/* Drag handle */}
        <View style={styles.handle} />

        <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          {/* ── Hero image ── */}
          <View style={styles.heroWrap}>
            <Image
              source={require('../assets/images/marrakech-koutoubia.jpg')}
              style={styles.heroImg}
              resizeMode="cover"
            />
            {/* Close button overlay */}
            <TouchableOpacity style={styles.heroCloseBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="close" size={20} color={C.onSurface} />
            </TouchableOpacity>
            {/* Arabic badge */}
            <View style={styles.arabicBadge}>
              <Text style={[styles.arabicBadgeText, f('PlusJakartaSans-Bold')]}>{'مراكش'}</Text>
            </View>
          </View>

          {/* ── Content ── */}
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleBlock}>
              <View style={styles.titleRow}>
                <View>
                  <Text style={[styles.cityTitle, f('PlusJakartaSans-ExtraBold')]}>Marrakech</Text>
                  <Text style={[styles.cityAr, f('BeVietnamPro-Medium')]}>{'مراكش'}</Text>
                </View>
              </View>

              {/* Badges */}
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: `${C.marrakechRed}1A` }]}>
                  <MaterialCommunityIcons name="medal" size={14} color={C.marrakechRed} />
                  <Text style={[styles.badgeText, { color: C.marrakechRed }, f('PlusJakartaSans-Bold')]}>
                    🏆 Défi de communication
                  </Text>
                </View>
                <View style={[styles.badge, { borderWidth: 1, borderColor: C.outlineVariant }]}>
                  <MaterialCommunityIcons name="chat-processing-outline" size={14} color={C.onSurfaceVariant} />
                  <Text style={[styles.badgeText, { color: C.onSurfaceVariant }, f('BeVietnamPro-Medium')]}>
                    💬 Soft skill
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={[styles.description, f('BeVietnamPro-Medium')]}>
              Négocie avec un client difficile et représente ton équipe lors d'une réunion interculturelle.
            </Text>

            {/* Stats grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statLabel, f('PlusJakartaSans-Bold')]}>Difficulté</Text>
                <View style={styles.stars}>
                  {[1, 2, 3].map((i) => (
                    <MaterialCommunityIcons key={i} name="star" size={18} color={C.primary} />
                  ))}
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statLabel, f('PlusJakartaSans-Bold')]}>Durée</Text>
                <View style={styles.durationRow}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color={C.onSurface} />
                  <Text style={[styles.durationText, f('PlusJakartaSans-Bold')]}>~15 min</Text>
                </View>
              </View>
            </View>

            {/* Skills */}
            <View style={styles.skillsBlock}>
              <Text style={[styles.skillsTitle, f('PlusJakartaSans-Bold')]}>Compétences ciblées</Text>
              <View style={styles.skillsChips}>
                {[
                  { label: 'Communication', bg: C.primaryFixed, color: C.primaryFixedVariant },
                  { label: 'Négociation', bg: C.secondaryFixed, color: C.secondaryFixedVariant },
                  { label: 'Adaptabilité', bg: C.tertiaryFixed, color: C.tertiaryFixedVariant },
                ].map((s) => (
                  <View key={s.label} style={[styles.skillChip, { backgroundColor: s.bg }]}>
                    <Text style={[styles.skillChipText, { color: s.color }, f('PlusJakartaSans-Bold')]}>
                      {s.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 160 }} />
          </View>
        </ScrollView>

        {/* ── Fixed CTA at bottom ── */}
        <View style={styles.cta}>
          <View style={styles.ctaReady}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color={C.primary} />
            <Text style={[styles.ctaReadyText, f('PlusJakartaSans-SemiBold')]}>
              Niveau requis : 2 — Tu es prêt !
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.9}
            onPress={() => router.push('/intro-defi')}
          >
            <Text style={[styles.ctaBtnText, f('PlusJakartaSans-ExtraBold')]}>Commencer le défi</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.ctaArabic, f('BeVietnamPro-Medium')]}>{'!ابدأ التحدي'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  bgMap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fdf9f3',
    letterSpacing: -0.3,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fdf9f3',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#bfc9c1',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    opacity: 0.4,
  },

  sheetScroll: { paddingBottom: 0 },

  heroWrap: {
    marginHorizontal: 16,
    height: 224,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImg: { width: '100%', height: '100%' },
  heroCloseBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  arabicBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#C1440E',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
  },
  arabicBadgeText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  content: { paddingHorizontal: 24, paddingTop: 24, gap: 24 },

  titleBlock: { gap: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cityTitle: { fontSize: 36, fontWeight: '800', color: '#1c1c18', letterSpacing: -1, lineHeight: 40 },
  cityAr: { fontSize: 20, color: 'rgba(28,28,24,0.4)', fontWeight: '500' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },

  description: { fontSize: 15, color: '#404943', lineHeight: 24, fontWeight: '500' },

  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#f7f3ed',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#707973', textTransform: 'uppercase', letterSpacing: 1 },
  stars: { flexDirection: 'row', gap: 2 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  durationText: { fontSize: 16, fontWeight: '700', color: '#1c1c18' },

  skillsBlock: { gap: 12 },
  skillsTitle: { fontSize: 10, fontWeight: '700', color: '#707973', textTransform: 'uppercase', letterSpacing: 2 },
  skillsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillChipText: { fontSize: 13, fontWeight: '700' },

  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(253,249,243,0.97)',
    padding: 24,
    paddingBottom: 40,
    gap: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(191,201,193,0.2)',
  },
  ctaReady: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaReadyText: { fontSize: 14, fontWeight: '600', color: '#2c4e3e' },
  ctaBtn: {
    width: '100%',
    backgroundColor: '#C1440E',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#C1440E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  ctaBtnText: { fontSize: 19, fontWeight: '800', color: '#fff' },
  ctaArabic: { fontSize: 16, color: 'rgba(193,68,14,0.6)', fontWeight: '500' },
});
