import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

// Data for Fill Blanks - Adapted for Fès (Scenario "Le Voyage des Compétences")
const BLANKS_DATA = {
  sentence: "La cité de Fès est célèbre pour ses ________ et ses ________ traditionnels.",
  sentenceAr: "تشتهر مدينة فاس بـ ________ و ________ التقليدية.",
  options: [
    { text: "Moussem", textAr: "موسم" },
    { text: "Tanneries", textAr: "الدباغة" },
    { text: "Souks", textAr: "الأسواق" },
    { text: "Cascades", textAr: "شلالات" },
    { text: "Kasbahs", textAr: "قصبات" },
    { text: "Oasis", textAr: "واحات" }
  ],
  correct: ["Tanneries", "Souks"]
};

export default function FillBlanksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [selections, setSelections] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);

  const shake = useSharedValue(0);

  const toggleOption = (optObj: {text: string, textAr: string}) => {
    if (completed) return;
    const opt = optObj.text;
    
    if (selections.includes(opt)) {
      SoundService.getInstance().playSound('click');
      setSelections(selections.filter(s => s !== opt));
    } else {
      if (selections.length < 2) {
        SoundService.getInstance().playSound('click');
        const newSel = [...selections, opt];
        setSelections(newSel);
        if (newSel.length === 2) {
          checkResult(newSel);
        }
      }
    }
  };

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const checkResult = (current: string[]) => {
    const isCorrect = current.every(s => BLANKS_DATA.correct.includes(s)) && current.length === BLANKS_DATA.correct.length;
    
    if (isCorrect) {
      setCompleted(true);
      setError(false);
      SoundService.getInstance().playSound('correct');
      SoundService.getInstance().triggerHaptic('success');
      setTimeout(() => router.push('/(challenges)/puzzle-riddle'), 2000);
    } else {
      setError(true);
      SoundService.getInstance().playSound('wrong');
      SoundService.getInstance().triggerHaptic('error');
      triggerShake();
      setTimeout(() => {
        setSelections([]);
        setError(false);
      }, 1500);
    }
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }]
  }));

  const renderSentence = () => {
    const parts = BLANKS_DATA.sentence.split('________');
    return (
      <View>
        <Text style={[styles.sentence, { color: colors.primary }]}>
          {parts[0]}
          <View style={[styles.blankContainer, selections[0] ? { borderBottomColor: colors.gold } : { borderBottomColor: colors.onSurfaceVariant }]}>
            <Text style={[styles.blankText, { color: colors.gold }]}>{selections[0] || "          "}</Text>
          </View>
          {parts[1]}
          <View style={[styles.blankContainer, selections[1] ? { borderBottomColor: colors.gold } : { borderBottomColor: colors.onSurfaceVariant }]}>
            <Text style={[styles.blankText, { color: colors.gold }]}>{selections[1] || "          "}</Text>
          </View>
          {parts[2]}
        </Text>
        <Text style={[styles.sentenceAr, { color: colors.primary + '80' }]}>{BLANKS_DATA.sentenceAr}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: insets.top }} />
      
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <View style={[styles.tag, { backgroundColor: colors.gold + '20' }]}>
              <Text style={[styles.tagText, { color: colors.gold }]}>DÉFI LINGUISTIQUE</Text>
            </View>
            <Text style={[styles.title, { color: colors.primary }]}>Texte à trous</Text>
            <Text style={[styles.titleAr, { color: colors.primary + '80' }]}>نص بكلمات مفقودة</Text>
            <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>
              Utilisez vos connaissances pour compléter cette description de la ville impériale.
            </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400)} 
          style={[
            styles.sentenceCard, 
            { backgroundColor: colors.surface },
            error && styles.errorCard,
            cardStyle
          ]}
        >
          {renderSentence()}
          {completed && (
            <Animated.View entering={FadeIn} style={styles.successOverlay}>
              <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.successText}>Parfait !</Text>
            </Animated.View>
          )}
        </Animated.View>

        <View style={styles.optionsGrid}>
          {BLANKS_DATA.options.map((opt, idx) => {
            const isSelected = selections.includes(opt.text);
            const isCorrect = completed && BLANKS_DATA.correct.includes(opt.text);
            
            return (
              <Animated.View key={opt.text} entering={FadeInUp.delay(500 + idx * 100)}>
                <TouchableOpacity 
                  style={[
                    styles.optionBtn,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isSelected && { borderColor: colors.gold, backgroundColor: colors.gold + '10' },
                    isCorrect && styles.correctOption,
                    (error && isSelected) && styles.wrongOption
                  ]}
                  onPress={() => toggleOption(opt)}
                  disabled={completed || (error && isSelected)}
                  activeOpacity={0.7}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[
                        styles.optionText, 
                        { color: colors.primary },
                        isSelected && { color: colors.gold },
                        isCorrect && { color: '#fff' }
                      ]}
                    >
                      {opt.text}
                    </Text>
                    <Text style={[
                        styles.optionTextAr, 
                        { color: colors.primary + '70' },
                        isSelected && { color: colors.gold },
                        isCorrect && { color: '#fff' }
                      ]}
                    >
                      {opt.textAr}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  sentenceCard: {
    borderRadius: 32,
    padding: 32,
    marginBottom: 40,
    minHeight: 180,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  errorCard: {
    borderColor: '#EF4444',
  },
  sentence: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 44,
    textAlign: 'center',
  },
  sentenceAr: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    marginTop: 12,
  },
  blankContainer: {
    borderBottomWidth: 2,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 4,
    transform: [{ translateY: 4 }],
  },
  blankText: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '900',
    color: '#4CAF50',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  optionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: width * 0.4,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  optionTextAr: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  }
});

