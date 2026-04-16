import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useMissions } from '../hooks/useMissions';
import { useChallenges } from '../hooks/useChallenges';
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
  const params = useLocalSearchParams();
  const cityId = params.cityId as string;
  const targetCity = cityId || 'rabat';

  const { missions, loading: loadingMissions } = useMissions(targetCity);
  const { challenges } = useChallenges();
  const cityData = challenges[targetCity];
  const cityColor = cityData?.city_color ?? COLORS.gold;

  const handleContinue = async () => {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(`pedago_seen_${targetCity}`, 'true');
    } catch (e) {
      console.error('Error saving pedago status', e);
    }

    if (params.fromChallenge === 'true') {
      router.back();
    } else {
      router.push({ pathname: '/intro-defi' as any, params: { city: targetCity } });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[COLORS.surface, '#f8f4ee']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(800)}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: cityData?.illustration_url || 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/pedago-marrakech.png?v=1775991607482' }}
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
              <View style={[styles.vLine, { backgroundColor: cityColor }]} />
              <View>
                <Text style={styles.expertName}>{cityData?.city_name_fr || 'Rabat'} : Objectifs</Text>
                <Text style={styles.expertTitle}>Préparez votre voyage de compétences</Text>
              </View>
            </View>
            
            <View style={styles.quoteCard}>
              <MaterialIcons name="info" size={32} color={cityColor} style={styles.quoteIcon} />
              <Text style={styles.quoteText}>
                {cityData?.description_fr || "Découvrez les secrets de cette ville à travers des missions culturelles et professionnelles."}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: cityColor }]}>{cityData?.missions_title_fr || "Missions à accomplir"}</Text>
            <View style={styles.analysisCard}>
              {loadingMissions ? (
                <ActivityIndicator color={cityColor} />
              ) : missions.length === 0 ? (
                <Text style={styles.emptyText}>Aucune mission disponible pour le moment.</Text>
              ) : (
                missions.map((mission, idx) => (
                  <View key={mission.id} style={[styles.analysisRow, idx > 0 && { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }]}>
                    <View style={[styles.statusDot, { backgroundColor: cityColor }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.analysisOption}>{mission.title_fr}</Text>
                      <Text style={styles.analysisResult}>
                        {mission.description_fr || "Relevez le défi pour maîtriser cette facette du patrimoine."}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: cityColor }]}>Compétences Clés</Text>
            <PrincipleItem 
              icon="hearing" 
              title="Intelligence Culturelle" 
              arabicTitle="الذكاء الثقافي" 
              delay={700}
            />
            <PrincipleItem 
              icon="security" 
              title="Communication Assertive" 
              arabicTitle="التواصل الفعال" 
              delay={850}
            />
          </Animated.View>
        </View>
      </ScrollView>

      <BlurView intensity={80} tint="light" style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) + 110 }]}>
        <TouchableOpacity 
          style={[styles.continueBtn, { backgroundColor: cityColor }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>POURSUIVRE LE DÉFI</Text>
          <MaterialIcons 
            name={params.fromChallenge === 'true' ? 'assignment-return' : 'play-arrow'} 
            size={24} 
            color={COLORS.white} 
          />
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
  emptyText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
