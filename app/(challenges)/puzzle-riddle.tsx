import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, withSequence, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

const RIDDLE_DATA = {
  question: "Je suis une planète rouge, riche en oxyde de fer. Qui suis-je ?",
  questionAr: "أنا كوكب أحمر، غني بأكسيد الحديد. من أنا؟",
  answer: "MARS",
  hint: "Mon nom est aussi celui d'un dieu de la guerre.",
  hintAr: "اسمي هو أيضا اسم إله الحرب."
};

export default function PuzzleRiddleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
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

  const handleValidate = () => {
    if (!userInput.trim()) return;
    
    const correct = userInput.trim().toUpperCase() === RIDDLE_DATA.answer;
    setIsCorrect(correct);
    
    if (correct) {
      SoundService.getInstance().playSound('correct');
      SoundService.getInstance().triggerHaptic('success');
      setTimeout(() => router.push('/(challenges)/matching-game'), 2000);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ height: insets.top }} />
        <ChallengeTimer duration={120} onTimeUp={() => router.back()} />

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <View style={[styles.tag, { backgroundColor: colors.gold + '15' }]}>
              <Text style={[styles.tagText, { color: colors.gold }]}>ÉNIGME</Text>
            </View>
            <View style={[styles.riddleIcon, { backgroundColor: colors.primary + '10' }]}>
              <MaterialIcons name="psychology" size={40} color={colors.primary} />
            </View>
            <Animated.View style={shakeStyle}>
              <Text style={[styles.title, { color: colors.primary }]}>{RIDDLE_DATA.question}</Text>
              <Text style={[styles.titleAr, { color: colors.primary + '80' }]}>{RIDDLE_DATA.questionAr}</Text>
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.inputSection}>
            <TextInput
              style={[
                styles.input, 
                { color: colors.primary, borderColor: colors.border, backgroundColor: colors.surface },
                isCorrect === true && { borderColor: '#4CAF50', borderWidth: 2 },
                isCorrect === false && { borderColor: '#F44336', borderWidth: 2 }
              ]}
              placeholder="Votre réponse ici..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              value={userInput}
              onChangeText={(text) => {
                setUserInput(text);
                setIsCorrect(null);
              }}
              autoCapitalize="characters"
              editable={isCorrect !== true}
            />
            
            <TouchableOpacity 
              onPress={() => setShowHint(!showHint)}
              style={styles.hintToggle}
            >
              <MaterialIcons name="lightbulb" size={18} color={colors.gold} />
              <Text style={[styles.hintToggleText, { color: colors.gold }]}>Besoin d'un indice ?</Text>
            </TouchableOpacity>

            {showHint && (
              <Animated.View entering={FadeInDown} style={[styles.hintBox, { backgroundColor: colors.gold + '05' }]}>
                <Text style={[styles.hintText, { color: colors.onSurfaceVariant }]}>{RIDDLE_DATA.hint}</Text>
                <Text style={[styles.hintTextAr, { color: colors.onSurfaceVariant + '90' }]}>{RIDDLE_DATA.hintAr}</Text>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.validateBtn, 
                { backgroundColor: colors.primary },
                !userInput.trim() && styles.disabledBtn,
                isCorrect === true && { backgroundColor: '#4CAF50' }
              ]}
              onPress={handleValidate}
              disabled={!userInput.trim() || isCorrect === true}
            >
              <Text style={styles.validateBtnText}>
                {isCorrect === true ? "CORRECT !" : "RÉSOUDRE"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        <ZelligeBottomNav />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  tag: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  tagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  riddleIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 12, lineHeight: 30 },
  titleAr: { fontSize: 20, textAlign: 'center', marginBottom: 12 },
  inputSection: { marginBottom: 40 },
  input: {
    height: 70,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  hintToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  hintToggleText: { fontSize: 13, fontWeight: '700' },
  hintBox: { padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#FFD700' },
  hintText: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' },
  hintTextAr: { fontSize: 13, fontWeight: '600', textAlign: 'right', marginTop: 4 },
  footer: { alignItems: 'center' },
  validateBtn: { width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { opacity: 0.5 },
  validateBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});
