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
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_500Medium, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Path, Circle, Defs, Pattern, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ── Design system tokens ────────────────────────────────────────────
const C = {
  bg: '#fdf9f3',
  bgWarm: '#faf6ef',
  primary: '#2c4e3e',
  primaryLight: '#436655',
  primaryFixed: '#c4ebd6',
  onPrimary: '#ffffff',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  secondaryContainer: '#ffab69',
  secondaryFixed: '#ffdcc4',
  onSecondaryFixed: '#2f1400',
  tertiaryFixed: '#ffe088',
  onTertiaryFixed: '#241a00',
  tertiary: '#735c00',
  surfaceContainer: '#f1ede7',
  surfaceContainerHigh: '#ebe8e2',
  surfaceContainerHighest: '#e6e2dc',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  surfaceDim: '#dddad4',
  red: '#C1440E',
  //  Map specific
  waterBlue: '#dce9f4',
  parchment: '#f6e9cf',
  parchmentDark: '#e8d5ac',
  pathOrange: '#e07b30',
  cityDone: '#2d6a4f',
  cityActive: '#C1440E',
};

// ── City data ───────────────────────────────────────────────────────
// Positions are percentages of map image
const CITIES = [
  {
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    top: 0.61,
    left: 0.43,
    state: 'done',
    xp: '+120 XP',
    skill: 'Leadership',
  },
  {
    name: 'Marrakech',
    nameAr: 'مراكش',
    top: 0.745,
    left: 0.345,
    state: 'current',
    xp: '+120 XP',
    skill: 'Communication',
  },
  {
    name: 'Tanger', nameAr: 'طنجة', top: 0.27, left: 0.52, state: 'locked', xp: '+150 XP', skill: 'Négociation',
  },
  {
    name: 'Rabat', nameAr: 'الرباط', top: 0.505, left: 0.46, state: 'locked', xp: '+100 XP', skill: 'Collaboration',
  },
  {
    name: 'Fès', nameAr: 'فاس', top: 0.535, left: 0.615, state: 'locked', xp: '+140 XP', skill: 'Créativité',
  },
  {
    name: 'Agadir', nameAr: 'أكادير', top: 0.84, left: 0.23, state: 'locked', xp: '+130 XP', skill: 'Agilité',
  },
];

// ── Map geometry ─────────────────────────────────────────────────
const MAP_W = width - 32;
const MAP_H = MAP_W * 1.2;

// ── City pin component ──────────────────────────────────────────────
function CityPin({ city, mapW, mapH, onPress, f }: any) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (city.state === 'current') {
      const loop = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ]),
            Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      loop(pulse1, 0);
      loop(pulse2, 600);
    }
  }, []);

  const posX = city.left * mapW - 22;
  const posY = city.top * mapH - 22;

  // ── DONE (Casablanca) ──
  if (city.state === 'done') {
    return (
      <View style={[pinStyles.wrap, { left: posX, top: posY }]}>
        <View style={pinStyles.doneRing}>
          <View style={pinStyles.doneDot}>
            <MaterialCommunityIcons name="check-bold" size={13} color="#fff" />
          </View>
        </View>
        <View style={pinStyles.doneLabel}>
          <Text style={[pinStyles.doneLabelText, f('PlusJakartaSans-Bold')]}>{city.name}</Text>
        </View>
      </View>
    );
  }

  // ── CURRENT (Marrakech) ──
  if (city.state === 'current') {
    const pulseStyle = (anim: Animated.Value) => ({
      opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.5, 0.5, 0] }),
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
    });
    return (
      <TouchableOpacity
        style={[pinStyles.wrap, { left: posX, top: posY }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Ripple rings */}
        <Animated.View style={[pinStyles.pulseRing, pulseStyle(pulse1)]} />
        <Animated.View style={[pinStyles.pulseRing, pulseStyle(pulse2)]} />
        {/* Main pin */}
        <View style={pinStyles.activeOuter}>
          <View style={pinStyles.activeDot}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
          </View>
        </View>
        {/* Label */}
        <View style={pinStyles.activeLabel}>
          <Text style={[pinStyles.activeLabelText, f('PlusJakartaSans-Bold')]}>{city.name}</Text>
        </View>
        {/* "En cours!" chip */}
        <View style={pinStyles.activeChip}>
          <Text style={[pinStyles.activeChipText, f('PlusJakartaSans-Bold')]}>🏆 En cours</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ── LOCKED ──
  return (
    <View style={[pinStyles.wrap, { left: posX, top: posY, opacity: 0.45 }]}>
      <View style={pinStyles.lockedDot}>
        <MaterialCommunityIcons name="lock" size={12} color={C.outline} />
      </View>
      <Text style={[pinStyles.lockedText, f('BeVietnamPro-500Medium')]}>{city.name}</Text>
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrap: { position: 'absolute', alignItems: 'center', gap: 3 },
  // Done
  doneRing: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(45,106,79,0.2)',
    borderWidth: 2, borderColor: C.cityDone,
    alignItems: 'center', justifyContent: 'center',
  },
  doneDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.cityDone,
    alignItems: 'center', justifyContent: 'center',
  },
  doneLabel: {
    backgroundColor: 'rgba(196,235,214,0.92)',
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 99, borderWidth: 1, borderColor: 'rgba(44,78,62,0.3)',
  },
  doneLabelText: { fontSize: 9, fontWeight: '700', color: C.primary },
  // Current
  pulseRing: {
    position: 'absolute',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.red,
  },
  activeOuter: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.red, opacity: 1,
    borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    elevation: 8,
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  activeDot: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.red,
    alignItems: 'center', justifyContent: 'center',
  },
  activeLabel: {
    backgroundColor: '#fff2ed',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 99, borderWidth: 2, borderColor: C.red,
    marginTop: 2,
  },
  activeLabelText: { fontSize: 11, fontWeight: '800', color: C.red },
  activeChip: {
    backgroundColor: C.red,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 99, marginTop: 2,
  },
  activeChipText: { fontSize: 8, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  // Locked
  lockedDot: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.surfaceContainerHighest,
    borderWidth: 1, borderColor: C.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  lockedText: { fontSize: 8, fontWeight: '500', color: C.outline },
});

// ── Main Screen ─────────────────────────────────────────────────────
export default function MapScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Bold': BeVietnamPro_700Bold,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  const XP = 340;
  const XP_MAX = 500;
  const XP_PCT = (XP / XP_MAX) * 100;

  const BOTTOM_NAV = [
    { icon: 'compass', label: 'Explorer', active: true, route: null },
    { icon: 'trophy-outline', label: 'Quêtes', active: false, route: null },
    { icon: 'pencil-ruler', label: 'Atelier', active: false, route: null },
    { icon: 'account-circle-outline', label: 'Profil', active: false, route: '/dashboard' },
    { icon: 'cog-outline', label: 'Réglages', active: false, route: null },
  ];

  return (
    <View style={styles.root}>
      {/* ── Subtle zellige background pattern ── */}
      <Svg style={StyleSheet.absoluteFillObject as any} width={width} height={height}>
        <Defs>
          <Pattern id="zellige" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <Path
              d="M20 0 L40 20 L20 40 L0 20 Z"
              fill="none"
              stroke="#bfc9c1"
              strokeWidth="0.4"
              opacity="0.4"
            />
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#zellige)" />
      </Svg>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ══════════════════════════════════════
            HEADER – Player Stats
        ══════════════════════════════════════ */}
        <View style={styles.header}>
          {/* Left: Avatar + info */}
          <View style={styles.headerLeft}>
            <View style={styles.avatarWrap}>
              <Image
                source={require('../assets/images/avatar-map-user.jpg')}
                style={styles.avatarImg}
                resizeMode="cover"
              />
              <View style={styles.levelBadge}>
                <Text style={[styles.levelText, f('PlusJakartaSans-Bold')]}>3</Text>
              </View>
            </View>
            <View>
              <Text style={[styles.userName, f('PlusJakartaSans-Bold')]}>Yassine</Text>
              <View style={styles.profileBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={10} color={C.tertiary} />
                <Text style={[styles.profileBadgeText, f('PlusJakartaSans-Bold')]}>Le Stratège</Text>
              </View>
            </View>
          </View>

          {/* Right: XP + streak */}
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={[styles.streakText, f('PlusJakartaSans-Bold')]}>5 j.</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* XP Progress bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <Text style={[styles.xpLabel, f('PlusJakartaSans-Bold')]}>⭐ {XP} XP</Text>
            <Text style={[styles.xpLevelText, f('BeVietnamPro-Medium')]}>Niv. 3 → 4</Text>
            <Text style={[styles.xpLabel, f('PlusJakartaSans-Bold')]}>{XP_MAX} XP</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${XP_PCT}%` }]}>
              <LinearGradient
                colors={[C.primary, C.cityDone]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, f('PlusJakartaSans-ExtraBold')]}>Le Voyage</Text>
          <Text style={[styles.titleAr, f('BeVietnamPro-Medium')]}>{'رحلة المهارات'}</Text>
        </View>

        {/* ══════════════════════════════════════
            MAP CANVAS
        ══════════════════════════════════════ */}
        <View style={styles.mapContainer}>
          {/* Water bg */}
          <View style={[styles.waterBg, { width: MAP_W, height: MAP_H }]}>
            {/* Parchment overlay gradient */}
            <LinearGradient
              colors={['#f6e9cf', '#eeddb3']}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 32 }]}
            />
            {/* Morocco map image */}
            <Image
              source={require('../assets/images/map-morocco.jpg')}
              style={styles.mapImg}
              resizeMode="contain"
            />

            {/* ── SVG: journey path + city circles ── */}
            <Svg
              style={StyleSheet.absoluteFillObject}
              width={MAP_W}
              height={MAP_H}
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            >
              {/* Completed path: Casa → Marrakech (solid, green) */}
              <Path
                d={`M${MAP_W * 0.43},${MAP_H * 0.61}
                   C${MAP_W * 0.41},${MAP_H * 0.65} ${MAP_W * 0.37},${MAP_H * 0.70}
                   ${MAP_W * 0.345},${MAP_H * 0.745}`}
                fill="none"
                stroke={C.cityDone}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Forward path: Marrakech → next locked (dashed, faded) */}
              <Path
                d={`M${MAP_W * 0.345},${MAP_H * 0.745}
                   C${MAP_W * 0.30},${MAP_H * 0.72} ${MAP_W * 0.25},${MAP_H * 0.78}
                   ${MAP_W * 0.23},${MAP_H * 0.84}`}
                fill="none"
                stroke={C.outlineVariant}
                strokeWidth="2.5"
                strokeDasharray="7 6"
                strokeLinecap="round"
                opacity={0.5}
              />
              {/* Glow dot on completed path midpoint */}
              <Circle
                cx={MAP_W * 0.385}
                cy={MAP_H * 0.675}
                r="5"
                fill={C.cityDone}
                opacity={0.4}
              />
            </Svg>

            {/* City pins */}
            {CITIES.map((city) => (
              <CityPin
                key={city.name}
                city={city}
                mapW={MAP_W}
                mapH={MAP_H}
                onPress={() => router.push('/marrakech')}
                f={f}
              />
            ))}

            {/* Compass rose decoration (bottom-right) */}
            <View style={styles.compass} pointerEvents="none">
              <MaterialCommunityIcons name="compass-rose" size={48} color="rgba(44,78,62,0.12)" />
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════
            ACTIVE CHALLENGE CARD
        ══════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.challengeCard}
          activeOpacity={0.92}
          onPress={() => router.push('/marrakech')}
        >
          {/* Red top accent */}
          <View style={styles.challengeAccent} />

          <View style={styles.challengeBody}>
            {/* Thumbnail */}
            <View style={styles.challengeThumb}>
              <Image
                source={require('../assets/images/marrakech-thumbnail.jpg')}
                style={styles.challengeThumbImg}
                resizeMode="cover"
              />
              <View style={styles.challengeThumbBadge}>
                <Text style={[styles.challengeThumbBadgeText, f('PlusJakartaSans-Bold')]}>
                  🎯 Défi actif
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.challengeInfo}>
              <View style={styles.challengeTitleRow}>
                <Text style={[styles.challengeCity, f('PlusJakartaSans-ExtraBold')]}>
                  Marrakech
                </Text>
                <Text style={[styles.challengeCityAr, f('BeVietnamPro-Medium')]}>
                  {'مراكش'}
                </Text>
              </View>

              <Text style={[styles.challengeScenario, f('BeVietnamPro-Medium')]}>
                La réunion qui tourne mal
              </Text>

              {/* Progress: 1/4 missions */}
              <View style={styles.challengeProgress}>
                <View style={styles.challengeProgressBar}>
                  <View style={[styles.challengeProgressFill, { width: '25%' }]} />
                </View>
                <Text style={[styles.challengeProgressText, f('PlusJakartaSans-Bold')]}>
                  1/4
                </Text>
              </View>

              {/* Skills chips */}
              <View style={styles.skillChips}>
                <View style={[styles.skillChip, { backgroundColor: C.primaryFixed }]}>
                  <Text style={[styles.skillChipText, { color: C.primary }, f('PlusJakartaSans-Bold')]}>
                    💬 Communication
                  </Text>
                </View>
                <View style={[styles.skillChip, { backgroundColor: C.secondaryFixed }]}>
                  <Text style={[styles.skillChipText, { color: '#6f3800' }, f('PlusJakartaSans-Bold')]}>
                    🌍 Interculturel
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.challengeFooter}>
            <LinearGradient
              colors={[C.red, '#9e3000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.challengeCta}
            >
              <Text style={[styles.challengeCtaText, f('PlusJakartaSans-ExtraBold')]}>
                Continuer le défi
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
          </View>
        </TouchableOpacity>

        {/* ══════════════════════════════════════
            JOURNEY OVERVIEW — horizontal scroll
        ══════════════════════════════════════ */}
        <View style={styles.journeySection}>
          <View style={styles.journeyHeader}>
            <Text style={[styles.journeyTitle, f('PlusJakartaSans-ExtraBold')]}>
              Mes étapes
            </Text>
            <Text style={[styles.journeyAr, f('BeVietnamPro-Medium')]}>{'محطاتي'}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.journeyScroll}
          >
            {CITIES.map((city) => {
              const isDone = city.state === 'done';
              const isCurrent = city.state === 'current';
              const isLocked = city.state === 'locked';
              return (
                <TouchableOpacity
                  key={city.name}
                  style={[
                    styles.journeyCard,
                    isDone && styles.journeyCardDone,
                    isCurrent && styles.journeyCardCurrent,
                    isLocked && styles.journeyCardLocked,
                  ]}
                  disabled={isLocked}
                  onPress={() => isCurrent && router.push('/marrakech')}
                  activeOpacity={isCurrent ? 0.85 : 1}
                >
                  {/* State icon */}
                  <View style={[
                    styles.journeyCardIcon,
                    isDone && { backgroundColor: C.cityDone },
                    isCurrent && { backgroundColor: C.red },
                    isLocked && { backgroundColor: C.surfaceContainerHighest },
                  ]}>
                    <MaterialCommunityIcons
                      name={isDone ? 'check-bold' : isCurrent ? 'map-marker' : 'lock'}
                      size={16}
                      color={isLocked ? C.outline : '#fff'}
                    />
                  </View>
                  <Text style={[
                    styles.journeyCardName,
                    f('PlusJakartaSans-Bold'),
                    isCurrent && { color: C.red },
                    isLocked && { color: C.outline },
                  ]}>
                    {city.name}
                  </Text>
                  <Text style={[styles.journeyCardNameAr, f('BeVietnamPro-Medium')]}>
                    {city.nameAr}
                  </Text>
                  {/* XP reward */}
                  <View style={[
                    styles.journeyXpBadge,
                    isDone && { backgroundColor: 'rgba(45,106,79,0.1)' },
                    isCurrent && { backgroundColor: 'rgba(193,68,14,0.1)' },
                  ]}>
                    <Text style={[
                      styles.journeyXpText,
                      f('PlusJakartaSans-Bold'),
                      isDone && { color: C.cityDone },
                      isCurrent && { color: C.red },
                    ]}>
                      {isDone ? '✓ Terminé' : isCurrent ? '▶ En cours' : '🔒 Verrouillé'}
                    </Text>
                  </View>
                  <Text style={[styles.journeySkill, f('BeVietnamPro-Medium')]}>{city.skill}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ══════════════════════════════════════
          BOTTOM NAVIGATION BAR
      ══════════════════════════════════════ */}
      <View style={styles.bottomNav}>
        {BOTTOM_NAV.map((item) => (
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
            <Text style={[
              styles.navLabel,
              f('BeVietnamPro-Medium'),
              item.active && styles.navLabelActive,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 52 : 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  avatarWrap: { position: 'relative', width: 44, height: 44 },
  avatarImg: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: C.primaryFixed,
  },
  levelBadge: {
    position: 'absolute', bottom: -2, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.tertiary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.bg,
  },
  levelText: { fontSize: 8, fontWeight: '800', color: '#fff' },

  userName: { fontSize: 15, fontWeight: '700', color: C.primary },
  profileBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(115,92,0,0.1)',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 99, marginTop: 2,
  },
  profileBadgeText: { fontSize: 9, fontWeight: '700', color: C.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },

  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: 'rgba(255,172,105,0.15)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1, borderColor: 'rgba(255,172,105,0.3)',
  },
  streakEmoji: { fontSize: 12 },
  streakText: { fontSize: 11, fontWeight: '700', color: '#9a4700' },
  settingsBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  // ── XP progress ──
  xpSection: { marginBottom: 16, gap: 6 },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLabel: { fontSize: 11, fontWeight: '700', color: C.tertiary },
  xpLevelText: { fontSize: 10, fontWeight: '500', color: C.onSurfaceVariant },
  xpBarBg: {
    height: 8, backgroundColor: C.surfaceContainerHighest,
    borderRadius: 99, overflow: 'hidden',
  },
  xpBarFill: { height: '100%', borderRadius: 99, overflow: 'hidden' },

  // ── Title ──
  titleSection: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: C.primary, letterSpacing: -0.5 },
  titleAr: { fontSize: 14, fontWeight: '500', color: 'rgba(44,78,62,0.45)' },

  // ── Map ──
  mapContainer: {
    width: MAP_W,
    alignSelf: 'center',
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    borderWidth: 5,
    borderColor: C.parchmentDark,
  },
  waterBg: {
    backgroundColor: C.waterBlue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapImg: {
    width: '88%',
    height: '88%',
    opacity: 0.82,
    tintColor: '#5a3a00',
  } as any,

  compass: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    opacity: 0.5,
  },

  // ── Challenge card ──
  challengeCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(193,68,14,0.1)',
  },
  challengeAccent: { height: 4, backgroundColor: C.red },
  challengeBody: { flexDirection: 'row', padding: 16, gap: 14 },
  challengeThumb: {
    width: 80, height: 80, borderRadius: 12, overflow: 'hidden',
    flexShrink: 0, position: 'relative',
  },
  challengeThumbImg: { width: '100%', height: '100%' },
  challengeThumbBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(193,68,14,0.85)',
    paddingVertical: 2, alignItems: 'center',
  },
  challengeThumbBadgeText: { fontSize: 8, fontWeight: '700', color: '#fff' },

  challengeInfo: { flex: 1, gap: 6 },
  challengeTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  challengeCity: { fontSize: 20, fontWeight: '800', color: C.onSurface },
  challengeCityAr: { fontSize: 13, fontWeight: '500', color: 'rgba(44,78,62,0.5)' },
  challengeScenario: { fontSize: 12, fontWeight: '500', color: C.onSurfaceVariant, lineHeight: 18 },

  challengeProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  challengeProgressBar: {
    flex: 1, height: 5, backgroundColor: C.surfaceContainerHighest,
    borderRadius: 99, overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%', backgroundColor: C.red, borderRadius: 99,
  },
  challengeProgressText: { fontSize: 10, fontWeight: '700', color: C.red },

  skillChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 99 },
  skillChipText: { fontSize: 9, fontWeight: '700' },

  challengeFooter: { paddingHorizontal: 16, paddingBottom: 16 },
  challengeCta: {
    borderRadius: 14, height: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
  },
  challengeCtaText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // ── Journey section ──
  journeySection: { gap: 12, marginBottom: 8 },
  journeyHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  journeyTitle: { fontSize: 18, fontWeight: '800', color: C.primary },
  journeyAr: { fontSize: 12, fontWeight: '500', color: 'rgba(44,78,62,0.4)' },
  journeyScroll: { gap: 12, paddingRight: 8 },

  journeyCard: {
    width: 110,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    flexShrink: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  journeyCardDone: {
    borderColor: 'rgba(45,106,79,0.4)',
    backgroundColor: 'rgba(196,235,214,0.2)',
  },
  journeyCardCurrent: {
    borderColor: C.red,
    borderWidth: 2,
    backgroundColor: '#fff5f2',
    elevation: 4,
    shadowColor: C.red,
    shadowOpacity: 0.15,
  },
  journeyCardLocked: { opacity: 0.5 },

  journeyCardIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  journeyCardName: { fontSize: 11, fontWeight: '700', color: C.onSurface, textAlign: 'center' },
  journeyCardNameAr: { fontSize: 9, fontWeight: '500', color: C.onSurfaceVariant, textAlign: 'center' },
  journeyXpBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    backgroundColor: C.surfaceContainer,
    borderRadius: 99,
  },
  journeyXpText: { fontSize: 8, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 0.3 },
  journeySkill: { fontSize: 8, fontWeight: '500', color: C.onSurfaceVariant, textAlign: 'center', lineHeight: 12 },

  // ── Bottom Navigation ──
  bottomNav: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(253,249,243,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(191,201,193,0.2)',
    elevation: 16,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(196,235,214,0.7)',
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  navLabelActive: { color: C.primary, fontWeight: '700' },
});
