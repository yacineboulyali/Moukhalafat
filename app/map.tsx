import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { 
  FadeInDown,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Ellipse, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoundService } from '../services/sounds';
import { useTheme } from '../hooks/useTheme';
import { BlurView } from 'expo-blur';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import FamilyTrustGauge from '../components/FamilyTrustGauge';
import { useChallenges } from '../hooks/useChallenges';

const { width } = Dimensions.get('window');

// COLORS retiré au profit du hook useTheme

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const dynamics = styles(colors, isDark);

  // ── Challenges data from Supabase ──────────────────────────────
  const { challenges } = useChallenges();
  // Active city (hardcoded to 'fes' for now — later comes from player progress)
  const ACTIVE_CITY  = 'fes';
  const activeChallenge = challenges[ACTIVE_CITY];
  const activeColor = activeChallenge?.city_color ?? colors.gold;
  const activeTitle = activeChallenge?.city_name_fr ?? 'Fès';
  const activeTitleAr = activeChallenge?.city_name_ar ?? 'فاس';
  const activeDesc  = activeChallenge?.description_fr ?? 'Explorez la médina historique...';
  const activeStep  = activeChallenge?.step_label ?? 'ÉTAPE 3';

  // Simple animated lantern component moved inside MapScreen to access theme
  const Lantern = ({ delay, style }: { delay: number, style: any }) => {
    const opacity = useSharedValue(0.4);
    const translateY = useSharedValue(0);

    useEffect(() => {
      opacity.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(0.8, { duration: 3000 }),
          withTiming(0.4, { duration: 3000 })
        ), -1, true
      ));
      translateY.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ), -1, true
      ));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={[dynamics.lantern, style, animatedStyle]} />;
  };

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.2);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.3, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={dynamics.mainContainer}>
      {/* Top App Bar avec Blur dynamique */}
      <BlurView 
        intensity={80} 
        tint={isDark ? "dark" : "light"} 
        style={[dynamics.header, { paddingTop: Math.max(insets.top, 16) }]}
      >
        <View style={dynamics.headerLeft}>
          <TouchableOpacity 
            onPress={() => {
              SoundService.getInstance().triggerHaptic('light');
              router.push('/profil');
            }}
          >
            <Image
              source={require('../assets/images/user-avatar.png')}
              style={dynamics.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={dynamics.headerTitle}>Le Voyage</Text>
            <Text style={dynamics.headerSubtitle}>الرحلة</Text>
          </View>
        </View>

        <View style={dynamics.progressHeader}>
          <View style={dynamics.progressTrack}>
            <View style={[dynamics.progressFill, { width: '55%' }]} />
          </View>
        </View>

        <TouchableOpacity 
          style={dynamics.menuBtn}
          onPress={() => router.push('/settings')}
        >
          <MaterialIcons name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </BlurView>

      <View style={{ zIndex: 5, marginTop: 10 }}>
        <FamilyTrustGauge />
      </View>

      <ScrollView 
        contentContainerStyle={dynamics.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Lanterns animées avec couleurs dynamiques */}
        <Lantern delay={0} style={{ top: 200, left: 60 }} />
        <Lantern delay={1000} style={{ top: 400, right: 80 }} />
        <Lantern delay={2000} style={{ top: 600, left: 100 }} />
        <Lantern delay={500} style={{ top: 800, right: 60 }} />

        {/* Path connector layer */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg width={width} height={1200}>
            {/* Rabat -> Chef */}
            <Path d={`M ${width/2} 1050 Q ${width/2 + 60} 950 ${width/2} 850`} fill="none" stroke={colors.gold} strokeWidth="8" strokeLinecap="round" />
            {/* Chef -> Fès */}
            <Path d={`M ${width/2} 850 Q ${width/2 - 60} 750 ${width/2} 650`} fill="none" stroke={colors.gold} strokeWidth="8" strokeLinecap="round" />
            {/* Fès -> Marrakech (Dashed Active) */}
            <Path d={`M ${width/2} 650 Q ${width/2 + 60} 550 ${width/2} 450`} fill="none" stroke={colors.gold} strokeWidth="6" strokeDasharray="12 12" opacity={0.6} strokeLinecap="round" />
            {/* Marrakech -> Laayoune (Locked) */}
            <Path d={`M ${width/2} 450 Q ${width/2 - 60} 350 ${width/2} 250`} fill="none" stroke={colors.gold} strokeWidth="4" strokeLinecap="round" opacity={0.15} />
            {/* Laayoune -> Dakhla (Locked) */}
            <Path d={`M ${width/2} 250 Q ${width/2 + 60} 150 ${width/2} 50`} fill="none" stroke={colors.gold} strokeWidth="4" strokeLinecap="round" opacity={0.1} />
          </Svg>
        </View>

        {/* Nodes - listed bottom to top for ScrollView natural flow */}
        
        {/* Dakhla (Locked) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 40 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'dakhla' } })} activeOpacity={0.8}>
          <View style={[dynamics.nodeBase, dynamics.nodeLocked]}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Ellipse cx="32" cy="56" rx="20" ry="2.5" fill={colors.locked} opacity="0.1" />
              <Rect x="20" y="44" width="3" height="12" rx="1.5" fill={colors.locked} opacity="0.6" />
              <Rect x="27" y="44" width="3" height="12" rx="1.5" fill={colors.locked} opacity="0.6" />
              <Rect x="37" y="44" width="3" height="12" rx="1.5" fill={colors.locked} opacity="0.6" />
              <Rect x="44" y="44" width="3" height="12" rx="1.5" fill={colors.locked} opacity="0.6" />
              <Path d="M14 44C14 36 20 32 32 32C44 32 50 36 50 44H14Z" fill={colors.gold} opacity={0.3} />
              <Path d="M24 32C24 24 28 20 32 20C36 20 40 24 40 32" fill={colors.gold} opacity={0.2} />
              <Path d="M48 40L55 26" stroke={colors.gold} strokeWidth="6" strokeLinecap="round" opacity={0.2} />
            </Svg>
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitleLocked}>{challenges['dakhla']?.city_name_fr ?? 'Dakhla'}</Text>
            <Text style={dynamics.nodeSubtitleLocked}>{challenges['dakhla']?.city_name_ar ?? 'الداخلة'}</Text>
          </View>
        </TouchableOpacity>

        {/* Laâyoune (Locked) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'laayoune' } })} activeOpacity={0.8}>
          <View style={[dynamics.nodeBase, dynamics.nodeLocked]}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Path d="M8 48L32 20L56 48" fill={colors.gold} opacity="0.1" />
              <Path d="M4 52L32 24L60 52H4Z" fill={colors.gold} opacity="0.2" />
              <Rect x="31" y="24" width="2" height="28" fill={colors.locked} opacity={0.2} />
              <Rect x="6" y="50" width="52" height="2" fill={colors.locked} opacity="0.2" />
            </Svg>
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitleLocked}>{challenges['laayoune']?.city_name_fr ?? 'Laâyoune'}</Text>
            <Text style={dynamics.nodeSubtitleLocked}>{challenges['laayoune']?.city_name_ar ?? 'العيون'}</Text>
          </View>
        </TouchableOpacity>

        {/* Marrakech (Locked) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'marrakech' } })} activeOpacity={0.8}>
          <View style={[dynamics.nodeBase, dynamics.nodeLocked]}>
            <MaterialIcons name="temple-hindu" size={40} color={colors.locked} />
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitleLocked}>{challenges['marrakech']?.city_name_fr ?? 'Marrakech'}</Text>
            <Text style={dynamics.nodeSubtitleLocked}>{challenges['marrakech']?.city_name_ar ?? 'مراكش'}</Text>
          </View>
        </TouchableOpacity>

        {/* Fès (Active) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'fes' } })} activeOpacity={0.8}>
          <Animated.View style={[dynamics.pulseRing, pulseStyle]} />
          <View style={[dynamics.nodeBase, dynamics.nodeActive]}>
            <MaterialIcons name="door-front" size={40} color={colors.gold} />
            <View style={dynamics.activePill}>
              <Text style={dynamics.activePillText}>ACTUEL</Text>
            </View>
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitle}>{challenges['fes']?.city_name_fr ?? 'Fès'}</Text>
            <Text style={[dynamics.nodeSubtitle, { color: activeColor }]}>{challenges['fes']?.city_name_ar ?? 'فاس'}</Text>
          </View>
        </TouchableOpacity>

        {/* Chefchaouen (Completed) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'chefchaouen' } })} activeOpacity={0.8}>
          <View style={[dynamics.nodeBase, dynamics.nodeCompletedA]}>
            <Svg width={48} height={48} viewBox="0 0 64 64" fill="none">
              <Path d="M16 52V28L32 16L48 28V52H16Z" fill="#E3F2FD" />
              <Path d="M16 52V36H48V52H16Z" fill="#90CAF9" />
              <Path d="M28 52V42C28 39.7909 29.7909 38 32 38C34.2091 38 36 39.7909 36 42V52H28Z" fill={colors.zellige} />
              <Path d="M14 30L32 16.5L50 30" stroke={colors.zellige} strokeWidth="2" strokeLinecap="round" fill="none" />
            </Svg>
            <View style={dynamics.checkBadge}>
              <MaterialIcons name="check" size={16} color={colors.zellige} style={{ fontWeight: 'bold' }} />
            </View>
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitleCompleted}>{challenges['chefchaouen']?.city_name_fr ?? 'Chefchaouen'}</Text>
            <Text style={[dynamics.nodeSubtitleCompleted, { color: colors.zellige }]}>{challenges['chefchaouen']?.city_name_ar ?? 'شفشاون'}</Text>
          </View>
        </TouchableOpacity>

        {/* Rabat (Completed) */}
        <TouchableOpacity style={[dynamics.nodeContainer, { marginTop: 80, marginBottom: 120 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'rabat' } })} activeOpacity={0.8}>
          <View style={[dynamics.nodeBase, dynamics.nodeCompletedB]}>
            <Svg width={48} height={48} viewBox="0 0 64 64" fill="none">
              <Rect x="22" y="10" width="20" height="44" fill={colors.gold} />
              <Rect x="20" y="54" width="24" height="4" fill={colors.gold} opacity={0.6} />
              <Rect x="20" y="8" width="24" height="2" fill={colors.gold} opacity={0.6} />
            </Svg>
            <View style={dynamics.checkBadge}>
              <MaterialIcons name="check" size={16} color={colors.gold} style={{ fontWeight: 'bold' }} />
            </View>
          </View>
          <View style={dynamics.nodeTextContainer}>
            <Text style={dynamics.nodeTitleCompleted}>{challenges['rabat']?.city_name_fr ?? 'Rabat'}</Text>
            <Text style={[dynamics.nodeSubtitleCompleted, { color: colors.gold }]}>{challenges['rabat']?.city_name_ar ?? 'الرباط'}</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom info card — données depuis Supabase */}
      <Animated.View 
        entering={FadeInDown.delay(500)}
        style={dynamics.bottomCard}
      >
        <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
        <View style={dynamics.cardHeader}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={dynamics.cardTag}>
              <Text style={dynamics.cardTagText}>{activeStep.toUpperCase()}</Text>
            </View>
            <Text style={dynamics.cardTitle}>{activeTitle}</Text>
            <Text style={dynamics.cardSubtitle}>{activeTitleAr}</Text>
          </View>
          <View style={dynamics.pointsBadge}>
            <Text style={dynamics.pointsLabel}>Points</Text>
            <Text style={dynamics.pointsValue}>450</Text>
          </View>
        </View>
        <Text style={dynamics.cardDesc} numberOfLines={2}>
          {activeDesc}
        </Text>
        <TouchableOpacity 
          style={[dynamics.primaryButton, { backgroundColor: activeColor }]}
          onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: ACTIVE_CITY } })}
        >
          <Text style={dynamics.btnText}>COMMENCER LE VOYAGE</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = (colors: any, isDark: boolean) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.onSurface,
  },
  headerSubtitle: {
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.gold,
  },
  progressHeader: {
    flex: 1,
    marginHorizontal: 16,
    maxWidth: 120,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  menuBtn: {
    padding: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 240,
  },
  lantern: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  nodeContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  nodeBase: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    elevation: 5,
  },
  nodeLocked: {
    backgroundColor: isDark ? colors.surfaceVariant : '#fff',
    borderColor: colors.locked,
    opacity: 0.6,
  },
  nodeActive: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
  },
  nodeCompletedA: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.zellige,
  },
  nodeCompletedB: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.gold,
  },
  pulseRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.2)',
    top: -16,
  },
  activePill: {
    position: 'absolute',
    top: 4,
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activePillText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 2,
  },
  nodeTextContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  nodeTitleLocked: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.onSurface,
    opacity: 0.3,
  },
  nodeSubtitleLocked: {
    fontSize: 12,
    color: colors.onSurface,
    opacity: 0.3,
  },
  nodeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.onSurface,
  },
  nodeSubtitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  nodeTitleCompleted: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.onSurface,
  },
  nodeSubtitleCompleted: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 40,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTag: {
    backgroundColor: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gold,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  cardTagText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.onSurface,
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gold,
  },
  pointsBadge: {
    backgroundColor: isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.05)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold,
    minWidth: 64,
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.onSurfaceVariant,
  },
  pointsValue: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 18,
    marginBottom: 20,
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  btnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 24,
    zIndex: 50,
    overflow: 'hidden',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: colors.gold,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    color: colors.onSurfaceVariant,
  },
});
