import React, { useEffect, useRef } from 'react';
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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Svg, { Path, Ellipse, Rect, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoundService } from '../services/sounds';
import { useTheme } from '../hooks/useTheme';
import { BlurView } from 'expo-blur';

import { useChallenges, Challenge } from '../hooks/useChallenges';
import { usePlayerCityProgress } from '../hooks/usePlayerCityProgress';
import { AVATARS } from '../constants/Avatars';

const { width } = Dimensions.get('window');

// COLORS retiré au profit du hook useTheme

const ASSETS_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets';

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const dynamics = styles(colors, isDark);

  const { challenges, loading: loadingChallenges } = useChallenges();
  const { progress, loading: loadingProgress } = usePlayerCityProgress();
  const scrollViewRef = useRef<ScrollView>(null);

  // Convert challenges map to sorted array
  const sortedCities = Object.values(challenges).sort((a, b) => a.sort_order - b.sort_order);
  
  // Determine active city: 
  // 1. First city with 'current' status
  // 2. Or the first 'locked' city (if we just finished previous)
  // 3. Or it defaults to the first sorted city
  const activeCityProgress = Object.values(progress).find(p => p.status === 'current');
  const ACTIVE_CITY_ID = activeCityProgress?.city_id ?? 
    (sortedCities.find(c => !progress[c.city_id] || progress[c.city_id].status === 'locked')?.city_id || sortedCities[0]?.city_id || 'rabat');
  
  const [selectedCityId, setSelectedCityId] = React.useState<string | null>(null);
  const [showBottomCard, setShowBottomCard] = React.useState(false);

  const activeChallenge = selectedCityId ? challenges[selectedCityId] : null;
  const activeColor = activeChallenge?.city_color ?? colors.gold;
  const activeTitle = activeChallenge?.city_name_fr ?? '';
  const activeTitleAr = activeChallenge?.city_name_ar ?? '';
  const activeDesc  = activeChallenge?.description_fr ?? '';
  const activeStep  = activeChallenge?.step_label ?? 'DÉCOUVRIR LA VILLE';

  const handleCityPress = (cityId: string) => {
    setSelectedCityId(cityId);
    setShowBottomCard(true);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('medium');
  };

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

  // Wave effect for the first active city
  const wave1Scale = useSharedValue(1);
  const wave1Opacity = useSharedValue(0.5);
  const wave2Scale = useSharedValue(1);
  const wave2Opacity = useSharedValue(0.5);

  useEffect(() => {
    wave1Scale.value = withRepeat(withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
    wave1Opacity.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
    
    setTimeout(() => {
      wave2Scale.value = withRepeat(withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
      wave2Opacity.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
    }, 1000);
  }, []);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave1Scale.value }],
    opacity: wave1Opacity.value,
  }));
  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave2Scale.value }],
    opacity: wave2Opacity.value,
  }));

  // Auto-scroll to bottom (Rabat) on load
  useEffect(() => {
    if (!loadingChallenges && !loadingProgress) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [loadingChallenges, loadingProgress]);

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
              source={AVATARS.explorer}
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
            <View style={[dynamics.progressFill, { 
              width: `${Math.round(Object.values(progress).reduce((acc, p) => acc + (p.missions_completed / (p.missions_total || 5)), 0) / (Object.keys(challenges).length || 1) * 100)}%` 
            }]} />
          </View>
        </View>

        <TouchableOpacity 
          style={dynamics.menuBtn}
          onPress={() => router.push('/settings')}
        >
          <MaterialIcons name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </BlurView>



      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={dynamics.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Lanterns animées with dynamic colors */}
        <Lantern delay={0} style={{ top: 200, left: 60 }} />
        <Lantern delay={1000} style={{ top: 400, right: 80 }} />
        <Lantern delay={2000} style={{ top: 600, left: 100 }} />
        <Lantern delay={500} style={{ top: 800, right: 60 }} />

        {loadingChallenges || loadingProgress ? (
          <View style={{ marginTop: 200 }}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : (
          <>
            {/* Path connector layer */}
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              <Svg width={width} height={sortedCities.length * 150 + 400}>
                {sortedCities.map((city, index) => {
                  if (index === 0) return null;
                  const prevCity = sortedCities[index - 1];
                  const startY = 1050 - (index - 1) * 160;
                  const endY = 1050 - index * 160;
                  const isRight = index % 2 === 1;
                  const controlX = width / 2 + (isRight ? 60 : -60);
                  
                  const cityProgress = progress[city.city_id];
                  const isLocked = !cityProgress || cityProgress.status === 'locked';
                  
                  return (
                    <Path 
                      key={`path-${city.city_id}`}
                      d={`M ${width/2} ${startY} Q ${controlX} ${(startY + endY)/2} ${width/2} ${endY}`} 
                      fill="none" 
                      stroke={colors.gold} 
                      strokeWidth={isLocked ? "4" : "8"} 
                      strokeDasharray={cityProgress?.status === 'current' ? "12 12" : "0"}
                      opacity={isLocked ? 0.15 : 1} 
                      strokeLinecap="round" 
                    />
                  );
                })}
              </Svg>
            </View>

            {/* Nodes - rendered bottom to top (reversed array) */}
            {[...sortedCities].reverse().map((city, index) => {
              const cityProgress = progress[city.city_id];
              let status = cityProgress?.status ?? 'locked';
              
              // Rabat should be unlocked by default
              if (city.city_id === 'rabat' && status === 'locked') {
                status = 'current';
              }

              const isLocked = status === 'locked';
              const isFirstActive = city.city_id === ACTIVE_CITY_ID;
              
              return (
                <TouchableOpacity 
                  key={city.city_id}
                  style={[dynamics.nodeContainer, { marginTop: index === 0 ? 40 : 80, marginBottom: index === sortedCities.length - 1 ? 120 : 0 }]} 
                  onPress={() => handleCityPress(city.city_id)} 
                  activeOpacity={0.8}
                >
                  {/* Wave effect for the first active/suggested city */}
                  {isFirstActive && (
                    <>
                      <Animated.View style={[dynamics.waveRing, { borderColor: city.city_color || colors.gold }, wave1Style]} />
                      <Animated.View style={[dynamics.waveRing, { borderColor: city.city_color || colors.gold }, wave2Style]} />
                    </>
                  )}

                  {status === 'current' && <Animated.View style={[dynamics.pulseRing, pulseStyle]} />}
                  
                  <View style={[
                    dynamics.nodeBase, 
                    isLocked ? dynamics.nodeLocked : 
                    status === 'current' ? [dynamics.nodeActive, { borderColor: city.city_color || colors.gold }] : 
                    dynamics.nodeCompletedB
                  ]}>
                    <View style={isLocked ? { opacity : 0.6 } : {}}>
                      {isLocked ? (
                        <MaterialIcons name="landscape" size={32} color={colors.onSurfaceVariant} />
                      ) : status === 'done' ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                           <MaterialIcons name="check" size={40} color={city.city_color || colors.gold} />
                           <View style={dynamics.checkBadge}>
                             <MaterialIcons name="verified" size={16} color={city.city_color || colors.gold} />
                           </View>
                        </View>
                      ) : (
                        <MaterialIcons name="location-city" size={40} color={city.city_color || colors.gold} />
                      )}
                    </View>
                    
                    {isLocked && (
                      <View style={dynamics.lockIconContainer}>
                         <MaterialIcons name="lock" size={14} color="#fff" />
                      </View>
                    )}

                    {status === 'current' && (
                      <View style={[dynamics.activePill, { backgroundColor: city.city_color || colors.gold }]}>
                        <Text style={dynamics.activePillText}>ACTUEL</Text>
                      </View>
                    )}
                  </View>

                  <View style={dynamics.nodeTextContainer}>
                    <Text style={isLocked ? dynamics.nodeTitleLocked : dynamics.nodeTitle}>
                      {city.city_name_fr}
                    </Text>
                    <Text style={[isLocked ? dynamics.nodeSubtitleLocked : dynamics.nodeSubtitle, { color: isLocked ? colors.onSurfaceVariant + '40' : (city.city_color || colors.gold) }]}>
                      {city.city_name_ar}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Bottom info card — Pop-up vibrant et réduit de 20% */}
      {showBottomCard && activeChallenge && (
        <Animated.View 
          entering={FadeInDown.springify()}
          style={dynamics.bottomCard}
        >
          <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
          
          <TouchableOpacity 
            style={dynamics.closeBtn}
            onPress={() => setShowBottomCard(false)}
          >
            <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          <View style={dynamics.cardHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={[dynamics.cardTag, { borderColor: activeColor }]}>
                <Text style={[dynamics.cardTagText, { color: activeColor }]}>{activeStep.toUpperCase()}</Text>
              </View>
              <Text style={dynamics.cardTitle}>{activeTitle}</Text>
              <Text style={[dynamics.cardSubtitle, { color: activeColor }]}>{activeTitleAr}</Text>
            </View>
            <View style={[dynamics.pointsBadge, { borderColor: activeColor }]}>
              <Text style={dynamics.pointsLabel}>Points</Text>
              <Text style={[dynamics.pointsValue, { color: activeColor }]}>450</Text>
            </View>
          </View>
          <Text style={dynamics.cardDesc} numberOfLines={2}>
            {activeDesc}
          </Text>
          <TouchableOpacity 
            style={[dynamics.primaryButton, { backgroundColor: activeColor }]}
            onPress={async () => {
              SoundService.getInstance().triggerHaptic('medium');
              
              // Check if pedago has been seen
              try {
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                const hasSeen = await AsyncStorage.getItem(`pedago_seen_${selectedCityId}`);
                if (!hasSeen) {
                  router.push({ pathname: '/pedago' as any, params: { cityId: selectedCityId } });
                  return;
                }
              } catch (e) {
                console.error('Error checking pedago status', e);
              }

              router.push({ pathname: '/intro-defi' as any, params: { city: selectedCityId } });
            }}
          >
            <Text style={dynamics.btnText}>POURSUIVRE LE DÉFI</Text>
            <MaterialIcons name="stars" size={22} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}


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
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nodeLocked: {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
    borderColor: colors.locked + '40',
    opacity: 0.7,
  },
  nodeActive: {
    backgroundColor: colors.surface,
  },
  nodeCompletedB: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.gold,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.15)',
    top: -15,
  },
  activePill: {
    position: 'absolute',
    top: -10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
  },
  activePillText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: colors.locked,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  waveRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    top: -20,
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
    bottom: 120,
    left: width * 0.1, // Adjusted for 20% total reduction (center 80%)
    right: width * 0.1,
    borderRadius: 32,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,67,0.4)',
    zIndex: 100,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: '900',
    color: colors.onSurface,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '800',
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
    fontSize: 16,
    fontWeight: '900',
  },
  cardDesc: {
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 16,
    marginBottom: 16,
    opacity: 0.8,
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
