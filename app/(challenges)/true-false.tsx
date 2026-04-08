import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, withSequence, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

const TRUE_FALSE_DATA = {
  question: "La muraille de Chine est visible depuis la Lune à l'œil nu.",
  questionAr: "سور الصين العظيم مرئي من القمر بالعين المجردة.",
  explanation: "C'est un mythe courant. Le mur est trop étroit pour être vu depuis la lune, bien qu'il puisse parfois être vu depuis l'orbite terrestre basse.",
  correctAnswer: false
};

export default function TrueFalseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const shake = useSharedValue(0);

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleSelect = (answer: boolean) => {
    if (isConfirmed) return;
    setSelectedAnswer(answer);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('light');
  };

  const handleValidate = () => {
    if (selectedAnswer === null || isConfirmed) return;
    
    const correct = selectedAnswer === TRUE_FALSE_DATA.correctAnswer;
    setIsConfirmed(true);
    
    if (correct) {
      SoundService.getInstance().playSound('correct');
      SoundService.getInstance().triggerHaptic('success');
      setTimeout(() => router.push('/(challenges)/puzzle-riddle'), 2500);
    } else {
      SoundService.getInstance().playSound('wrong');
      SoundService.getInstance().triggerHaptic('error');
      triggerShake();
    }
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }]
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: insets.top }} />
      <ChallengeTimer duration={60} onTimeUp={() => router.back()} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={[styles.tag, { backgroundColor: colors.gold + '15' }]}>
            <Text style={[styles.tagText, { color: colors.gold }]}>VRAI OU FAUX</Text>
          </View>
          <Animated.View style={shakeStyle}>
            <Text style={[styles.title, { color: colors.primary }]}>{TRUE_FALSE_DATA.question}</Text>
            <Text style={[styles.titleAr, { color: colors.primary + '80' }]}>{TRUE_FALSE_DATA.questionAr}</Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.optionsGrid}>
          {[true, false].map((val, idx) => (
            <Animated.View key={val.toString()} entering={FadeInUp.delay(400 + idx * 100)} style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => handleSelect(val)}
                disabled={isConfirmed}
                style={[
                  styles.optionCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedAnswer === val && { borderColor: colors.primary, borderWidth: 3 },
                  isConfirmed && val === TRUE_FALSE_DATA.correctAnswer && styles.correctCard,
                  isConfirmed && selectedAnswer === val && val !== TRUE_FALSE_DATA.correctAnswer && styles.wrongCard
                ]}
              >
                <MaterialIcons 
                  name={val ? "check-circle" : "cancel"} 
                  size={48} 
                  color={selectedAnswer === val ? colors.primary : colors.onSurfaceVariant + '40'} 
                />
                <Text style={[styles.optionLabel, { color: colors.primary }]}>{val ? "VRAI" : "FAUX"}</Text>
                <Text style={[styles.optionLabelAr, { color: colors.primary + '70' }]}>{val ? "صحيح" : "خطأ"}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {isConfirmed && (
          <Animated.View entering={FadeInUp} style={[styles.explanationBox, { backgroundColor: colors.gold + '10' }]}>
            <View style={styles.explanationHeader}>
              <MaterialIcons name="info" size={20} color={colors.gold} />
              <Text style={[styles.explanationTitle, { color: colors.gold }]}>LE SAVIEZ-VOUS ?</Text>
            </View>
            <Text style={[styles.explanationText, { color: colors.onSurface }]}>{TRUE_FALSE_DATA.explanation}</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          {!isConfirmed ? (
            <TouchableOpacity 
              style={[styles.validateBtn, { backgroundColor: colors.primary }, selectedAnswer === null && styles.disabledBtn]}
              onPress={handleValidate}
              disabled={selectedAnswer === null}
            >
              <Text style={styles.validateBtnText}>VALIDER</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.nextInfo}>
              <Text style={[styles.nextText, { color: colors.onSurfaceVariant }]}>Chargement du prochain défi...</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  tag: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  tagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 12, lineHeight: 30 },
  titleAr: { fontSize: 20, textAlign: 'center', marginBottom: 12 },
  optionsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  optionCard: {
    height: 180,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  correctCard: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9', borderWidth: 3 },
  wrongCard: { borderColor: '#F44336', backgroundColor: '#FFEBEE', borderWidth: 3 },
  optionLabel: { fontSize: 16, fontWeight: '900', marginTop: 12 },
  optionLabelAr: { fontSize: 14, fontWeight: '700' },
  explanationBox: { padding: 20, borderRadius: 24, marginBottom: 32 },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  explanationTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  explanationText: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
  footer: { alignItems: 'center' },
  validateBtn: { width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { opacity: 0.5 },
  validateBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  nextInfo: { alignItems: 'center' },
  nextText: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' }
});
