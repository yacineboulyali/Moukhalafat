import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import { Image } from 'expo-image';
import Svg, { Polygon, Defs, LinearGradient as SVGLG, Stop, Circle as SVGCircle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  primaryFixed: '#c4ebd6',
  primaryFixedDim: '#a9cfba',
  secondary: '#8e4e14',
  secondaryFixed: '#ffdcc4',
  tertiary: '#735c00',
  tertiaryFixed: '#ffe088',
  tertiaryContainer: '#cca72f',
  surface: '#fdf9f3',
  surfaceContainer: '#f1ede7',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#ebe8e2',
  surfaceContainerHighest: '#e6e2dc',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outlineVariant: '#bfc9c1',
  outline: '#707973',
  white: '#ffffff',
};

export default function ProfilClassiqueScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Le Voyage</Text>
        </View>
        <View style={styles.headerAvatarContainer}>
          <Image 
            source={require('../assets/images/stitch/amine_icon.jpg')} 
            style={styles.headerAvatar} 
            contentFit="cover" 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
          <View style={styles.mainAvatarWrapper}>
            <View style={styles.mainAvatarBorder}>
              <Image 
                source={require('../assets/images/stitch/amine_avatar.jpg')} 
                style={styles.mainAvatar} 
                contentFit="cover" 
              />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>NIVEAU 12</Text>
            </View>
          </View>
          <Text style={styles.profileName}>Amine Mansouri</Text>
          <Text style={styles.profileRole}>Explorateur de Savoir</Text>
        </Animated.View>

        {/* Soft Skills Radar Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.radarSection}>
          <View style={styles.radarCard}>
            <MaterialIcons name="architecture" size={60} color={COLORS.primary} style={styles.bgIcon} />
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="psychology" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Majlis des Soft Skills</Text>
            </View>

            <View style={styles.radarVisualization}>
              <Svg viewBox="0 0 100 100" style={styles.radarSvg}>
                <Polygon points="50,5 95,38 78,92 22,92 5,38" fill="none" stroke={COLORS.outlineVariant} strokeWidth="0.5" />
                <Polygon points="50,15 85,41 72,81 28,81 15,41" fill="none" stroke={COLORS.outlineVariant} strokeWidth="0.5" />
                <Polygon points="50,25 75,44 66,70 34,70 25,44" fill="none" stroke={COLORS.outlineVariant} strokeWidth="0.5" />
                
                <Polygon points="50,15 90,40 70,85 40,75 20,45" fill="rgba(44, 78, 62, 0.2)" stroke={COLORS.primary} strokeWidth="2" />
              </Svg>

              <Text style={[styles.radarLabel, { top: -16, left: '50%', transform: [{ translateX: -24 }] }]}>EMPATHIE</Text>
              <Text style={[styles.radarLabel, { top: '25%', right: -24 }]}>LEADERSHIP</Text>
              <Text style={[styles.radarLabel, { bottom: 0, right: -16 }]}>ÉCOUTE</Text>
              <Text style={[styles.radarLabel, { bottom: 0, left: -16 }]}>RÉSOLUE</Text>
              <Text style={[styles.radarLabel, { top: '25%', left: -24 }]}>AGILITÉ</Text>
            </View>
          </View>
        </Animated.View>

        {/* Horizontal Badge Gallery */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.badgesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Coffre aux Bijoux</Text>
            <TouchableOpacity onPress={() => router.push('/resume-competence')}>
              <Text style={styles.seeAllText}>VOIR TOUT</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconBg, { backgroundColor: COLORS.tertiaryFixed }]}>
                <MaterialIcons name="star" size={32} color={COLORS.tertiary} />
              </View>
              <Text style={styles.badgeName}>Mdama d'Or</Text>
            </View>

            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconBg, { backgroundColor: COLORS.primaryFixed }]}>
                <MaterialIcons name="pan-tool" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.badgeName}>Khmissa Zen</Text>
            </View>

            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconBg, { backgroundColor: COLORS.secondaryFixed }]}>
                <MaterialIcons name="auto-awesome" size={32} color={COLORS.secondary} />
              </View>
              <Text style={styles.badgeName}>Perle de Fès</Text>
            </View>

            <View style={[styles.badgeCard, { opacity: 0.4 }]}>
              <View style={[styles.badgeIconBg, { backgroundColor: COLORS.surfaceContainerHigh }]}>
                <MaterialIcons name="lock" size={32} color={COLORS.outline} />
              </View>
              <Text style={styles.badgeName}>Secret d'Atlas</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Family Leaderboard */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.leaderboardSection}>
          <View style={styles.leaderboardCard}>
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="groups" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Cercle Familial</Text>
            </View>

            <View style={styles.leaderboardList}>
              <View style={styles.lbItem}>
                <View style={styles.lbItemLeft}>
                  <Text style={styles.lbRankTertiary}>1</Text>
                  <Image source={require('../assets/images/stitch/uncle_youssef.jpg')} style={[styles.lbAvatar, { borderColor: COLORS.tertiaryFixed }]} />
                  <View>
                    <Text style={styles.lbName}>Oncle Youssef</Text>
                    <Text style={styles.lbRole}>Savant de la Famille</Text>
                  </View>
                </View>
                <Text style={styles.lbScorePrimary}>4850 XP</Text>
              </View>

              <View style={styles.lbItemActive}>
                <View style={styles.lbItemLeft}>
                  <Text style={styles.lbRankActive}>2</Text>
                  <Image source={require('../assets/images/stitch/amine_rank.jpg')} style={[styles.lbAvatar, { borderColor: COLORS.primaryFixedDim }]} />
                  <View>
                    <Text style={styles.lbNameActive}>Moi (Amine)</Text>
                    <Text style={styles.lbRoleActive}>En pleine ascension</Text>
                  </View>
                </View>
                <Text style={styles.lbScoreActive}>4210 XP</Text>
              </View>

              <View style={styles.lbItem}>
                <View style={styles.lbItemLeft}>
                  <Text style={styles.lbRankOutline}>3</Text>
                  <Image source={require('../assets/images/stitch/cousin_amira.jpg')} style={[styles.lbAvatar, { borderColor: COLORS.surfaceContainerHighest }]} />
                  <View>
                    <Text style={styles.lbName}>Cousin Amira</Text>
                    <Text style={styles.lbRole}>Voyageuse Curieuse</Text>
                  </View>
                </View>
                <Text style={styles.lbScorePrimary}>3980 XP</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navContainer}>
        <ZelligeBottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
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
    color: COLORS.primary,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryFixed,
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
    backgroundColor: COLORS.primary, // approximate gradient in CSS
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    right: 0,
    backgroundColor: COLORS.tertiaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  levelBadgeText: {
    color: '#574500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  radarSection: {
    marginBottom: 32,
  },
  radarCard: {
    backgroundColor: COLORS.surfaceContainer,
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
    color: COLORS.primary,
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
    color: COLORS.primary,
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
    color: COLORS.primary,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgesScroll: {
    gap: 16,
  },
  badgeCard: {
    width: 112,
    backgroundColor: COLORS.surfaceContainerLowest,
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
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  leaderboardSection: {
    marginBottom: 16,
  },
  leaderboardCard: {
    backgroundColor: COLORS.surfaceContainerLow,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
  },
  lbItemActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.primary,
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
    color: COLORS.tertiary,
  },
  lbRankActive: {
    width: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryFixed,
  },
  lbRankOutline: {
    width: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.outline,
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
    color: COLORS.onSurface,
  },
  lbNameActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  lbRole: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
  lbRoleActive: {
    fontSize: 10,
    color: COLORS.primaryFixed,
    opacity: 0.8,
  },
  lbScorePrimary: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
  lbScoreActive: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
