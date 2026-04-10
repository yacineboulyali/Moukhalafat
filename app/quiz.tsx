import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { THEME } from '../constants/theme';
import { SoundService } from '../services/sounds';

const { width } = Dimensions.get('window');

const QUESTIONS = [
  {
    id: 1,
    text: "Face à une impasse dans un projet, quelle est votre première réaction ?",
    arabic: "عند مواجهة طريق مسدود في مشروع ما، ما هو رد فعلك الأول؟",
    options: [
      { id: 'a', text: "J'analyse les données", icon: 'analytics' },
      { id: 'b', text: "Je demande de l'aide", icon: 'group' },
      { id: 'c', text: "J'essaie une approche créative", icon: 'lightbulb' }
    ]
  }
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    SoundService.getInstance().playSound('click');
  };

  const handleNext = () => {
    if (selectedOption) {
      SoundService.getInstance().playSound('success');
      router.push('/revelation');
    }
  };

  const question = QUESTIONS[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
           <View style={[styles.progressBar, { width: '33%' }]} />
        </View>
        <Text style={styles.headerTitle}>PROFIL PSYCHOLOGIQUE</Text>
      </View>

      <Animated.View 
        entering={FadeInDown.duration(800)}
        style={styles.card}
      >
        <View style={styles.questionHeader}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="psychology" size={32} color={THEME.light.gold} />
          </View>
          <Text style={styles.questionText}>{question.text}</Text>
          <Text style={styles.arabicText}>{question.arabic}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOption
              ]}
              onPress={() => handleSelectOption(option.id)}
            >
              <MaterialIcons 
                name={option.icon as any} 
                size={24} 
                color={selectedOption === option.id ? '#fff' : THEME.light.primary} 
              />
              <Text style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText
              ]}>
                {option.text}
              </Text>
              {selectedOption === option.id && (
                <MaterialIcons name="check-circle" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <TouchableOpacity 
        style={[styles.nextButton, !selectedOption && styles.nextButtonDisabled]}
        disabled={!selectedOption}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>DÉCOUVRIR MON ARCHÉTYPE</Text>
        <MaterialIcons name="auto-awesome" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3ED', // Teinte légèrement crème pour le quiz
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.light.primary,
    borderRadius: 3,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.light.onSurfaceVariant,
    letterSpacing: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.light.primary,
    textAlign: 'center',
    lineHeight: 28,
  },
  arabicText: {
    fontSize: 18,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 78, 62, 0.1)',
    gap: 16,
  },
  selectedOption: {
    backgroundColor: THEME.light.primary,
    borderColor: THEME.light.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: THEME.light.primary,
  },
  selectedOptionText: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: THEME.light.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 40,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#A9B4AC',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
