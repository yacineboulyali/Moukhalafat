import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenges } from '../hooks/useChallenges';
import { useTheme } from '../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { usePlayerCityProgress } from '../hooks/usePlayerCityProgress';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ZoomIn, 
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { BadgeRewardModal } from '../components/BadgeRewardModal';
import { BADGES } from '../constants/Badges';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  surface: '#fdf9f3',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  tertiary: '#735c00',
  tertiaryContainer: '#cca72f',
  secondaryContainer: '#ffab69',
  onPrimary: '#ffffff',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

const PARTICIPANTS = [
  { id: '1', name: 'Yassine', xp: 450, rank: 1, avatar: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-map-user.jpg?v=1775991607434' } },
  { id: '2', name: 'Zineb', xp: 380, rank: 2, avatar: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-1.jpg?v=1775991607434' } },
  { id: '3', name: 'Karim', xp: 290, rank: 3, avatar: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-2.jpg?v=1775991607434' } },
];

const SKILLS = [
  { name: 'Négociation', val: 0.85, color: '#2c4e3e' },
  { name: 'Empathie', val: 0.70, color: '#cca72f' },
  { name: 'Analyse', val: 0.60, color: '#ffab69' },
];


export default function DefiResultatScreen() {
  const insets = useSafeAreaInsets();
  const { cityId, nextMissionId } = useLocalSearchParams();
  const { challenges } = useChallenges();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const AnimatedSkillBar = ({ skill, index }: { skill: any, index: number }) => {
    const widthVal = useSharedValue(0);

    React.useEffect(() => {
      widthVal.value = withDelay(1400 + index * 200, withTiming(skill.val * 100, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      width: `${widthVal.value}%`,
    }));

    return (
      <View style={styles.skillRow}>
        <View style={styles.skillInfo}>
          <Text style={styles.skillName}>{skill.name}</Text>
          <Text style={styles.skillPercent}>{Math.round(skill.val * 100)}%</Text>
        </View>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, animatedStyle, { backgroundColor: skill.color }]} />
        </View>
      </View>
    );
  };
  
  const { progress, incrementMissionProgress } = usePlayerCityProgress();
  
  const currentCity = cityId as string || 'rabat';
  const cityProg = progress[currentCity];
  const missionsCompleted = cityProg?.missions_completed ?? 0;
  const missionsTotal = cityProg?.missions_total ?? 5;
  const hasNextMission = (missionsCompleted + 1) < missionsTotal;

  const dbData = challenges[currentCity];
  const cityTitle = dbData?.city_name_fr?.toUpperCase() || currentCity.toUpperCase();
  const cityTitleAr = dbData?.city_name_ar || '';

  const [showBadge, setShowBadge] = React.useState(false);
  const earnedBadge = BADGES.find(b => b.id === 'explorateur_curieux') || BADGES[0];

  React.useEffect(() => {
    // Save progress as soon as the result is shown (victory)
    incrementMissionProgress(currentCity);

    // Show badge modal after victory animation
    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNextAction = () => {
    if (hasNextMission) {
      // Go back to intro screen which will now show the NEW current mission
      router.replace({
        pathname: '/intro-defi',
        params: { city: currentCity }
      });
    } else {
      router.replace('/map');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <LinearGradient 
        colors={['#fdf9f3', '#f2ece4']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* Zellige Background Pattern Overlay */}
      <View style={styles.patternLayer}>
        <Svg width={width} height={height} opacity={0.03}>
          {Array.from({ length: 15 }).map((_, i) => (
             <Path 
               key={i} 
               d={`M${i % 2 === 0 ? 0 : 50} ${i * 100} L300 ${i * 150}`} 
               stroke={COLORS.primary} 
               strokeWidth="0.5" 
             />
          ))}
        </Svg>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.title}>Victoire Collective !</Text>
          <Text style={styles.subtitle}>{cityTitleAr || 'النتيجة النهائية للتحدي'}</Text>
          <View style={styles.badgeLabel}>
            <MaterialIcons name="group" size={16} color={COLORS.onPrimary} />
            <Text style={styles.badgeLabelText}>DÉFI {cityTitle} : TERMINÉ</Text>
          </View>
        </Animated.View>

        {/* Podium Section */}
        <View style={styles.podiumContainer}>
          {/* Rang 2 */}
          <Animated.View entering={ZoomIn.delay(600)} style={[styles.podiumItem, styles.rank2]}>
            <View style={[styles.avatarRing, { borderColor: COLORS.silver }]}>
              <Image source={PARTICIPANTS[1].avatar} style={styles.avatar} />
              <View style={[styles.rankBadge, { backgroundColor: COLORS.silver }]}>
                <Text style={styles.rankText}>2</Text>
              </View>
            </View>
            <Text style={styles.participantName}>{PARTICIPANTS[1].name}</Text>
            <Text style={styles.participantXP}>{PARTICIPANTS[1].xp} XP</Text>
          </Animated.View>

          {/* Rang 1 */}
          <Animated.View entering={ZoomIn.delay(400)} style={[styles.podiumItem, styles.rank1]}>
             <MaterialIcons name="emoji-events" size={32} color={COLORS.gold} style={styles.crownIcon} />
            <View style={[styles.avatarRingMain, { borderColor: COLORS.gold }]}>
              <Image source={PARTICIPANTS[0].avatar} style={styles.avatarMain} />
              <View style={[styles.rankBadgeMain, { backgroundColor: COLORS.gold }]}>
                <Text style={styles.rankTextMain}>1</Text>
              </View>
            </View>
            <Text style={[styles.participantName, styles.nameMain]}>{PARTICIPANTS[0].name}</Text>
            <Text style={styles.participantXPMain}>{PARTICIPANTS[0].xp} XP</Text>
          </Animated.View>

          {/* Rang 3 */}
          <Animated.View entering={ZoomIn.delay(800)} style={[styles.podiumItem, styles.rank3]}>
            <View style={[styles.avatarRing, { borderColor: COLORS.bronze }]}>
              <Image source={PARTICIPANTS[2].avatar} style={styles.avatar} />
              <View style={[styles.rankBadge, { backgroundColor: COLORS.bronze }]}>
                <Text style={styles.rankText}>3</Text>
              </View>
            </View>
            <Text style={styles.participantName}>{PARTICIPANTS[2].name}</Text>
            <Text style={styles.participantXP}>{PARTICIPANTS[2].xp} XP</Text>
          </Animated.View>
        </View>

        {/* Rewards Section */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.section}>
          <Text style={styles.sectionTitle}>Tes Récompenses <Text style={styles.sectionArabic}>جوائزك</Text></Text>
          <View style={styles.rewardsRow}>
            <BlurView intensity={60} tint="light" style={styles.rewardCard}>
              <View style={[styles.iconBox, { backgroundColor: COLORS.tertiaryContainer }]}>
                 <MaterialIcons name="bolt" size={24} color="#fff" />
              </View>
              <Text style={styles.rewardVal}>+450 XP</Text>
              <Text style={styles.rewardLabel}>Progrès total</Text>
            </BlurView>

            <BlurView intensity={60} tint="light" style={styles.rewardCard}>
              <View style={[styles.iconBox, { backgroundColor: COLORS.secondaryContainer }]}>
                 <MaterialIcons name="military-tech" size={24} color="#fff" />
              </View>
              <Text style={styles.rewardVal}>{earnedBadge.name}</Text>
              <Text style={styles.rewardLabel}>Nouveau Badge Débloqué</Text>
            </BlurView>
          </View>
        </Animated.View>

        {/* Skill Analysis Section */}
        <Animated.View entering={FadeInUp.delay(1200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse des compétences <Text style={styles.sectionArabic}>تحليل المهارات</Text></Text>
          <BlurView intensity={80} tint="light" style={styles.skillsCard}>
            {SKILLS.map((skill, index) => (
              <AnimatedSkillBar key={index} skill={skill} index={index} />
            ))}
          </BlurView>
        </Animated.View>

        {/* Actions Button */}
        <Animated.View entering={FadeInUp.delay(1400)} style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={handleNextAction}
          >
            <LinearGradient 
              colors={['#2c4e3e', '#436655']} 
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.btnText}>
                {hasNextMission ? "Mission Suivante" : "Retourner à la Carte"}
              </Text>
              <MaterialIcons name={hasNextMission ? "arrow-forward" : "map"} size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => router.replace('/accueil')}
          >
            <Text style={styles.secondaryBtnText}>Terminer la session</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      <BadgeRewardModal 
        badge={earnedBadge} 
        isVisible={showBadge} 
        onClose={() => setShowBadge(false)} 
      />

      <ConfettiEffect />
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gold,
    marginTop: 4,
  },
  badgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  badgeLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 220,
    marginBottom: 40,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  rank1: {
    zIndex: 10,
    transform: [{ translateY: -20 }],
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    padding: 2,
    backgroundColor: colors.surface,
    position: 'relative',
    marginBottom: 12,
  },
  avatarRingMain: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    padding: 3,
    backgroundColor: colors.surface,
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarMain: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  rank2: {
    paddingBottom: 20,
  },
  rank3: {
    paddingBottom: 10,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeMain: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  rankText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  rankTextMain: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  nameMain: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  participantXP: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
  participantXPMain: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
  },
  crownIcon: {
    position: 'absolute',
    top: -35,
    zIndex: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
  },
  sectionArabic: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.5,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  rewardLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  skillsCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  skillRow: {
    marginBottom: 16,
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  skillPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBg: {
    height: 10,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
});
