import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeRewardModal } from '../../components/BadgeRewardModal';
import ChallengeProgressBar from '../../components/ChallengeProgressBar';
import { ImmediateFeedback } from '../../components/ImmediateFeedback';
import { ChallengeHeader } from '../../components/ChallengeHeader';
import { useBadges } from '../../hooks/useBadges';
import { useChallenges } from '../../hooks/useChallenges';
import { useMissions } from '../../hooks/useMissions';
import { useQuestions } from '../../hooks/useQuestions';
import { useTheme } from '../../hooks/useTheme';
import { playSound } from '../../utils/SoundManager';
import { useChallengeNavigation } from '../../hooks/useChallengeNavigation';
import { useMissionStore } from '../../stores/missionStore';
import { ConfettiEffect } from '../../components/ConfettiEffect';
import { MissionSplash } from '../../components/MissionSplash';

const { width } = Dimensions.get('window');

export default function V1PuzzleRiddleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { navigateToNext, skipQuestion, goBack, restartMission } = useChallengeNavigation();
  const { initQueue, markComplete, getQueue } = useMissionStore();
  const { missionId, questionIndex = '0', cityId: cityParam } = useLocalSearchParams();
  const cityId = cityParam as string;

  const { missions, loading: loadingMissions } = useMissions(cityId);
  const { questions: dbQuestions, loading: loadingQuestions } = useQuestions(missionId as string);
  
  const questions = dbQuestions || [];

  const currentIdx = parseInt(questionIndex as string) || 0;
  const qData = questions[currentIdx];

  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(currentIdx === 0);
  const { awardBadge, showReward, lastAwardedBadge, dismissReward } = useBadges();

  const shake = useSharedValue(0);

  useEffect(() => {
    if (questions.length > 0 && missionId) {
      initQueue(missionId as string, questions);
    }
  }, [questions, missionId]);

  const handleValidation = () => {
    if (!qData || !answer.trim()) return;
    const correctVal = qData.correct_answer.toLowerCase().trim();
    const userVal = answer.toLowerCase().trim();
    const correct = userVal === correctVal;

    setIsCorrect(correct);
    setShowFeedback(true);
    playSound(correct ? 'correct' : 'wrong');

    if (!correct) {
      shake.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-10, { duration: 50 }), withTiming(0, { duration: 50 }));
    }

    if (correct && currentIdx + 1 === questions.length) {
      setShowConfetti(true);
      awardBadge('detective_rabati');
    }

    markComplete(missionId as string, currentIdx);

    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        navigateToNext({ missionId: missionId as string, cityId, isMissionComplete: currentIdx + 1 === questions.length });
        setAnswer('');
        setIsCorrect(null);
      } else {
        setIsCorrect(null);
      }
    }, 2500);
  };

  const rInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    borderColor: isCorrect === true ? '#4CAF50' : (isCorrect === false ? '#EF4444' : colors.border)
  }));

  if (loadingMissions || loadingQuestions) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!qData) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ChallengeHeader 
        cityId={cityId} 
        onSkip={() => skipQuestion({ missionId: missionId as string, cityId })} 
        onReset={() => { setAnswer(''); playSound('click'); }}
        onPrevious={goBack}
        onRestart={() => restartMission({ missionId: missionId as string, cityId, firstQuestionType: questions[0].question_type })}
      />
      <ChallengeProgressBar progress={currentIdx / questions.length} color={colors.primary} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>ÉNIGME & MYSTÈRE</Text>
          <View style={styles.riddleBox}>
             <MaterialIcons name="help-outline" size={32} color={colors.gold} style={{ marginBottom: 16 }} />
             <Text style={[styles.riddleText, { color: colors.primary }]}>{qData.question_fr}</Text>
             {!!qData.question_ar && <Text style={styles.riddleTextAr}>{qData.question_ar}</Text>}
          </View>
        </Animated.View>

        <Animated.View style={[styles.inputBox, rInputStyle]}>
          <TextInput
            style={[styles.input, { color: colors.onSurface }]}
            placeholder="Tapez le nom mystère..."
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={answer}
            onChangeText={setAnswer}
            autoCorrect={false}
          />
        </Animated.View>

        {!!qData.hint_fr && (
          <View style={styles.hintContainer}>
            <Text style={[styles.hintLabel, { color: colors.gold }]}>INDICE</Text>
            <Text style={[styles.hintContent, { color: colors.onSurfaceVariant }]}>{qData.hint_fr}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setAnswer(''); playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/pedago' as any, params: { cityId, fromChallenge: 'true' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="info-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.skipIconBtn, { borderColor: colors.primary + '40' }]} 
            onPress={() => skipQuestion({ missionId: missionId as string, cityId })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="fast-forward" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }, !answer.trim() && { opacity: 0.5 }]}
            onPress={handleValidation}
            disabled={!answer.trim() || isCorrect !== null}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="done-all" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ImmediateFeedback isVisible={showFeedback} isCorrect={isCorrect ?? false} />
      {showConfetti && <ConfettiEffect />}
      <BadgeRewardModal badge={lastAwardedBadge} isVisible={showReward} onClose={dismissReward} />
      <MissionSplash 
        isVisible={showSplash} 
        title="Énigme Culturelle" 
        subtitle="Déchiffre les mystères de la ville"
        onFinish={() => setShowSplash(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24 },
  header: { marginBottom: 30, alignItems: 'center' },
  instruction: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  riddleBox: { padding: 24, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  riddleText: { fontSize: 20, fontWeight: '800', textAlign: 'center', lineHeight: 28 },
  riddleTextAr: { fontSize: 18, textAlign: 'center', marginTop: 12, color: '#B8860B', fontWeight: '700' },
  inputBox: { height: 64, borderWidth: 2, borderRadius: 20, marginTop: 30, paddingHorizontal: 20, justifyContent: 'center', backgroundColor: '#fff' },
  input: { fontSize: 18, fontWeight: '700' },
  hintContainer: { marginTop: 30, alignItems: 'center' },
  hintLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
  hintContent: { fontSize: 14, textAlign: 'center', opacity: 0.7, paddingHorizontal: 20 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  footerRow: { flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' },
  sideActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionBtn: {
    paddingHorizontal: 32,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  skipIconBtn: {
    paddingHorizontal: 24,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
