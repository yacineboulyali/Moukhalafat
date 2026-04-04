import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, RefreshControl, ActivityIndicator,
  Dimensions, Platform,
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
import Svg, { Circle, Path } from 'react-native-svg';
import { usePlayerData, type SkillScore, type EarnedBadge, type CityProgress } from '../hooks/usePlayerData';

const { width } = Dimensions.get('window');

// ── Design tokens ───────────────────────────────────────────────────
const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  surfaceContainer: '#f1ede7',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#ebe8e2',
  surfaceContainerHighest: '#e6e2dc',
  surfaceDim: '#dddad4',
  primaryFixed: '#c4ebd6',
  secondaryFixed: '#ffdcc4',
  onSecondaryFixed: '#2f1400',
  tertiaryFixed: '#ffe088',
  onTertiaryFixed: '#241a00',
  tertiary: '#735c00',
  secondary: '#8e4e14',
  secondaryContainer: '#ffab69',
  red: '#C1440E',
};

// City images map
const CITY_IMAGES: Record<string, any> = {
  casablanca: require('../assets/images/casablanca-card.jpg'),
  marrakech:  require('../assets/images/marrakech-card.jpg'),
};

// Rank medal colors
const RANK_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  argent: '#A8A9AD',
  or:     '#FFD700',
};

// ── Circular skill ring ─────────────────────────────────────────────
function SkillRing({ skill }: { skill: SkillScore }) {
  const R = 15.9155;
  const dash = skill.score;
  return (
    <View style={[ringStyles.wrap, !skill.is_unlocked && { opacity: 0.4 }]}>
      <View style={ringStyles.ringBox}>
        <Svg width={72} height={72} viewBox="0 0 36 36">
          <Circle cx="18" cy="18" r={R} fill="none" stroke={C.surfaceContainerHighest} strokeWidth="3" />
          <Path
            d={`M18 2.0845 a ${R} ${R} 0 0 1 0 31.831 a ${R} ${R} 0 0 1 0 -31.831`}
            fill="none"
            stroke={skill.color}
            strokeWidth="3"
            strokeDasharray={`${dash}, 100`}
            strokeLinecap="round"
            transform="rotate(-90, 18, 18)"
          />
        </Svg>
        <View style={ringStyles.iconOver}>
          <MaterialCommunityIcons name={skill.icon as any} size={22} color={skill.color} />
        </View>
      </View>
      <Text style={ringStyles.label} numberOfLines={2}>{skill.skill_label}</Text>
      <Text style={[ringStyles.score, { color: skill.color }]}>{skill.score}%</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4, width: (width - 80) / 3 },
  ringBox: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconOver: { position: 'absolute' },
  label: { fontSize: 9, fontWeight: '700', color: C.onSurface, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', lineHeight: 13 },
  score: { fontSize: 11, fontWeight: '800' },
});

// ── Badge card ──────────────────────────────────────────────────────
function BadgeCard({ badge }: { badge: EarnedBadge }) {
  const medalColor = badge.rank ? RANK_COLORS[badge.rank] : '#aaa';
  return (
    <View style={badgeStyles.card}>
      <View style={[badgeStyles.medal, { borderColor: medalColor + '50', backgroundColor: medalColor + '18' }]}>
        <Text style={badgeStyles.emoji}>{badge.badge_emoji}</Text>
      </View>
      <View style={[badgeStyles.rankDot, { backgroundColor: medalColor }]} />
      <Text style={badgeStyles.name} numberOfLines={2}>{badge.badge_name_fr}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  card: {
    width: 100, backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16, padding: 14, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(191,201,193,0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, flexShrink: 0,
  },
  medal: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
  rankDot: { width: 8, height: 8, borderRadius: 4 },
  name: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', color: C.onSurface, lineHeight: 13 },
});

// ── City voyage card ────────────────────────────────────────────────
function VoyageCard({ city }: { city: CityProgress }) {
  const isDone    = city.status === 'done';
  const isCurrent = city.status === 'current';
  const isLocked  = city.status === 'locked';
  const img = CITY_IMAGES[city.city_id];

  return (
    <View style={[
      voyageStyles.card,
      isDone    && { borderColor: 'rgba(44,78,62,0.3)', backgroundColor: C.primaryFixed + '30' },
      isCurrent && { borderColor: C.red, borderWidth: 2, transform: [{ scale: 1.04 }] },
      isLocked  && { opacity: 0.42 },
    ]}>
      {/* City image or lock */}
      <View style={voyageStyles.imgWrap}>
        {img ? (
          <Image source={img} style={voyageStyles.img} resizeMode="cover" />
        ) : (
          <View style={[voyageStyles.img, voyageStyles.lockImgBg]}>
            <MaterialCommunityIcons name="lock" size={28} color={C.outline} />
          </View>
        )}
      </View>

      <Text style={[voyageStyles.name, isCurrent && { color: C.red }]} numberOfLines={1}>
        {city.city_name_fr}
      </Text>
      <Text style={voyageStyles.nameAr}>{city.city_name_ar}</Text>

      {/* Status badge */}
      <View style={[
        voyageStyles.statusBadge,
        isDone    && { backgroundColor: 'rgba(44,78,62,0.08)' },
        isCurrent && { backgroundColor: 'rgba(193,68,14,0.08)' },
      ]}>
        <Text style={[
          voyageStyles.statusText,
          isDone    && { color: C.primary },
          isCurrent && { color: C.red },
        ]}>
          {isDone ? '✓ Terminé' : isCurrent ? '▶ En cours' : '🔒'}
        </Text>
      </View>

      {/* Missions progress bar (show only for done/current) */}
      {!isLocked && (
        <View style={voyageStyles.progressWrap}>
          <View style={voyageStyles.progressBg}>
            <View style={[
              voyageStyles.progressFill,
              { width: `${(city.missions_completed / city.missions_total) * 100}%`,
                backgroundColor: isDone ? C.primary : C.red },
            ]} />
          </View>
          <Text style={voyageStyles.progressTxt}>
            {city.missions_completed}/{city.missions_total}
          </Text>
        </View>
      )}
    </View>
  );
}

const voyageStyles = StyleSheet.create({
  card: {
    width: 120, backgroundColor: C.surfaceContainerLow, borderRadius: 16, padding: 10,
    alignItems: 'center', gap: 5, borderWidth: 1.5, borderColor: C.outlineVariant,
    flexShrink: 0,
  },
  imgWrap: { width: 80, height: 64, borderRadius: 10, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  lockImgBg: { backgroundColor: C.surfaceDim, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 11, fontWeight: '700', color: C.onSurface, textAlign: 'center' },
  nameAr: { fontSize: 9, color: C.onSurfaceVariant, textAlign: 'center' },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, backgroundColor: C.surfaceContainer, borderRadius: 99 },
  statusText: { fontSize: 8, fontWeight: '700', color: C.onSurfaceVariant },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 4 },
  progressBg: { flex: 1, height: 4, backgroundColor: C.surfaceContainerHighest, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  progressTxt: { fontSize: 8, fontWeight: '700', color: C.onSurfaceVariant },
});

// ── Loading skeleton ────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 80 }}>
      <ActivityIndicator size="large" color={C.primary} />
      <Text style={{ color: C.onSurfaceVariant, fontSize: 14 }}>Chargement du profil...</Text>
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = usePlayerData();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  const onRefresh = useCallback(() => { refetch(); }, [refetch]);

  // ── Loading state ──
  if (loading && !data.profile) {
    return (
      <View style={styles.root}>
        <LoadingSkeleton />
      </View>
    );
  }

  // ── Error state ──
  if (error && !data.profile) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center', gap: 16 }]}>
        <MaterialCommunityIcons name="wifi-off" size={48} color={C.outlineVariant} />
        <Text style={[{ fontSize: 16, color: C.onSurface, textAlign: 'center', paddingHorizontal: 32 }, f('BeVietnamPro-Medium')]}>
          Impossible de charger les données.{'\n'}Vérifiez votre connexion.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={[{ color: C.primary, fontWeight: '700' }, f('PlusJakartaSans-Bold')]}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { profile, cities, badges, skills, totalXP, xpToNextLevel, xpProgress } = data;

  const XP_PCT = Math.round(xpProgress * 100);

  const NAV_ITEMS = [
    { icon: 'compass', label: 'Explorer', active: false, route: '/map' },
    { icon: 'trophy-outline', label: 'Quêtes', active: false, route: null },
    { icon: 'pencil-ruler', label: 'Atelier', active: false, route: null },
    { icon: 'account-circle', label: 'Profil', active: true, route: null },
    { icon: 'cog-outline', label: 'Réglages', active: false, route: null },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={C.primary}
            colors={[C.primary]}
          />
        }
      >
        {/* ══════════════════════════════════
            HERO — violet gradient header
        ══════════════════════════════════ */}
        <View style={styles.hero}>
          {/* Decorative diamond */}
          <View style={styles.heroDiamond} pointerEvents="none">
            <Svg width={120} height={120} opacity={0.08}>
              <Path d="M60 0 L120 60 L60 120 L0 60 Z" fill="white" />
            </Svg>
          </View>

          <View style={styles.heroRow}>
            {/* Avatar + level */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarRing}>
                <Image
                  source={require('../assets/images/avatar-map-user.jpg')}
                  style={styles.avatarImg}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.levelBadge}>
                <Text style={[styles.levelTxt, f('PlusJakartaSans-Bold')]}>
                  {profile?.level ?? 1}
                </Text>
              </View>
            </View>

            {/* Name & profile type */}
            <View style={styles.heroInfo}>
              <Text style={[styles.heroName, f('PlusJakartaSans-Bold')]}>
                {profile?.display_name ?? 'Joueur'}
              </Text>
              <View style={styles.profileTypeBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={13} color="#fff" />
                <Text style={[styles.profileTypeTxt, f('PlusJakartaSans-Bold')]}>
                  {profile?.profile_type ?? 'Le Stratège'}
                </Text>
              </View>
            </View>

            {/* Streak badge */}
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={[styles.streakTxt, f('PlusJakartaSans-Bold')]}>
                {profile?.streak_days ?? 0}j
              </Text>
            </View>
          </View>

          {/* XP progress bar */}
          <View style={styles.xpBlock}>
            <View style={styles.xpLabelRow}>
              <Text style={[styles.xpLabel, f('PlusJakartaSans-Bold')]}>
                ⭐ {totalXP.toLocaleString('fr-FR')} XP
              </Text>
              <Text style={[styles.xpLevelTxt, f('BeVietnamPro-Medium')]}>
                Niv. {profile?.level} → {(profile?.level ?? 1) + 1}
              </Text>
              <Text style={[styles.xpLabel, f('PlusJakartaSans-Bold')]}>
                {XP_PCT}%
              </Text>
            </View>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${XP_PCT}%` }]} />
            </View>
          </View>
        </View>

        {/* Main content offset from hero */}
        <View style={styles.mainContent}>

          {/* ══════════════════════════════════
              MINI STATS BENTO
          ══════════════════════════════════ */}
          <View style={styles.bentoRow}>
            <View style={styles.bentoCard}>
              <Text style={styles.bentoEmoji}>🏆</Text>
              <Text style={[styles.bentoVal, f('PlusJakartaSans-ExtraBold')]}>
                {cities.filter(c => c.status === 'done').length} défis
              </Text>
              <Text style={[styles.bentoLabel, f('BeVietnamPro-Medium')]}>terminés</Text>
            </View>
            <View style={[styles.bentoCard, styles.bentoCardAccent]}>
              <Text style={styles.bentoEmoji}>⭐</Text>
              <Text style={[styles.bentoVal, f('PlusJakartaSans-ExtraBold'), { color: C.tertiary }]}>
                {totalXP.toLocaleString('fr-FR')}
              </Text>
              <Text style={[styles.bentoLabel, f('BeVietnamPro-Medium')]}>XP totaux</Text>
            </View>
            <View style={styles.bentoCard}>
              <Text style={styles.bentoEmoji}>🎖️</Text>
              <Text style={[styles.bentoVal, f('PlusJakartaSans-ExtraBold')]}>
                {badges.length}
              </Text>
              <Text style={[styles.bentoLabel, f('BeVietnamPro-Medium')]}>badges</Text>
            </View>
          </View>

          {/* ══════════════════════════════════
              COMPÉTENCES
          ══════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, f('PlusJakartaSans-ExtraBold')]}>
                Mes Compétences
              </Text>
              <Text style={[styles.sectionAr, f('BeVietnamPro-Medium')]}>{'مهاراتي'}</Text>
            </View>

            {skills.length === 0 ? (
              <Text style={{ color: C.onSurfaceVariant, fontSize: 13, textAlign: 'center', padding: 20 }}>
                Commencez un défi pour débloquer vos compétences !
              </Text>
            ) : (
              <View style={styles.skillsGrid}>
                {skills.map((s) => <SkillRing key={s.skill_id} skill={s} />)}
              </View>
            )}
          </View>

          {/* ══════════════════════════════════
              VOYAGES
          ══════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, f('PlusJakartaSans-ExtraBold')]}>
                Mes Voyages
              </Text>
              <Text style={[styles.sectionAr, f('BeVietnamPro-Medium')]}>{'رحلاتي'}</Text>
            </View>

            {cities.length === 0 ? (
              <Text style={{ color: C.onSurfaceVariant, fontSize: 13, textAlign: 'center', padding: 20 }}>
                Aucun voyage encore commencé.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 8, paddingVertical: 4 }}
              >
                {cities.map((city) => <VoyageCard key={city.city_id} city={city} />)}
              </ScrollView>
            )}
          </View>

          {/* ══════════════════════════════════
              BADGES (TROPHÉES)
          ══════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, f('PlusJakartaSans-ExtraBold')]}>
                Mes Trophées
              </Text>
              <Text style={[styles.sectionAr, f('BeVietnamPro-Medium')]}>{'جوائزي'}</Text>
            </View>

            {badges.length === 0 ? (
              <View style={styles.emptyBadges}>
                <Text style={{ fontSize: 32 }}>🎗️</Text>
                <Text style={[{ fontSize: 13, color: C.onSurfaceVariant }, f('BeVietnamPro-Medium')]}>
                  Terminez des défis pour gagner des badges !
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 8, paddingVertical: 4 }}
              >
                {badges.map((b) => <BadgeCard key={b.id} badge={b} />)}
              </ScrollView>
            )}
          </View>

          {/* ══════════════════════════════════
              CTA — certificat
          ══════════════════════════════════ */}
          <TouchableOpacity style={styles.ghostCta}>
            <MaterialCommunityIcons name="certificate-outline" size={22} color={C.primary} />
            <Text style={[styles.ghostCtaText, f('PlusJakartaSans-Bold')]}>
              Voir mon certificat de compétences
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={C.primary} />
          </TouchableOpacity>

          {/* Supabase data info badge */}
          <View style={styles.dataInfo}>
            <MaterialCommunityIcons name="database-check" size={13} color={C.primary} />
            <Text style={[styles.dataInfoText, f('BeVietnamPro-Medium')]}>
              Données en direct · Supabase
            </Text>
            {loading && <ActivityIndicator size="small" color={C.primary} style={{ marginLeft: 4 }} />}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ══════════════════════════════════
          BOTTOM NAV
      ══════════════════════════════════ */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.navItem, item.active && styles.navItemActive]}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={22}
              color={item.active ? C.primary : C.onSurfaceVariant}
            />
            <Text style={[styles.navLabel, f('BeVietnamPro-Medium'), item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    backgroundColor: '#6B2880',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 28,
    paddingBottom: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 20,
    overflow: 'hidden',
    shadowColor: '#4A1060',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  heroDiamond: { position: 'absolute', top: 0, right: 0 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative', width: 68, height: 68 },
  avatarRing: {
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  levelBadge: {
    position: 'absolute', bottom: -2, right: -4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.tertiary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#6B2880',
  },
  levelTxt: { fontSize: 10, fontWeight: '800', color: '#fff' },
  heroInfo: { flex: 1, gap: 6 },
  heroName: { fontSize: 22, fontWeight: '700', color: '#fff', lineHeight: 26 },
  profileTypeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
  },
  profileTypeTxt: { fontSize: 11, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
    alignSelf: 'flex-start',
  },
  streakEmoji: { fontSize: 16 },
  streakTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // XP bar
  xpBlock: { gap: 8 },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  xpLevelTxt: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  xpBarBg: {
    height: 8, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99, overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%', borderRadius: 99,
    backgroundColor: C.tertiaryFixed,
  },

  // Main content
  mainContent: { paddingHorizontal: 20, paddingTop: 12, gap: 28 },

  // Bento stats
  bentoRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  bentoCard: {
    flex: 1, backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16, padding: 14, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(191,201,193,0.15)',
    shadowColor: '#1c1c18', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  bentoCardAccent: {
    borderColor: 'rgba(115,92,0,0.2)',
    backgroundColor: 'rgba(255,224,136,0.08)',
  },
  bentoEmoji: { fontSize: 22 },
  bentoVal: { fontSize: 18, fontWeight: '800', color: C.onSurface },
  bentoLabel: { fontSize: 9, color: C.onSurfaceVariant, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Sections
  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.primary },
  sectionAr: { fontSize: 13, color: 'rgba(44,78,62,0.45)', fontWeight: '500' },

  // Skills grid
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, rowGap: 20 },

  // Empty badges
  emptyBadges: { alignItems: 'center', gap: 10, paddingVertical: 20, opacity: 0.6 },

  // Ghost CTA
  ghostCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, backgroundColor: 'rgba(44,78,62,0.06)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(44,78,62,0.2)',
  },
  ghostCtaText: { fontSize: 13, fontWeight: '700', color: C.primary },

  // Data info
  dataInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8,
  },
  dataInfoText: { fontSize: 10, color: C.primary, fontWeight: '500', opacity: 0.7 },

  retryBtn: {
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 14, backgroundColor: C.primaryFixed,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10, paddingHorizontal: 4,
    backgroundColor: 'rgba(253,249,243,0.92)',
    borderTopWidth: 1, borderTopColor: 'rgba(191,201,193,0.2)',
    elevation: 16,
    shadowColor: '#1c1c18', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 16,
  },
  navItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 3, paddingVertical: 6, borderRadius: 12,
  },
  navItemActive: { backgroundColor: 'rgba(196,235,214,0.7)' },
  navLabel: {
    fontSize: 9, fontWeight: '500', color: C.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  navLabelActive: { color: C.primary, fontWeight: '700' },
});
