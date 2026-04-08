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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ZoomIn, 
  Layout 
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

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
  { id: '1', name: 'Yassine', xp: 450, rank: 1, avatar: require('../assets/images/avatar-map-user.jpg') },
  { id: '2', name: 'Zineb', xp: 380, rank: 2, avatar: require('../assets/images/avatar-1.jpg') },
  { id: '3', name: 'Karim', xp: 290, rank: 3, avatar: require('../assets/images/avatar-2.jpg') },
];

const SKILLS = [
  { name: 'Négociation', val: 0.85, color: '#2c4e3e' },
  { name: 'Empathie', val: 0.70, color: '#cca72f' },
  { name: 'Analyse', val: 0.60, color: '#ffab69' },
];

export default function DefiResultatScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.subtitle}>النتيجة النهائية للتحدي</Text>
          <View style={styles.badgeLabel}>
            <MaterialIcons name="group" size={16} color={COLORS.onPrimary} />
            <Text style={styles.badgeLabelText}>DÉFI FÈS : ARTISANAT</Text>
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
              <Text style={styles.rewardVal}>Badge Or</Text>
              <Text style={styles.rewardLabel}>Négociateur Fès</Text>
            </BlurView>
          </View>
        </Animated.View>

        {/* Skill Analysis Section */}
        <Animated.View entering={FadeInUp.delay(1200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse des compétences <Text style={styles.sectionArabic}>تحليل المهارات</Text></Text>
          <BlurView intensity={80} tint="light" style={styles.skillsCard}>
            {SKILLS.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillPercent}>{Math.round(skill.val * 100)}%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${skill.val * 100}%`, backgroundColor: skill.color }]} />
                </View>
              </View>
            ))}
          </BlurView>
        </Animated.View>

        {/* Actions Button */}
        <Animated.View entering={FadeInUp.delay(1400)} style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.push('/map' as any)}
          >
            <LinearGradient 
              colors={['#2c4e3e', '#436655']} 
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.btnText}>Retourner à la Carte</Text>
              <MaterialIcons name="map" size={20} color="#fff" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.tertiaryContainer,
    marginTop: 4,
    marginBottom: 16,
  },
  badgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  badgeLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
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
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    padding: 3,
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: 12,
  },
  avatarRingMain: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    padding: 4,
    backgroundColor: '#fff',
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
    color: COLORS.onSurface,
  },
  nameMain: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  participantXP: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
  },
  participantXPMain: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.tertiaryContainer,
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
    color: COLORS.primary,
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
    borderColor: 'rgba(255,255,255,0.5)',
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
    color: COLORS.primary,
  },
  rewardLabel: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  skillsCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
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
    color: COLORS.onSurface,
  },
  skillPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  progressBg: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
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
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
  },
});
