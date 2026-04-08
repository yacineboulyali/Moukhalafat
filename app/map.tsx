import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
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

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FFF8F0',
  goldAccent: '#D4A843',
  deepText: '#1A1A2E',
  surface: '#ffffff',
  tertiary: '#735c00',
  lockedPath: 'rgba(212, 168, 67, 0.15)',
};

// Simple animated lantern component
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

  return <Animated.View style={[styles.lantern, style, animatedStyle]} />;
};

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profil')}>
            <Image
              source={require('../assets/images/user-avatar.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Le Voyage</Text>
            <Text style={styles.headerSubtitle}>الرحلة</Text>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.menuBtn}
          onPress={() => router.push('/settings')}
        >
          <MaterialIcons name="settings" size={24} color={COLORS.deepText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Floating Lanterns */}
        <Lantern delay={0} style={{ top: 200, left: 60 }} />
        <Lantern delay={1000} style={{ top: 400, right: 80 }} />
        <Lantern delay={2000} style={{ top: 600, left: 100 }} />
        <Lantern delay={500} style={{ top: 800, right: 60 }} />

        {/* Path connector layer */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg width={width} height={1200}>
            {/* Rabat -> Chef */}
            <Path d={`M ${width/2} 1050 Q ${width/2 + 60} 950 ${width/2} 850`} fill="none" stroke={COLORS.goldAccent} strokeWidth="8" strokeLinecap="round" />
            {/* Chef -> Fès */}
            <Path d={`M ${width/2} 850 Q ${width/2 - 60} 750 ${width/2} 650`} fill="none" stroke={COLORS.goldAccent} strokeWidth="8" strokeLinecap="round" />
            {/* Fès -> Marrakech (Dashed Active) */}
            <Path d={`M ${width/2} 650 Q ${width/2 + 60} 550 ${width/2} 450`} fill="none" stroke={COLORS.goldAccent} strokeWidth="6" strokeDasharray="12 12" opacity={0.6} strokeLinecap="round" />
            {/* Marrakech -> Laayoune (Locked) */}
            <Path d={`M ${width/2} 450 Q ${width/2 - 60} 350 ${width/2} 250`} fill="none" stroke={COLORS.lockedPath} strokeWidth="4" strokeLinecap="round" />
            {/* Laayoune -> Dakhla (Locked) */}
            <Path d={`M ${width/2} 250 Q ${width/2 + 60} 150 ${width/2} 50`} fill="none" stroke={COLORS.lockedPath} strokeWidth="4" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Nodes - listed bottom to top for ScrollView natural flow */}
        
        {/* Dakhla (Locked) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 40 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'dakhla' } })} activeOpacity={0.8}>
          <View style={[styles.nodeBase, styles.nodeLocked]}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Ellipse cx="32" cy="56" rx="20" ry="2.5" fill="#2D6A4F" opacity="0.1" />
              <Rect x="20" y="44" width="3" height="12" rx="1.5" fill="#8B4513" opacity="0.6" />
              <Rect x="27" y="44" width="3" height="12" rx="1.5" fill="#8B4513" opacity="0.6" />
              <Rect x="37" y="44" width="3" height="12" rx="1.5" fill="#8B4513" opacity="0.6" />
              <Rect x="44" y="44" width="3" height="12" rx="1.5" fill="#8B4513" opacity="0.6" />
              <Path d="M14 44C14 36 20 32 32 32C44 32 50 36 50 44H14Z" fill="#D4A843" />
              <Path d="M24 32C24 24 28 20 32 20C36 20 40 24 40 32" fill="#B8860B" />
              <Path d="M48 40L55 26" stroke="#D4A843" strokeWidth="6" strokeLinecap="round" />
              <Path d="M53 26C53 22 57 20 61 21C63 22 63 25 63 27L58 30H53Z" fill="#B8860B" />
              <Path d="M26 32H38V38C38 41 35 43 32 43C29 43 26 41 26 38V32Z" fill="#8B4513" opacity="0.2" />
              <Path d="M28 34H36M28 37H36M28 40H36" stroke="#FDF9F3" strokeWidth="0.5" opacity="0.3" fill="none" />
            </Svg>
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitleLocked}>Dakhla</Text>
            <Text style={styles.nodeSubtitleLocked}>الداخلة</Text>
          </View>
        </TouchableOpacity>

        {/* Laâyoune (Locked) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'laayoune' } })} activeOpacity={0.8}>
          <View style={[styles.nodeBase, styles.nodeLocked]}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Path d="M8 48L32 20L56 48" fill="#D4A843" opacity="0.2" />
              <Path d="M4 52L32 24L60 52H4Z" fill="#B8860B" />
              <Path d="M32 24L48 52H16L32 24Z" fill="#8B4513" opacity="0.1" />
              <Rect x="31" y="24" width="2" height="28" fill="#5D4037" />
              <Path d="M16 40L24 33M40 33L48 40" stroke="#FDF9F3" strokeWidth="1" opacity="0.4" fill="none" />
              <Path d="M10 46L20 38M44 38L54 46" stroke="#FDF9F3" strokeWidth="1" opacity="0.3" fill="none" />
              <Rect x="6" y="50" width="52" height="2" fill="#2D6A4F" opacity="0.4" />
            </Svg>
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitleLocked}>Laâyoune</Text>
            <Text style={styles.nodeSubtitleLocked}>العيون</Text>
          </View>
        </TouchableOpacity>

        {/* Marrakech (Locked) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'marrakech' } })} activeOpacity={0.8}>
          <View style={[styles.nodeBase, styles.nodeLocked]}>
            <MaterialIcons name="temple-hindu" size={40} color="rgba(0,0,0,0.2)" />
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitleLocked}>Marrakech</Text>
            <Text style={styles.nodeSubtitleLocked}>مراكش</Text>
          </View>
        </TouchableOpacity>

        {/* Fès (Active) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'fes' } })} activeOpacity={0.8}>
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          <View style={[styles.nodeBase, styles.nodeActive]}>
            <MaterialIcons name="door-front" size={40} color={COLORS.goldAccent} />
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>ACTUEL</Text>
            </View>
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={[styles.nodeTitle, { color: COLORS.deepText }]}>Fès</Text>
            <Text style={[styles.nodeSubtitle, { color: COLORS.goldAccent }]}>فاس</Text>
          </View>
        </TouchableOpacity>

        {/* Chefchaouen (Completed) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 80 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'chefchaouen' } })} activeOpacity={0.8}>
          <View style={[styles.nodeBase, styles.nodeCompletedA]}>
            <Svg width={48} height={48} viewBox="0 0 64 64" fill="none">
              <Path d="M16 52V28L32 16L48 28V52H16Z" fill="#E3F2FD" />
              <Path d="M16 52V36H48V52H16Z" fill="#90CAF9" />
              <Path d="M28 52V42C28 39.7909 29.7909 38 32 38C34.2091 38 36 39.7909 36 42V52H28Z" fill="#1976D2" />
              <Rect x="38" y="28" width="6" height="6" rx="1" fill="#1976D2" opacity="0.6" />
              <Rect x="20" y="28" width="6" height="6" rx="1" fill="#1976D2" opacity="0.6" />
              <Path d="M14 30L32 16.5L50 30" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" fill="none" />
              <Rect x="16" y="50" width="32" height="2" fill="#1565C0" opacity="0.3" />
            </Svg>
            <View style={styles.checkBadge}>
              <MaterialIcons name="check" size={16} color="#3b82f6" style={{ fontWeight: 'bold' }} />
            </View>
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitleCompleted}>Chefchaouen</Text>
            <Text style={[styles.nodeSubtitleCompleted, { color: '#3b82f6' }]}>شفشاون</Text>
          </View>
        </TouchableOpacity>

        {/* Rabat (Completed) */}
        <TouchableOpacity style={[styles.nodeContainer, { marginTop: 80, marginBottom: 120 }]} onPress={() => router.push({ pathname: '/intro-defi' as any, params: { city: 'rabat' } })} activeOpacity={0.8}>
          <View style={[styles.nodeBase, styles.nodeCompletedB]}>
            <Svg width={48} height={48} viewBox="0 0 64 64" fill="none">
              <Rect x="22" y="10" width="20" height="44" fill="#D16B4B" />
              <Rect x="20" y="54" width="24" height="4" fill="#A8553D" />
              <Rect x="20" y="8" width="24" height="2" fill="#A8553D" />
              <Rect x="24" y="6" width="16" height="2" fill="#D16B4B" />
              <Rect x="28" y="16" width="8" height="12" rx="1" fill="#5C2D1F" opacity="0.2" />
              <Rect x="28" y="32" width="8" height="12" rx="1" fill="#5C2D1F" opacity="0.2" />
              <Path d="M 22 14 L 42 14 M 22 18 L 42 18" stroke="#A8553D" strokeWidth="0.5" fill="none" />
              <Path d="M 24 20 L 40 20 M 24 24 L 40 24 M 24 28 L 40 28" stroke="#FDF9F3" strokeWidth="0.3" opacity="0.3" fill="none" />
            </Svg>
            <View style={styles.checkBadge}>
              <MaterialIcons name="check" size={16} color="#10b981" style={{ fontWeight: 'bold' }} />
            </View>
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitleCompleted}>Rabat</Text>
            <Text style={[styles.nodeSubtitleCompleted, { color: '#10b981' }]}>الرباط</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom info card for Active Node (Fès) */}
      <View style={styles.bottomCard}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.cardTag}>
              <Text style={styles.cardTagText}>ÉTAPE 3 • المرحلة ٣</Text>
            </View>
            <Text style={styles.cardTitle}>La Médina de Fès</Text>
            <Text style={styles.cardSubtitle}>فاس البالي</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsLabel}>Points</Text>
            <Text style={styles.pointsValue}>450</Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>
          Explorez le labyrinthe spirituel du Maroc. Maîtrisez le vocabulaire de l'artisanat traditionnel et des souks millénaires...
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.btnText}>COMMENCER LE VOYAGE</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 16), height: 64 + Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="leaderboard" size={24} color="rgba(26,26,46,0.3)" />
          <Text style={styles.navText}>Ligue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="map" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profil')}
        >
          <MaterialIcons name="person" size={24} color="rgba(26,26,46,0.3)" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,248,240,0.85)',
    borderBottomWidth: 1,
    borderColor: 'rgba(212,168,67,0.1)',
    zIndex: 10,
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
    borderColor: 'rgba(212,168,67,0.3)',
  },
  headerTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A1A2E',
  },
  headerSubtitle: {
    fontFamily: 'Noto Sans Arabic',
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.goldAccent,
  },
  progressHeader: {
    flex: 1,
    marginHorizontal: 16,
    maxWidth: 120,
  },
  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(212,168,67,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: COLORS.goldAccent,
  },
  menuBtn: {
    padding: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 240,
  },
  lantern: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: COLORS.goldAccent,
    borderRadius: 3,
    shadowColor: COLORS.goldAccent,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nodeLocked: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.05)',
  },
  nodeActive: {
    backgroundColor: '#fff',
    borderColor: COLORS.goldAccent,
    shadowColor: COLORS.goldAccent,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nodeCompletedA: {
    backgroundColor: '#3b82f6',
    borderColor: '#fff',
  },
  nodeCompletedB: {
    backgroundColor: '#10b981',
    borderColor: '#fff',
  },
  pulseRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(212,168,67,0.2)',
    top: -16,
  },
  activePill: {
    position: 'absolute',
    top: 4,
    backgroundColor: COLORS.goldAccent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activePillText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: '#fff',
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
    color: COLORS.deepText,
    opacity: 0.3,
  },
  nodeSubtitleLocked: {
    fontFamily: 'Noto Sans Arabic',
    fontSize: 12,
    color: COLORS.deepText,
    opacity: 0.3,
  },
  nodeTitle: {
    fontWeight: '900',
    fontSize: 18,
  },
  nodeSubtitle: {
    fontFamily: 'Noto Sans Arabic',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nodeTitleCompleted: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'rgba(26,26,46,0.8)',
  },
  nodeSubtitleCompleted: {
    fontFamily: 'Noto Sans Arabic',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTag: {
    backgroundColor: 'rgba(212,168,67,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.2)',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  cardTagText: {
    color: COLORS.goldAccent,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.deepText,
  },
  cardSubtitle: {
    fontFamily: 'Noto Sans Arabic',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.goldAccent,
  },
  pointsBadge: {
    backgroundColor: 'rgba(212,168,67,0.05)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.1)',
    minWidth: 64,
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'rgba(26,26,46,0.4)',
    textTransform: 'uppercase',
  },
  pointsValue: {
    color: COLORS.goldAccent,
    fontSize: 20,
    fontWeight: '900',
  },
  cardDesc: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 13,
    color: 'rgba(26,26,46,0.7)',
    lineHeight: 18,
    marginBottom: 20,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.goldAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: COLORS.goldAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(212,168,67,0.1)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 24,
    zIndex: 50,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    backgroundColor: COLORS.goldAccent,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: COLORS.goldAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#fff',
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    color: 'rgba(26,26,46,0.3)',
    textTransform: 'uppercase',
  },
});
