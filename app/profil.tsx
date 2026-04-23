import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { CompetencyRadar } from '../components/CompetencyRadar';
import { AVATARS } from '../constants/Avatars';
import { BADGES } from '../constants/Badges';
import { useAuthStore } from '../stores/authStore';
import { MainBottomNav } from '../components/MainBottomNav';

const { width } = Dimensions.get('window');



export default function ProfilClassiqueScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { colors: COLORS } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: COLORS.background }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.primary }]}>Le Voyage</Text>
        </View>
        <View style={[styles.headerAvatarContainer, { borderColor: COLORS.primaryLight }]}>
          <Image 
            source={AVATARS.explorer} 
            style={styles.headerAvatar} 
            contentFit="cover" 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
          <View style={styles.mainAvatarWrapper}>
            <View style={[styles.mainAvatarBorder, { backgroundColor: COLORS.primary }]}>
              <Image 
                source={AVATARS.explorer} 
                style={[styles.mainAvatar, { borderColor: COLORS.background }]} 
                contentFit="cover" 
              />
            </View>
            <View style={[styles.levelBadge, { backgroundColor: COLORS.gold, borderColor: COLORS.background }]}>
              <Text style={[styles.levelBadgeText, { color: COLORS.white }]}>NIVEAU 12</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: COLORS.primary }]}>Amine Mansouri</Text>
          <Text style={[styles.profileRole, { color: COLORS.onSurfaceVariant }]}>Explorateur de Savoir</Text>
        </Animated.View>

        {/* Soft Skills Radar Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.radarSection}>
          <View style={[styles.radarCard, { backgroundColor: COLORS.surfaceVariant }]}>
            <MaterialIcons name="architecture" size={60} color={COLORS.primary} style={styles.bgIcon} />
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="psychology" size={24} color={COLORS.primary} />
              <Text style={[styles.cardTitle, { color: COLORS.primary }]}>Majlis des Soft Skills</Text>
            </View>

            {/* Animated 3-axis radar */}
            <CompetencyRadar />
          </View>
        </Animated.View>

        {/* Horizontal Badge Gallery */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.badgesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Coffre aux Bijoux</Text>
            <TouchableOpacity onPress={() => router.push('/badges')}>
              <Text style={[styles.seeAllText, { color: COLORS.accent }]}>VOIR TOUT</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
            {BADGES.slice(0, 6).map((badge) => {
              const unlocked = user?.badges?.includes(badge.id);
              return (
                <TouchableOpacity 
                  key={badge.id} 
                  style={[styles.badgeCard, { backgroundColor: COLORS.surface }, !unlocked && { opacity: 0.5 }]}
                  onPress={() => router.push('/badges')}
                >
                  <View style={[styles.badgeIconBg, { backgroundColor: unlocked ? COLORS.primaryLight : COLORS.surfaceVariant }]}>
                    {badge.remoteImage ? (
                      <Image 
                        source={badge.remoteImage} 
                        style={{ width: 44, height: 44 }}
                        contentFit="contain"
                      />
                    ) : (
                      <MaterialIcons name={badge.icon as any} size={32} color={unlocked ? COLORS.primary : COLORS.outline} />
                    )}
                  </View>
                  <Text style={[styles.badgeName, { color: COLORS.onSurface }]}>{badge.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Family Leaderboard */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.leaderboardSection}>
          <View style={[styles.leaderboardCard, { backgroundColor: COLORS.surfaceVariant }]}>
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="groups" size={24} color={COLORS.primary} />
              <Text style={[styles.cardTitle, { color: COLORS.primary }]}>Cercle Familial</Text>
            </View>

            <View style={styles.leaderboardList}>
              <View style={[styles.lbItem, { backgroundColor: COLORS.surface }]}>
                <View style={styles.lbItemLeft}>
                  <Text style={[styles.lbRankTertiary, { color: COLORS.gold }]}>1</Text>
                  <Image source={AVATARS.mentor} style={[styles.lbAvatar, { borderColor: COLORS.gold }]} />
                  <View>
                    <Text style={[styles.lbName, { color: COLORS.onSurface }]}>Oncle Youssef</Text>
                    <Text style={[styles.lbRole, { color: COLORS.onSurfaceVariant }]}>Savant de la Famille</Text>
                  </View>
                </View>
                <Text style={[styles.lbScorePrimary, { color: COLORS.primary }]}>4850 XP</Text>
              </View>

              <View style={[styles.lbItemActive, { backgroundColor: COLORS.primary }]}>
                <View style={styles.lbItemLeft}>
                  <Text style={[styles.lbRankActive, { color: COLORS.primaryLight }]}>2</Text>
                  <Image source={AVATARS.explorer} style={[styles.lbAvatar, { borderColor: COLORS.primaryLight }]} />
                  <View>
                    <Text style={[styles.lbNameActive, { color: COLORS.white }]}>Moi (Amine)</Text>
                    <Text style={[styles.lbRoleActive, { color: COLORS.primaryLight }]}>En pleine ascension</Text>
                  </View>
                </View>
                <Text style={[styles.lbScoreActive, { color: COLORS.white }]}>4210 XP</Text>
              </View>

              <View style={[styles.lbItem, { backgroundColor: COLORS.surface }]}>
                <View style={styles.lbItemLeft}>
                  <Text style={[styles.lbRankOutline, { color: COLORS.outline }]}>3</Text>
                  <Image source={AVATARS.girl} style={[styles.lbAvatar, { borderColor: COLORS.outline }]}/>
                  <View>
                    <Text style={[styles.lbName, { color: COLORS.onSurface }]}>Cousin Amira</Text>
                    <Text style={[styles.lbRole, { color: COLORS.onSurfaceVariant }]}>Voyageuse Curieuse</Text>
                  </View>
                </View>
                <Text style={[styles.lbScorePrimary, { color: COLORS.primary }]}>3980 XP</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
      </ScrollView>
      <MainBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainAvatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  mainAvatarBorder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    padding: 4,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 4,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 2,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  radarSection: {
    marginBottom: 32,
  },
  radarCard: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  radarVisualization: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
    height: 200,
  },
  radarSvg: {
    width: 180,
    height: 180,
    transform: [{ rotate: '-18deg' }],
  },
  radarLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgesSection: {
    marginBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgesScroll: {
    gap: 16,
  },
  badgeCard: {
    width: 112,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  badgeIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  leaderboardSection: {
    marginBottom: 16,
  },
  leaderboardCard: {
    borderRadius: 24,
    padding: 24,
  },
  leaderboardList: {
    gap: 12,
  },
  lbItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  lbItemActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  lbItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lbRankTertiary: {
    width: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lbRankActive: {
    width: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lbRankOutline: {
    width: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lbAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  lbName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lbNameActive: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lbRole: {
    fontSize: 10,
  },
  lbRoleActive: {
    fontSize: 10,
    opacity: 0.8,
  },
  lbScorePrimary: {
    fontSize: 14,
    fontWeight: '900',
  },
  lbScoreActive: {
    fontSize: 14,
    fontWeight: '900',
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
