import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BADGES_DATA = [
  {
    id: 'comm',
    title: 'Orateur de la Médina',
    arabic: 'خطيب المدينة',
    skill: 'Communication',
    icon: 'forum',
    unlocked: true,
    description: 'Maîtrise de l\'art de l\'échange avec les habitants.',
  },
  {
    id: 'dec',
    title: 'Décisionnaire Agile',
    arabic: 'صانع القرار',
    skill: 'Décision',
    icon: 'alt-route',
    unlocked: true,
    description: 'Capacité à choisir la meilleure voie dans l\'urgence.',
  },
  {
    id: 'team',
    title: 'Pilier de Famille',
    arabic: 'عماد الأسرة',
    skill: 'Travail d\'équipe',
    icon: 'groups',
    unlocked: true,
    description: 'Soutien inconditionnel aux membres du groupe.',
  },
  {
    id: 'stress',
    title: 'Sérénité du Désert',
    arabic: 'سكينة الصحراء',
    skill: 'Gestion Stress',
    icon: 'psychology-alt',
    unlocked: false,
    description: 'Garder son calme face aux tempêtes de sable.',
  },
  {
    id: 'lead',
    title: 'Guide Spirituel',
    arabic: 'مرشد روحي',
    skill: 'Leadership',
    icon: 'star',
    unlocked: false,
    description: 'Inspirer les autres par sa vision et son action.',
  },
  {
    id: 'adapt',
    title: 'Caméléon des Dunes',
    arabic: 'متكيف الرمال',
    skill: 'Adaptabilité',
    icon: 'auto-fix-high',
    unlocked: false,
    description: 'S\'adapter aux changements brusques d\'environnement.',
  },
];

export default function BadgesScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: colors.surfaceVariant }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Mes Badges</Text>
          <Text style={[styles.headerArabic, { color: colors.gold }]}>أوسمتي</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsCard}>
          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.statsBlur}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.gold }]}>3/6</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>DÉBLOQUÉS</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.gold }]}>550</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>POINTS DE RÉPUTATION</Text>
            </View>
          </BlurView>
        </Animated.View>

        <View style={styles.grid}>
          {BADGES_DATA.map((badge, index) => (
            <Animated.View 
              key={badge.id}
              entering={FadeInDown.delay(300 + index * 100)}
              style={[
                styles.badgeCard, 
                { 
                  backgroundColor: badge.unlocked ? colors.surface : colors.locked,
                  borderColor: badge.unlocked ? colors.gold + '40' : colors.border,
                }
              ]}
            >
              <View style={[
                styles.iconContainer, 
                { backgroundColor: badge.unlocked ? colors.primary + '15' : 'rgba(0,0,0,0.1)' }
              ]}>
                <MaterialIcons 
                  name={badge.icon as any} 
                  size={32} 
                  color={badge.unlocked ? colors.gold : colors.onSurfaceVariant} 
                />
                {!badge.unlocked && (
                  <View style={styles.lockOverlay}>
                    <MaterialIcons name="lock" size={16} color={colors.onSurfaceVariant} />
                  </View>
                )}
              </View>
              
              <Text style={[
                styles.badgeTitle, 
                { color: badge.unlocked ? colors.onSurface : colors.onSurfaceVariant }
              ]}>
                {badge.title}
              </Text>
              <Text style={[styles.badgeArabic, { color: colors.gold }]}>
                {badge.arabic}
              </Text>
              
              {badge.unlocked && (
                <View style={styles.unlockedTag}>
                  <Text style={styles.unlockedText}>DÉBLOQUÉ</Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color={colors.onSurfaceVariant} />
          <Text style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
            Continuez votre voyage pour débloquer de nouveaux badges et améliorer vos compétences.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 70,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerArabic: {
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 2,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  statsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsBlur: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'Plus Jakarta Sans',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: (width - 64) / 2,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#333',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
  },
  badgeArabic: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
  },
  unlockedTag: {
    marginTop: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlockedText: {
    color: '#D4AF37',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
