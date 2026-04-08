import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  FadeInUp,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  secondary: '#8e4e14',
  gold: '#cca72f',
  surface: '#fdf9f3',
  white: '#ffffff',
  accent: '#D16B4B',
  emerald: '#10b981',
  onSurfaceVariant: '#404943',
};

const ChallengeMini = ({ city, date, xp, delay }: any) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.miniLevelCard}>
    <View style={styles.miniLevelHeader}>
      <Text style={styles.miniLevelCity}>{city}</Text>
      <Text style={styles.miniLevelDate}>{date}</Text>
    </View>
    <View style={styles.miniLevelStats}>
      <MaterialIcons name="stars" size={14} color={COLORS.gold} />
      <Text style={styles.miniLevelXP}>+{xp} XP</Text>
    </View>
  </Animated.View>
);

export default function CompetenceDetailScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, '#1a3d2e']} style={styles.headerBg}>
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>COMPÉTENCE</Text>
            <TouchableOpacity style={styles.backBtn}>
              <MaterialIcons name="share" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.heroSection}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="comments" size={40} color={COLORS.gold} />
            </View>
            <Text style={styles.mainTitle}>Communication Interculturelle</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>NIVEAU 4 : EXPERT</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.contentScroll} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Analyse du score</Text>
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score Global</Text>
              <Text style={styles.scoreValue}>85/100</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: '85%' }]} />
            </View>
            <Text style={styles.scoreDescription}>
              Vous excellez dans l'adaptation de votre discours selon le contexte culturel marocain. Votre capacité à écouter activement est votre point fort.
            </Text>
          </View>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Historique des défis</Text>
          <ChallengeMini city="Marrakech" date="Hier" xp={450} delay={400} />
          <ChallengeMini city="Chefchaouen" date="3 Avr" xp={320} delay={500} />
          <ChallengeMini city="Rabat" date="28 Mars" xp={500} delay={600} />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Feedback du Stratège</Text>
          <View style={styles.feedbackCard}>
            <View style={styles.expertAvatarMini}>
              <Text style={styles.expertInitial}>K</Text>
            </View>
            <View style={styles.feedbackTextContainer}>
              <Text style={styles.expertName}>Dr. Karim Alaoui</Text>
              <Text style={styles.feedbackText}>
                "Continuez à travailler sur la synthèse constructive lors des conflits d'équipe. C'est la clé pour passer au niveau Maître."
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.actionBtn, { bottom: insets.bottom + 10 }]}>
        <LinearGradient colors={[COLORS.gold, '#a6851f']} style={styles.actionGradient}>
          <Text style={styles.actionBtnText}>BOOSTER CETTE COMPÉTENCE</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  headerBg: { height: 320, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerContent: { flex: 1, paddingHorizontal: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  navTitle: { color: COLORS.white, fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  heroSection: { alignItems: 'center', marginTop: 30 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  mainTitle: { color: COLORS.white, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  levelBadge: { backgroundColor: COLORS.gold, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  levelText: { color: COLORS.white, fontWeight: '900', fontSize: 12 },
  contentScroll: { marginTop: -20 },
  cardSection: { paddingHorizontal: 20, marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 16 },
  scoreCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  scoreLabel: { fontSize: 15, fontWeight: '700', color: COLORS.onSurfaceVariant },
  scoreValue: { fontSize: 18, fontWeight: '900', color: COLORS.primary },
  progressContainer: { height: 10, backgroundColor: '#f0ede9', borderRadius: 5, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: COLORS.emerald, borderRadius: 5 },
  scoreDescription: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 22 },
  miniLevelCard: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.gold },
  miniLevelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  miniLevelCity: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  miniLevelDate: { fontSize: 12, color: COLORS.onSurfaceVariant, opacity: 0.6 },
  miniLevelStats: { flexDirection: 'row', alignItems: 'center' },
  miniLevelXP: { fontSize: 13, fontWeight: '800', color: COLORS.gold, marginLeft: 4 },
  feedbackCard: { backgroundColor: '#f1f8f4', padding: 16, borderRadius: 20, flexDirection: 'row' },
  expertAvatarMini: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  expertInitial: { color: COLORS.white, fontWeight: '900', fontSize: 18 },
  feedbackTextContainer: { flex: 1 },
  expertName: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  feedbackText: { fontSize: 13, color: COLORS.onSurfaceVariant, fontStyle: 'italic', lineHeight: 20 },
  actionBtn: { position: 'absolute', left: 20, right: 20, borderRadius: 20, overflow: 'hidden' },
  actionGradient: { paddingVertical: 20, alignItems: 'center' },
  actionBtnText: { color: COLORS.white, fontWeight: '900', letterSpacing: 1.5 },
});
