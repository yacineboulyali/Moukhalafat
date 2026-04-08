import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import { Image } from 'expo-image';
import Svg, { Polygon, Circle as SVGCircle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  primaryFixed: '#c4ebd6',
  primaryContainer: '#436655',
  secondary: '#8e4e14',
  secondaryContainer: '#ffab69',
  tertiary: '#735c00',
  tertiaryFixed: '#ffe088',
  tertiaryContainer: '#cca72f',
  surface: '#fdf9f3',
  surfaceContainer: '#f1ede7',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  surfaceDim: '#dddad4',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  onPrimary: '#ffffff',
  onTertiary: '#ffffff',
  white: '#ffffff',
};

export default function ResumeCompetenceScreen() {
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
            source={require('../assets/images/stitch/amine_icon_2.jpg')} 
            style={styles.headerAvatar} 
            contentFit="cover" 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
          <View style={styles.avatarMainContainer}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarBorder}>
              <Image 
                source={require('../assets/images/stitch/amine_avatar_2.jpg')} 
                style={styles.mainAvatar} 
                contentFit="cover" 
              />
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={18} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.profileName}>Amine Al-Moussafer</Text>
          <Text style={styles.profileRole}>Voyageur Émérite • Niveau 42</Text>
        </Animated.View>

        {/* Skill Radar: Geometric Rosette */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.rosetteSection}>
          <View style={styles.rosetteCard}>
            <MaterialIcons name="architecture" size={96} color={COLORS.primary} style={styles.rosetteBgIcon} />
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="interests" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Rosette des Compétences</Text>
            </View>

            <View style={styles.rosetteContainer}>
              <View style={styles.rosetteSvgWrapper}>
                {/* Geometric Rosette Pattern */}
                <Svg viewBox="0 0 100 100" style={styles.rosetteBgSvg}>
                  <Path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill="none" stroke={COLORS.primary} strokeWidth="0.5" />
                  <SVGCircle cx="50" cy="50" r="15" fill="none" stroke={COLORS.primary} strokeWidth="0.5" />
                  <SVGCircle cx="50" cy="50" r="30" fill="none" stroke={COLORS.primary} strokeWidth="0.5" />
                  <SVGCircle cx="50" cy="50" r="45" fill="none" stroke={COLORS.primary} strokeWidth="0.5" />
                </Svg>
                
                {/* Data Polygon */}
                <Svg viewBox="0 0 100 100" style={styles.rosetteDataSvg}>
                  <Polygon points="50,15 80,40 70,75 30,75 20,40" fill={COLORS.primaryContainer} fillOpacity="0.4" stroke={COLORS.primary} strokeWidth="2" />
                  <SVGCircle cx="50" cy="15" r="3" fill={COLORS.primary} />
                  <SVGCircle cx="80" cy="40" r="3" fill={COLORS.primary} />
                  <SVGCircle cx="70" cy="75" r="3" fill={COLORS.primary} />
                  <SVGCircle cx="30" cy="75" r="3" fill={COLORS.primary} />
                  <SVGCircle cx="20" cy="40" r="3" fill={COLORS.primary} />
                </Svg>
              </View>

              <Text style={[styles.rosetteLabel, { top: -20, left: '50%', transform: [{ translateX: -20 }], color: COLORS.primary }]}>LANGUE</Text>
              <Text style={[styles.rosetteLabel, { top: '50%', right: -30, transform: [{ translateY: -10 }], color: COLORS.secondary }]}>ART</Text>
              <Text style={[styles.rosetteLabel, { bottom: -20, left: '50%', transform: [{ translateX: -24 }], color: COLORS.tertiary }]}>LOGIQUE</Text>
              <Text style={[styles.rosetteLabel, { top: '50%', left: -40, transform: [{ translateY: -10 }], color: COLORS.primaryContainer }]}>HISTOIRE</Text>
            </View>
          </View>
        </Animated.View>

        {/* Certificates & Badges Grid */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.gridSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Trésors de Savoir</Text>
            <TouchableOpacity onPress={() => router.push('/majlis')}>
              <Text style={styles.seeAllLink}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.badgesGrid}>
            <View style={[styles.badgeItem, { borderBottomColor: COLORS.tertiaryFixed }]}>
              <View style={[styles.badgeIconBgGrid, { backgroundColor: COLORS.tertiaryFixed }]}>
                <MaterialIcons name="workspace-premium" size={32} color={COLORS.tertiary} />
              </View>
              <Text style={styles.badgeNameGrid}>MAÎTRE DES CALLIGRAPHIES</Text>
            </View>

            <View style={[styles.badgeItem, { borderBottomColor: COLORS.primaryFixed }]}>
              <View style={[styles.badgeIconBgGrid, { backgroundColor: COLORS.primaryFixed }]}>
                <MaterialIcons name="stars" size={32} color={COLORS.primaryContainer} />
              </View>
              <Text style={styles.badgeNameGrid}>EXPLORATEUR DU HAUT ATLAS</Text>
            </View>
          </View>
        </Animated.View>

        {/* Majlis Ranking Section */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.podiumSection}>
          <View style={styles.podiumCard}>
            <Text style={styles.podiumTitle}>Le Majlis du Savoir</Text>
            
            <View style={styles.podiumContainer}>
              {/* Rank 2 */}
              <View style={styles.podiumColumn}>
                <View style={styles.podiumAvatarSmall}>
                  <Image source={require('../assets/images/stitch/podium_2.jpg')} style={styles.avatarImage} contentFit="cover" />
                </View>
                <View style={[styles.podiumBlock, { height: 96, backgroundColor: COLORS.primaryContainer }]}>
                  <Text style={styles.podiumRankText}>2</Text>
                </View>
                <View style={[styles.podiumCushion, { backgroundColor: COLORS.secondaryContainer }]} />
              </View>

              {/* Rank 1 */}
              <View style={styles.podiumColumnCenter}>
                <View style={styles.podiumAvatarLarge}>
                  <Image source={require('../assets/images/stitch/podium_1.jpg')} style={styles.avatarImage} contentFit="cover" />
                </View>
                <View style={[styles.podiumBlock, { height: 144, backgroundColor: COLORS.tertiary, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }]}>
                  <FontAwesome5 name="crown" solid size={28} color={COLORS.tertiaryFixed} style={styles.crownIcon} />
                  <Text style={styles.podiumRankTextOne}>1</Text>
                </View>
                <View style={[styles.podiumCushion, { backgroundColor: '#ffab69', height: 24, marginTop: -12 }]} />
              </View>

              {/* Rank 3 */}
              <View style={styles.podiumColumn}>
                <View style={styles.podiumAvatarSmall}>
                  <Image source={require('../assets/images/stitch/podium_3.jpg')} style={styles.avatarImage} contentFit="cover" />
                </View>
                <View style={[styles.podiumBlock, { height: 64, backgroundColor: COLORS.primaryContainer }]}>
                  <Text style={styles.podiumRankText}>3</Text>
                </View>
                <View style={[styles.podiumCushion, { backgroundColor: COLORS.secondaryContainer }]} />
              </View>
            </View>

            <View style={styles.statusBanner}>
              <View style={styles.statusLeft}>
                <Text style={styles.statusText}>Votre rang actuel</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>#1</Text>
                </View>
              </View>
              <MaterialIcons name="trending-up" size={24} color={COLORS.white} />
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
    borderColor: COLORS.primaryContainer,
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
    marginBottom: 48,
  },
  avatarMainContainer: {
    position: 'relative',
    marginBottom: 16,
    width: 128,
    height: 128,
  },
  avatarGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.tertiaryFixed,
    borderRadius: 64,
    opacity: 0.2,
  },
  avatarBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLowest,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: COLORS.tertiary,
    borderRadius: 20,
    padding: 6,
    shadowColor: COLORS.tertiaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.onSurface,
    letterSpacing: -0.5,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  rosetteSection: {
    marginBottom: 32,
  },
  rosetteCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  rosetteBgIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
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
    color: COLORS.onSurface,
  },
  rosetteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
    height: 256,
  },
  rosetteSvgWrapper: {
    width: 256,
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rosetteBgSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  rosetteDataSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  rosetteLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridSection: {
    marginBottom: 48,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  badgesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  badgeItem: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  badgeIconBgGrid: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeNameGrid: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.onSurface,
    textTransform: 'uppercase',
  },
  podiumSection: {
    marginBottom: 16,
  },
  podiumCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 32,
  },
  podiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 32,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 192,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumColumnCenter: {
    flex: 1,
    alignItems: 'center',
    zIndex: 10,
  },
  podiumAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.surfaceDim,
    overflow: 'hidden',
    marginBottom: 8,
  },
  podiumAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: COLORS.tertiaryFixed,
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  podiumRankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    opacity: 0.5,
  },
  podiumRankTextOne: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.onTertiary,
  },
  crownIcon: {
    position: 'absolute',
    top: -16,
  },
  podiumCushion: {
    width: '100%',
    height: 16,
    borderRadius: 8,
    marginTop: -8,
  },
  statusBanner: {
    backgroundColor: 'rgba(241, 237, 231, 0.2)', // surfaceContainer/20
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusBadge: {
    backgroundColor: COLORS.tertiaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.tertiary,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
