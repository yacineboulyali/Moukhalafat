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
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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
  surfaceVariant: '#f1ede7',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  white: '#ffffff',
  accent: '#D16B4B',
};

const PrincipleItem = ({ icon, title, arabicTitle, delay }: { icon: any, title: string, arabicTitle: string, delay: number }) => (
  <Animated.View 
    entering={FadeInRight.delay(delay).duration(600)}
    style={styles.principleCard}
  >
    <View style={styles.principleIconContainer}>
      <MaterialIcons name={icon} size={28} color={COLORS.gold} />
    </View>
    <View style={styles.principleTextContainer}>
      <Text style={styles.principleTitle}>{title}</Text>
      <Text style={styles.principleArabic}>{arabicTitle}</Text>
    </View>
  </Animated.View>
);

export default function PedagoScreen() {
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
        <Animated.View entering={FadeInDown.duration(800)}>
          <View style={styles.imageWrapper}>
            <Image 
              source={require('../assets/images/pedago-marrakech.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageOverlay}
            />
            <TouchableOpacity 
              style={[styles.backButton, { top: insets.top + 10 }]}
              onPress={() => router.back()}
            >
              <BlurView intensity={30} tint="light" style={styles.blurBtn}>
                <Ionicons name="chevron-back" size={24} color={COLORS.white} />
              </BlurView>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.contentPadding}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.expertSection}>
            <View style={styles.expertHeader}>
              <View style={styles.vLine} />
              <View>
                <Text style={styles.expertName}>Dr. Karim Alaoui</Text>
                <Text style={styles.expertTitle}>Expert en communication • OFPPT</Text>
              </View>
            </View>
            
            <View style={styles.quoteCard}>
              <MaterialIcons name="format-quote" size={32} color={COLORS.gold} style={styles.quoteIcon} />
              <Text style={styles.quoteText}>
                "Dans un contexte multiculturel, l'écoute active est la compétence la plus sous-estimée — et la plus puissante."
              </Text>
              <Text style={styles.quoteArabic}>الاستماع النشط هو المهارة الأقوى</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
            <Text style={styles.sectionLabel}>Pourquoi ce choix était optimal?</Text>
            
            <View style={styles.analysisCard}>
              <View style={styles.analysisRow}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.analysisOption}>"J'interviens calmement pour recentrer la discussion"</Text>
              </View>
              <Text style={styles.analysisResult}>
                Cette approche préserve la cohésion d'équipe tout en affirmant votre leadership naturel sans agressivité.
              </Text>

              <View style={[styles.analysisRow, { marginTop: 20 }]}>
                <View style={[styles.statusDot, { backgroundColor: '#FF5252' }]} />
                <Text style={styles.analysisOption}>"J'attends que la situation se calme d'elle-même"</Text>
              </View>
              <Text style={styles.analysisResult}>
                La passivité peut être interprétée comme un désintérêt, laissant le conflit s'enraciner dans l'organisation.
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.section}>
            <Text style={styles.sectionLabel}>3 principes à retenir</Text>
            <PrincipleItem 
              icon="hearing" 
              title="L'écoute active" 
              arabicTitle="الاستماع النشط" 
              delay={700}
            />
            <PrincipleItem 
              icon="security" 
              title="La neutralité bienveillante" 
              arabicTitle="الحياد الإيجابي" 
              delay={850}
            />
            <PrincipleItem 
              icon="auto-graph" 
              title="La synthèse constructive" 
              arabicTitle="التركيب البناء" 
              delay={1000}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1100).duration(800)} style={styles.statsSection}>
            <Text style={styles.sectionLabel}>Dans le monde professionnel</Text>
            <View style={styles.statsCard}>
              <Text style={styles.statsText}>
                Selon les baromètres de l'OFPPT, les compétences comportementales (Soft Skills) comptent pour :
              </Text>
              <View style={styles.chartContainer}>
                <LinearGradient
                  colors={[COLORS.gold, COLORS.accent]}
                  start={{x:0, y:0}} end={{x:1, y:0}}
                  style={[styles.progressBar, { width: '85%' }]}
                />
                <Text style={styles.percentageText}>85% des recruteurs</Text>
              </View>
              <Text style={styles.sourceText}>Source: Observatoire des métiers OFPPT 2024</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <BlurView intensity={80} tint="light" style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => router.push('/coaching')}
        >
          <Text style={styles.continueText}>Continuer le voyage</Text>
          <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </BlurView>
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
  imageWrapper: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  blurBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  contentPadding: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  expertSection: {
    marginBottom: 32,
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vLine: {
    width: 4,
    height: 40,
    backgroundColor: COLORS.gold,
    marginRight: 12,
    borderRadius: 2,
  },
  expertName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  expertTitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    fontWeight: '500',
  },
  quoteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 0.1,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.primary,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
  quoteArabic: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  analysisCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  analysisOption: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
  },
  analysisResult: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
    paddingLeft: 20,
  },
  principleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  principleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  principleTextContainer: {
    flex: 1,
  },
  principleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  principleArabic: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
  },
  statsText: {
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.9,
  },
  chartContainer: {
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: 36,
    borderRadius: 18,
  },
  percentageText: {
    position: 'absolute',
    right: 20,
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },
  sourceText: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.5,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
});
