import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import ChallengeTimer from '../../components/ChallengeTimer';

import { playSound } from '../../utils/SoundManager';

const { width } = Dimensions.get('window');

// Data Mockup based on Stitch "Multiple Choice Question"
const QUESTION_DATA = {
  question: "Quel artisanat fait la renommée mondiale de Fès ?",
  questionAr: "ما هي الحرفة التقليدية التي تشتهر بها مدينة فاس عالميا؟",
  options: [
    { id: '1', text: "La Poterie bleue", textAr: "الفخار الأزرق" },
    { id: '2', text: "Le Tannage du cuir", textAr: "دباغة الجلود" },
    { id: '3', text: "Le Tissage de tapis", textAr: "نسج الزرابي" },
    { id: '4', text: "La Ferronnerie d'art", textAr: "الحدادة الفنية" }
  ],
  correctId: '2'
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MultipleChoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (id: string) => {
    if (isCorrect !== null) return;
    setSelectedId(id);
    playSound('click');
  };

  const handleValidation = () => {
    const correct = selectedId === QUESTION_DATA.correctId;
    setIsCorrect(correct);
    playSound(correct ? 'correct' : 'wrong');
    
    if (correct) {
      setTimeout(() => router.push('/(challenges)/true-false'), 1500);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.questionNum}>DÉFI 1 • QUESTION 1</Text>
          <Text style={styles.questionText}>{QUESTION_DATA.question}</Text>
          <Text style={styles.arabicQuestion}>{QUESTION_DATA.questionAr}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {QUESTION_DATA.options.map((option, index) => (
            <Animated.View key={option.id} entering={FadeInUp.delay(400 + index * 100)}>
              <TouchableOpacity 
                style={[
                  styles.optionCard,
                  selectedId === option.id && styles.selectedCard,
                  isCorrect !== null && option.id === QUESTION_DATA.correctId && styles.correctCard,
                  isCorrect === false && selectedId === option.id && option.id !== QUESTION_DATA.correctId && styles.wrongCard
                ]}
                onPress={() => handleSelect(option.id)}
                disabled={isCorrect !== null}
              >
                <View style={styles.optionInfo}>
                   <Text style={[styles.optionText, selectedId === option.id && styles.selectedText]}>{option.text}</Text>
                   <Text style={styles.optionArabic}>{option.textAr}</Text>
                </View>
                {selectedId === option.id && (
                  <MaterialIcons name={isCorrect === null ? "radio-button-checked" : (isCorrect ? "check-circle" : "cancel")} size={24} color={isCorrect === false ? "#ff5252" : THEME.light.primary} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 24 }]}>
        <TouchableOpacity 
          style={[styles.validateBtn, !selectedId && styles.disabledBtn]} 
          onPress={handleValidation}
          disabled={!selectedId || isCorrect !== null}
        >
          <Text style={styles.validateText}>VALIDER LA RÉPONSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
  },
  scroll: {
    padding: 24,
    paddingTop: 10,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  questionNum: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.light.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.light.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  arabicQuestion: {
    fontSize: 20,
    color: THEME.light.gold,
    textAlign: 'center',
    fontWeight: '700',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  selectedCard: {
    borderColor: THEME.light.primary,
    backgroundColor: 'rgba(44,78,62,0.02)',
  },
  correctCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  wrongCard: {
    borderColor: '#ff5252',
    backgroundColor: 'rgba(255, 82, 82, 0.05)',
  },
  optionInfo: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.light.onSurface,
  },
  selectedText: {
    color: THEME.light.primary,
  },
  optionArabic: {
    fontSize: 15,
    color: THEME.light.onSurfaceVariant,
    marginTop: 2,
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  validateBtn: {
    backgroundColor: THEME.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: THEME.light.locked,
    opacity: 0.6,
  },
  validateText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
