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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { SoundService } from '../services/sounds';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeInRight,
  ZoomIn,
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
  success: '#4CAF50',
  info: '#2196F3',
};

const AdvisoryItem = ({ text, icon, delay }: { text: string, icon: any, delay: number }) => (
  <Animated.View 
    entering={FadeInRight.delay(delay).duration(600)}
    style={styles.advisoryItem}
  >
    <View style={styles.advisoryIconBg}>
      <MaterialIcons name={icon} size={20} color={COLORS.gold} />
    </View>
    <Text style={styles.advisoryText}>{text}</Text>
  </Animated.View>
);

export default function CoachingHubScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[COLORS.surface, '#f8f4ee']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(800)} style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => {
                SoundService.getInstance().triggerHaptic('light');
                router.back();
              }} 
              style={styles.backBtn}
            >
              <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Coaching Hub</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Animated.View entering={ZoomIn.delay(300)} style={styles.avatarRing}>
                <Image 
                  source={{ uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/family-portrait-v3.png?v=1775991607430' }}
                  style={styles.avatarImg}
                />
              </Animated.View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lvl 12</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Yassine ياسين</Text>
              <Text style={styles.userRole}>Le Stratège en herbe</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* Performance Insight */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.insightCard}>
            <LinearGradient
              colors={['#2c4e3e', '#1a3d2e']}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <MaterialIcons name="insights" size={24} color={COLORS.gold} />
                <Text style={styles.insightLabel}>Performance Globale</Text>
              </View>
              <Text style={styles.insightValue}>التحليل التفصيلي للأداء</Text>
              <View style={styles.insightDivider} />
              <Text style={styles.insightText}>
                Insight : Tes capacités d’analyse surpassent ta communication. 
              </Text>
              <Text style={styles.insightArabic}>بصيرتك تتجاوز مهارات تواصلك حالياً.</Text>
              
              {/* Simple Chart Simulation */}
              <View style={styles.chartRow}>
                <View style={styles.chartItem}>
                  <View style={[styles.chartBar, { height: 80, backgroundColor: COLORS.gold }]} />
                  <Text style={styles.chartLabel}>Analyse</Text>
                </View>
                <View style={styles.chartItem}>
                  <View style={[styles.chartBar, { height: 50, backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                  <Text style={styles.chartLabel}>Communication</Text>
                </View>
                <View style={styles.chartItem}>
                  <View style={[styles.chartBar, { height: 65, backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                  <Text style={styles.chartLabel}>Empathie</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Mentor Advice */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conseils du Mentor</Text>
              <MaterialIcons name="lightbulb" size={20} color={COLORS.gold} />
            </View>
            
            <View style={styles.advisoryList}>
              <AdvisoryItem 
                icon="hearing"
                text="Entraîne-toi à écouter avant d'analyser"
                delay={700}
              />
              <AdvisoryItem 
                icon="autorenew"
                text="Pratique la reformulation active pour valider la compréhension."
                delay={850}
              />
              <AdvisoryItem 
                icon="public"
                text="Expose-toi à des contextes multiculturels lors de tes prochains voyages."
                delay={1000}
              />
            </View>
          </View>

          {/* Next Step / Fès Card */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.nextStepCard}>
            <Image 
              source={{ uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/intro-fes.png?v=1775991607430' }}
              style={styles.nextStepBg}
              blurRadius={2}
            />
            <View style={styles.nextStepOverlay} />
            <View style={styles.nextStepContent}>
              <View style={styles.cityBadge}>
                <Text style={styles.cityText}>FÈS — فاس</Text>
              </View>
              <Text style={styles.nextStepTitle}>La Prochaine Étape</Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>
                  &quot;Le vrai stratège sait s’adapter. Chaque défi est une nouvelle leçon à intégrer à ta vision.&quot;
                </Text>
                <Text style={styles.quoteArabic}>
                  الاستراتيجي الحقيقي يعرف كيف يتكيف. كل تحد هو درس جديد لتدمجه في رؤيتك.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.fesBtn}
                onPress={() => router.push('/map')}
              >
                <Text style={styles.fesBtnText}>Vers la Médina</Text>
                <MaterialIcons name="chevron-right" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(44, 78, 62, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.gold,
    padding: 3,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  levelText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  profileInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
  },
  insightCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  insightGradient: {
    padding: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  insightLabel: {
    color: COLORS.white,
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  insightValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  insightDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  insightText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  insightArabic: {
    color: COLORS.gold,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    fontWeight: '700',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    height: 120,
  },
  chartItem: {
    alignItems: 'center',
    width: '30%',
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  chartLabel: {
    color: COLORS.white,
    fontSize: 9,
    opacity: 0.5,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  advisoryList: {
    gap: 12,
  },
  advisoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  advisoryIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#cca72f15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  advisoryText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onSurface,
    fontWeight: '600',
    lineHeight: 20,
  },
  nextStepCard: {
    height: 320,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 40,
  },
  nextStepBg: {
    width: '100%',
    height: '100%',
  },
  nextStepOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  nextStepContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'space-between',
  },
  cityBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextStepTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  quoteBox: {
    marginTop: 10,
  },
  quoteText: {
    color: COLORS.white,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    opacity: 0.9,
  },
  quoteArabic: {
    color: COLORS.gold,
    fontSize: 14,
    marginTop: 8,
    fontWeight: '700',
    lineHeight: 20,
  },
  fesBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  fesBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  navItem: {
    padding: 10,
  },
  navItemActive: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
