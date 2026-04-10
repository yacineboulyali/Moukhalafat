import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import { Image } from 'expo-image';
import Svg, { Polygon, Circle as SVGCircle } from 'react-native-svg';
import { CompetencyRadar } from '../components/CompetencyRadar';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  primaryFixed: '#c4ebd6',
  primaryFixedVariant: '#2b4e3e',
  secondary: '#8e4e14',
  tertiary: '#735c00',
  tertiaryContainer: '#cca72f',
  surface: '#fdf9f3',
  surfaceContainer: '#f1ede7',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outlineVariant: '#bfc9c1',
  white: '#ffffff',
};

export default function MajlisSocialHubScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/images/stitch/traveler_zayd.jpg')} 
              style={styles.avatar} 
              contentFit="cover" 
            />
          </View>
          <View>
            <Text style={styles.userName}>Traveler Zayd <Text style={styles.userLevel}>Lv. 12</Text></Text>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={14} color={COLORS.onSurfaceVariant} />
              <Text style={styles.locationText}>Casablanca</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Competency Radar */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <View style={styles.sectionHeaderFlex}>
            <View>
              <Text style={styles.sectionTitle}>Competency Radar</Text>
              <Text style={styles.sectionSubtitle}>Visualisez votre évolution</Text>
            </View>
            <View style={styles.chip}>
              <MaterialIcons name="trending-up" size={12} color={COLORS.primaryFixedVariant} />
              <Text style={styles.chipText}>+5% THIS WEEK</Text>
            </View>
          </View>

          {/* Animated 3-axis radar with draw-in effect */}
          <View style={styles.radarCardWrap}>
            <CompetencyRadar />
          </View>
        </Animated.View>

        {/* Section 2: Certificates */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>SEE ALL</Text>
              <MaterialIcons name="arrow-forward" size={14} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certificatesScroll}>
            <TouchableOpacity onPress={() => router.push('/resume-competence')} style={[styles.certCard, { borderLeftColor: '#3b82f6' }]}>
              <View style={styles.certCardTop}>
                <View style={[styles.certIconBg, { backgroundColor: '#dbeafe' }]}>
                  <MaterialIcons name="handshake" size={24} color="#3b82f6" />
                </View>
                <Text style={styles.certDate}>OCT 12</Text>
              </View>
              <Text style={styles.certTitle}>Mediator of Chefchaouen</Text>
              <View style={styles.certFooter}>
                <View style={[styles.certTag, { backgroundColor: '#dbeafe' }]}>
                  <Text style={[styles.certTagText, { color: '#1e40af' }]}>Negotiation +10</Text>
                </View>
                <Text style={styles.certStatus}>Verified</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.certCard, { borderLeftColor: COLORS.gold }]}>
              <View style={styles.certCardTop}>
                <View style={[styles.certIconBg, { backgroundColor: '#fef3c7' }]}>
                  <MaterialIcons name="menu-book" size={24} color={COLORS.gold} />
                </View>
                <Text style={styles.certDate}>SEP 28</Text>
              </View>
              <Text style={styles.certTitle}>Scholar of Fès</Text>
              <View style={styles.certFooter}>
                <View style={[styles.certTag, { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.certTagText, { color: COLORS.tertiary }]}>Wisdom +15</Text>
                </View>
                <Text style={styles.certStatus}>Honors</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Section 3: Family Rankings */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Family Rankings</Text>
          
          <TouchableOpacity onPress={() => router.push('/profil-classique')} style={styles.rankItem}>
            <Text style={styles.rankNumberTertiary}>1</Text>
            <Image source={require('../assets/images/stitch/cousin_amira.jpg')} style={[styles.rankAvatar, { borderColor: COLORS.tertiary }]} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>Cousin Amira</Text>
              <Text style={styles.rankRoleTertiary}>GRANDMASTER</Text>
            </View>
            <View style={styles.rankScoreBox}>
              <Text style={styles.rankScorePrimary}>2,450</Text>
              <Text style={styles.rankXpLabel}>XP</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rankItem}>
            <Text style={styles.rankNumberVariant}>2</Text>
            <Image source={require('../assets/images/stitch/uncle_youssef.jpg')} style={[styles.rankAvatar, { borderColor: COLORS.outlineVariant }]} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>Uncle Youssef</Text>
              <Text style={styles.rankRoleVariant}>MENTOR</Text>
            </View>
            <View style={styles.rankScoreBox}>
              <Text style={styles.rankScorePrimary}>2,100</Text>
              <Text style={styles.rankXpLabel}>XP</Text>
            </View>
          </View>
          
          <View style={styles.spacerDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.rankItemYou}>
            <Text style={styles.rankNumberYou}>15</Text>
            <Image source={require('../assets/images/stitch/you_avatar.jpg')} style={[styles.rankAvatar, { borderColor: COLORS.primaryFixed }]} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankNameYou}>You</Text>
              <Text style={styles.rankRoleYou}>EXPLORER</Text>
            </View>
            <View style={styles.rankScoreBox}>
              <Text style={styles.rankScoreYou}>850</Text>
              <Text style={styles.rankXpLabelYou}>XP</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton}>
            <MaterialIcons name="person-add" size={20} color={COLORS.white} />
            <Text style={styles.ctaText}>Invite Friends to Majlis</Text>
          </TouchableOpacity>
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
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 0,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 2,
    borderColor: COLORS.primaryFixed,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  userLevel: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.7,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.7,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.onSurface,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 40,
  },
  section: {
    gap: 16,
  },
  sectionHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
  },
  chip: {
    backgroundColor: COLORS.primaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipText: {
    color: COLORS.primaryFixedVariant,
    fontSize: 10,
    fontWeight: 'bold',
  },
  radarCardWrap: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(191, 201, 193, 0.15)',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  certificatesScroll: {
    gap: 16,
  },
  certCard: {
    width: 256,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
  },
  certCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  certIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certDate: {
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.4,
    color: COLORS.onSurface,
  },
  certTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.onSurface,
  },
  certFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
  },
  certTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  certStatus: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.5,
    fontStyle: 'italic',
    color: COLORS.onSurface,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
  },
  rankItemYou: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
  },
  rankNumberTertiary: {
    width: 32,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.tertiary,
  },
  rankNumberVariant: {
    width: 32,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.onSurfaceVariant,
  },
  rankNumberYou: {
    width: 32,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryFixed,
  },
  rankAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  rankNameYou: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rankRoleTertiary: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rankRoleVariant: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rankRoleYou: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.primaryFixed,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rankScoreBox: {
    alignItems: 'flex-end',
  },
  rankScorePrimary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  rankScoreYou: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rankXpLabel: {
    fontSize: 10,
    opacity: 0.5,
    color: COLORS.onSurface,
  },
  rankXpLabelYou: {
    fontSize: 10,
    opacity: 0.7,
    color: COLORS.white,
  },
  spacerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
  },
  ctaContainer: {
    marginTop: 8,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
