import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    title: "Une Mission de Famille",
    arabic: "مهمة عائلية",
    description: "Accompagne la famille Ben Ali dans un voyage à travers le Maroc pour relever des défis professionnels réels.",
    image: require('../assets/images/family-portrait-v3.png'),
    color: '#1A3D2E'
  },
  {
    title: "Apprentissage Ludique",
    arabic: "تعلم ممتع",
    description: "Développe tes Soft Skills et Hard Skills en résolvant des scénarios complexes et des mini-jeux captivants.",
    image: require('../assets/images/character-guide.jpg'),
    color: '#D4AF37'
  },
  {
    title: "Trace ton Chemin",
    arabic: "ارسم مسارك",
    description: "Chaque décision compte. Tes choix influencent ta progression et tes badges de compétences.",
    image: require('../assets/images/map-morocco.jpg'),
    color: '#ffab69'
  }
];

export default function WelcomeScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const COLORS = THEME.light;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/(auth)/register');
    }
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        key={currentStep}
        entering={FadeInRight.duration(500)}
        exiting={FadeOutLeft.duration(500)}
        style={StyleSheet.absoluteFillObject}
      >
        <Image 
          source={step.image} 
          style={styles.backgroundImage} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['transparent', 'rgba(13, 20, 16, 0.95)']}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.textBlock}
        >
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepArabicText}>{step.arabic}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {ONBOARDING_STEPS.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  { backgroundColor: i === currentStep ? COLORS.gold : 'rgba(255,255,255,0.3)' },
                  i === currentStep && { width: 24 }
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? "COMMENCER" : "SUIVANT"}
            </Text>
            <MaterialIcons 
              name={currentStep === ONBOARDING_STEPS.length - 1 ? "celebration" : "arrow-forward"} 
              size={24} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height * 0.7,
    position: 'absolute',
    top: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  textBlock: {
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  stepArabicText: {
    fontSize: 28,
    color: THEME.light.gold,
    fontWeight: '700',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: THEME.light.primary,
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: THEME.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
