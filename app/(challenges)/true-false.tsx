import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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

export default function V1TrueFalseScreen() {
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

  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(currentIdx === 0);
  const { awardBadge, showReward, lastAwardedBadge, dismissReward } = useBadges();

  useEffect(() => {
    if (questions.length > 0 && missionId) {
      initQueue(missionId as string, questions);
    }
  }, [questions, missionId]);

  const handleValidation = () => {
    if (!qData || !selected) return;
    const correct = selected.toLowerCase() === qData.correct_answer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    playSound(correct ? 'correct' : 'wrong');

    // Milestones badges
    const halfWay = Math.floor(questions.length / 2);
    if (correct && currentIdx + 1 === halfWay) {
      awardBadge('detective_vrai_faux'); // Halfway reward
    }

    if (correct && currentIdx + 1 === questions.length) {
      setShowConfetti(true);
      awardBadge('as_de_la_verite'); // Mission full complete reward id
    }

    markComplete(missionId as string, currentIdx);

    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        navigateToNext({ missionId: missionId as string, cityId, isMissionComplete: currentIdx + 1 === questions.length });
        setSelected(null);
        setIsCorrect(null);
      } else {
        setIsCorrect(null);
      }
    }, 2000);
  };

  if (loadingMissions || loadingQuestions) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!qData) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ChallengeHeader 
        cityId={cityId} 
        onBack={() => router.back()}
      />
      <ChallengeProgressBar progress={currentIdx / questions.length} color={colors.primary} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>VRAI OU FAUX</Text>
          <Text style={[styles.questionText, { color: colors.primary }]}>{qData.question_fr}</Text>
          {!!qData.question_ar && <Text style={styles.arabicHeader}>{qData.question_ar}</Text>}
        </Animated.View>

        <View style={styles.optionsWrapper}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selected === 'vrai' && { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
              isCorrect !== null && 'vrai' === qData.correct_answer.toLowerCase() && { borderColor: '#4CAF50', borderWidth: 3 }
            ]}
            onPress={() => { setSelected('vrai'); playSound('click'); }}
            disabled={isCorrect !== null}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#4CAF50' }]}>
              <MaterialIcons name="check" size={32} color="#fff" />
            </View>
            <Text style={styles.choiceText}>VRAI</Text>
            <Text style={styles.choiceTextAr}>صحيح</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selected === 'faux' && { backgroundColor: '#FFEBEE', borderColor: '#EF5350' },
              isCorrect !== null && 'faux' === qData.correct_answer.toLowerCase() && { borderColor: '#4CAF50', borderWidth: 3 }
            ]}
            onPress={() => { setSelected('faux'); playSound('click'); }}
            disabled={isCorrect !== null}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EF5350' }]}>
              <MaterialIcons name="close" size={32} color="#fff" />
            </View>
            <Text style={styles.choiceText}>FAUX</Text>
            <Text style={styles.choiceTextAr}>خطأ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelected(null); playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }, (selected === null || isCorrect !== null) && { opacity: 0.5 }]}
            onPress={handleValidation}
            disabled={selected === null || isCorrect !== null}
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
        title={qData?.title_fr || "Vrai ou Faux"} 
        subtitle="Démantelez le vrai du faux"
        onFinish={() => setShowSplash(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24 },
  header: { marginBottom: 40, alignItems: 'center' },
  instruction: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  questionText: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  arabicHeader: { fontSize: 22, textAlign: 'center', marginTop: 12, color: '#B8860B', fontWeight: '700' },
  optionsWrapper: { flexDirection: 'row', gap: 20, justifyContent: 'center' },
  choiceBtn: { flex: 1, height: 180, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.01)', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  choiceText: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  choiceTextAr: { fontSize: 16, fontWeight: '700', marginTop: 4, opacity: 0.6 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  footerRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  sideActions: { flexDirection: 'row', gap: 6 },
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
