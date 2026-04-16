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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { AVATARS } from '../constants/Avatars';
import ThemeToggle from '../components/ThemeToggle';


const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#1A3D2E', // Vert Zellige profond
  secondary: '#8e4e14',
  tertiary: '#CCA72F', // Or brillant
  surface: '#141D17',  // Mode Sombre
  onSurface: '#E6E2DC',
  onSurfaceVariant: '#A9B4AC',
  outlineVariant: '#344037',
  primaryFixed: '#c4ebd6',
  secondaryFixed: '#ffdcc4',
  tertiaryFixed: '#ffe088',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onPrimary: '#ffffff',
  gold: '#cca72f',
};

interface SkillRingProps {
  progress: number;
  icon: any;
  color: string;
  label: string;
  level: number;
  arabicLabel: string;
}

const SkillRing = ({ progress, icon, color, label, level, arabicLabel }: SkillRingProps) => {
  const radius = 16;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.skillCard}>
      <View style={styles.ringContainer}>
        <Svg height="64" width="64" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="#e6e2dc"
            strokeWidth="3"
            fill="none"
          />
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 18 18)"
          />
        </Svg>
        <View style={styles.iconOverlay}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
      </View>
      <View style={styles.skillTextContainer}>
        <Text style={styles.skillLabel}>{label}</Text>
        <Text style={styles.skillArabic}>{arabicLabel}</Text>
      </View>
      <View style={[styles.levelBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.levelText, { color: color }]}>Niv. {level}</Text>
      </View>
    </View>
  );
};

export default function ProfilScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [userStats, setUserStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { dbService } = require('../services/database');
        const stats = await dbService.getUserStats();
        setUserStats(stats);
      } catch (err) {
        console.error("Failed to load user stats from SQLite:", err);
      }
    };
    fetchData();
  }, []);

  const xpProgress = userStats ? (userStats.xp % 1000) / 1000 : 0.725;
  const xpCurrent = userStats ? userStats.xp % 1000 : 1450;
  const level = userStats ? userStats.level : 4;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      {/* Background based on theme if needed, or simple background */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => router.back()}
          >
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Al-Musafer Profile</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => router.push('/settings')}
            >
              <MaterialIcons name="settings" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Profil de Voyageur</Text>
          <Text style={[styles.sectionArabic, { color: colors.gold }]}>ملف المسافر</Text>
        </View>

        {/* User Info Card */}
        <View 
          style={[styles.profileCard, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.avatarGlow, { backgroundColor: colors.primaryLight, opacity: 0.1 }]} />
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[colors.primary, colors.gold]}
                style={styles.avatarRing}
              >
                <Image
                  source={AVATARS.explorer}
                  style={styles.avatar}
                />
              </LinearGradient>
              <View style={[styles.avatarLevelBadge, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                <Text style={[styles.avatarLevelText, { color: colors.onSurface }]}>Niv. {level}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={[styles.userName, { color: colors.onSurface }]}>{userStats?.username || 'Yassine'}</Text>
              <Text style={[styles.userBio, { color: colors.onSurfaceVariant }]}>{"L'Explorateur des Savoirs"}</Text>
            </View>
          </View>
        </View>

        {/* XP Section */}
        <View style={[styles.xpSection, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.xpHeader}>
            <View>
              <Text style={[styles.xpLabel, { color: colors.primary }]}>PROGRESSION XP</Text>
              <Text style={[styles.xpValue, { color: colors.onSurface }]}>⭐ {userStats?.xp || 1450} / {(level) * 1000} XP</Text>
            </View>
            <Text style={[styles.xpNextLevel, { color: colors.gold }]}>Prochain Niveau: {level + 1}</Text>
          </View>
          <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
            <LinearGradient
              colors={[colors.primary, colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${xpProgress * 100}%` }]}
            />
          </View>
        </View>

        {/* Skills Grid */}
        <View style={styles.skillsSection}>
          <View style={styles.skillsHeader}>
            <Text style={[styles.skillsTitle, { color: colors.primary }]}>
              Compétences <Text style={[styles.skillsArabicInline, { color: colors.gold }]}>المهارات</Text>
            </Text>
            <TouchableOpacity onPress={() => router.push('/badges')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Voir les Badges</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.skillsGrid}>
            <SkillRing
              progress={75}
              icon="forum"
              color={colors.primary}
              label="Communication"
              arabicLabel="التواصل"
              level={2}
            />
            <SkillRing
              progress={40}
              icon="alt-route"
              color={colors.secondaryContainer || colors.gold}
              label="Décision"
              arabicLabel="القرار"
              level={1}
            />
            <SkillRing
              progress={85}
              icon="groups"
              color={colors.gold}
              label={"Travail d'équipe"}
              arabicLabel="العمل الجماعي"
              level={3}
            />
            <SkillRing
              progress={20}
              icon="psychology-alt"
              color={colors.accent || '#EF4444'}
              label="Gestion Stress"
              arabicLabel="إدارة الضغط"
              level={1}
            />
          </View>
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
    backgroundColor: '#fdf9f3',
    zIndex: 50,
  },
  headerContent: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  headerBtn: {
    padding: 8,
    borderRadius: 99,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionArabic: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    backgroundColor: COLORS.primaryFixed,
    borderRadius: 60,
    opacity: 0.2,
  },
  profileContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarLevelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.tertiaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarLevelText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  userBio: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
  },
  xpSection: {
    backgroundColor: '#f7f3ed',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    opacity: 0.7,
    letterSpacing: 1,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginTop: 2,
  },
  xpNextLevel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.tertiary,
  },
  progressBarContainer: {
    height: 16,
    backgroundColor: '#e6e2dc',
    borderRadius: 8,
    padding: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  skillsArabicInline: {
    fontSize: 14,
    color: COLORS.tertiary,
    marginLeft: 8,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1ede7',
  },
  ringContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillTextContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  skillArabic: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(191, 201, 193, 0.1)',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a8a29e',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  viewPortfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 167, 47, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(204, 167, 47, 0.2)',
  },
  viewPortfolioTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#cca72f',
    marginRight: 6,
    letterSpacing: 0.5,
  },
});
