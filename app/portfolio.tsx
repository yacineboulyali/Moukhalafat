import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInRight,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  secondary: '#8e4e14',
  gold: '#cca72f',
  surface: '#fdf9f3',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  white: '#ffffff',
  accent: '#D16B4B',
  emerald: '#10b981',
};

const BadgeItem = ({ icon, label, color, delay }: { icon: string, label: string, color: string, delay: number }) => (
  <Animated.View 
    entering={FadeInDown.delay(delay).duration(600)}
    style={styles.badgeCard}
  >
    <View style={[styles.badgeIconBg, { backgroundColor: color + '15' }]}>
      <FontAwesome5 name={icon} size={24} color={color} />
    </View>
    <Text style={styles.badgeLabel}>{label}</Text>
  </Animated.View>
);

const SkillBar = ({ label, progress, color, delay }: { label: string, progress: number, color: string, delay: number }) => (
  <Animated.View 
    entering={FadeInRight.delay(delay).duration(600)}
    style={styles.skillBarRow}
  >
    <View style={styles.skillBarHeader}>
      <Text style={styles.skillBarLabel}>{label}</Text>
      <Text style={styles.skillBarPercent}>{progress}%</Text>
    </View>
    <View style={styles.skillBarBg}>
      <View style={[styles.skillBarFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  </Animated.View>
);

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <Image 
            source={require('../assets/images/profil-complet.png')}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(44,78,62,0.9)', COLORS.primary]}
            style={styles.headerOverlay}
          />
          
          <TouchableOpacity 
            style={[styles.backBtn, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Animated.Text entering={FadeInDown.delay(200)} style={styles.userName}>Yassine Ben Ali</Animated.Text>
            <Animated.Text entering={FadeInDown.delay(300)} style={styles.userTitle}>Explorateur du Patrimoine & Entrepreneur</Animated.Text>
            <Animated.View entering={FadeInDown.delay(400)} style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>1450</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>Villes</Text>
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* Section: Bio */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Ma Vision | رؤيتي</Text>
            <Text style={styles.bioText}>
              Passionné par la richesse culturelle du Maroc, je parcours le pays pour allier traditions ancestrales et innovations modernes. Mon portfolio témoigne de ma maîtrise des compétences interculturelles et entrepreneuriales acquises entre Tanger et Dakhla.
            </Text>
          </Animated.View>

          {/* Section: Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio des Compétences</Text>
            <SkillBar label="Communication Interculturelle" progress={85} color={COLORS.emerald} delay={600} />
            <SkillBar label="Négociation Commerciale" progress={72} color={COLORS.gold} delay={700} />
            <SkillBar label="Gestion de Projet Durable" progress={64} color={COLORS.primary} delay={800} />
            <SkillBar label="Leadership & Équipe" progress={90} color={COLORS.accent} delay={900} />
          </View>

          {/* Section: Badges */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Succès & Badges</Text>
              <TouchableOpacity onPress={() => router.push('/badges' as any)}>
                <Text style={styles.seeAllBtn}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.badgesGrid}>
              <BadgeItem icon="handshake" label="Négociateur" color="#D16B4B" delay={1000} />
              <BadgeItem icon="lightbulb" label="Innovateur" color="#cca72f" delay={1100} />
              <BadgeItem icon="shield-alt" label="Gardien" color="#2c4e3e" delay={1200} />
              <BadgeItem icon="leaf" label="Éco-Leader" color="#10b981" delay={1300} />
            </View>
          </View>

          {/* Action Button */}
          <Animated.View entering={FadeInDown.delay(1400)}>
            <TouchableOpacity style={styles.shareBtn}>
              <LinearGradient
                colors={[COLORS.gold, '#a6851f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shareGradient}
              >
                <MaterialIcons name="share" size={20} color={COLORS.white} />
                <Text style={styles.shareTxt}>PARTAGER MON PORTFOLIO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  headerSection: {
    height: 480,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  headerTextContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 24,
  },
  userName: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
    fontFamily: 'Plus Jakarta Sans',
  },
  userTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  contentPadding: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 12,
  },
  seeAllBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.onSurfaceVariant,
    opacity: 0.9,
  },
  skillBarRow: {
    marginBottom: 16,
  },
  skillBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  skillBarLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  skillBarPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  skillBarBg: {
    height: 8,
    backgroundColor: '#e6e2dc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: (width - 64) / 4,
    alignItems: 'center',
  },
  badgeIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  shareBtn: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  shareTxt: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    marginLeft: 10,
  },
});
