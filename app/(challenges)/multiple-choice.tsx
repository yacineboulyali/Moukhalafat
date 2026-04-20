import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeRewardModal } from '../../components/BadgeRewardModal';
import ChallengeProgressBar from '../../components/ChallengeProgressBar';
import MissionTracker from '../../components/MissionTracker';
import { ImmediateFeedback } from '../../components/ImmediateFeedback';
import { ChallengeHeader } from '../../components/ChallengeHeader';
import { ConfettiEffect } from '../../components/ConfettiEffect';
import { MissionSplash } from '../../components/MissionSplash';
import { ChallengeIntroModal } from '../../components/ChallengeIntroModal';
import { useBadges } from '../../hooks/useBadges';
import { useChallenges } from '../../hooks/useChallenges';
import { useMissions } from '../../hooks/useMissions';
import { useQuestions } from '../../hooks/useQuestions';
import { useTheme } from '../../hooks/useTheme';
import { playSound } from '../../utils/SoundManager';
import { useChallengeNavigation } from '../../hooks/useChallengeNavigation';
import { useMissionStore } from '../../stores/missionStore';
import DevQuickNav from '../../components/DevQuickNav';

const { width } = Dimensions.get('window');

export default function V1MultipleChoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { navigateToNext, skipQuestion, goBack, goToIntro, restartMission } = useChallengeNavigation();
  const { initQueue, markComplete, getQueue } = useMissionStore();
  const { missionId, questionIndex = '0', cityId: cityParam } = useLocalSearchParams();
  const cityId = cityParam as string;

  const { missions, loading: loadingMissions } = useMissions(cityId);
  const { questions: dbQuestions, loading: loadingQuestions } = useQuestions(missionId as string);
  
  const questions = dbQuestions || [];

  const currentIdx = parseInt(questionIndex as string) || 0;
  const qData = questions[currentIdx];

  const { awardBadge, showReward, lastAwardedBadge, dismissReward } = useBadges();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showIntro, setShowIntro] = useState(currentIdx === 0 && !!qData?.context_dialogue);
  const [showSplash, setShowSplash] = useState(currentIdx === 0 && !qData?.context_dialogue);

  useEffect(() => {
    if (questions.length > 0 && missionId) {
      initQueue(missionId as string, questions);
    }
  }, [questions, missionId]);

  const handleValidation = () => {
    if (!qData || !selectedId) return;
    const correct = String(selectedId) === String(qData.correct_answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    playSound(correct ? 'correct' : 'wrong');

    // Milestones badges
    const halfWay = Math.floor(questions.length / 2);
    if (correct && currentIdx + 1 === halfWay) {
      awardBadge('explorateur_curieux'); // Award halfway badge
    }

    if (correct && currentIdx + 1 === questions.length) {
      setShowConfetti(true);
      awardBadge('maitre_du_savoir'); // Award completion badge (placeholder id)
    }

    markComplete(missionId as string, currentIdx);

    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        navigateToNext({ missionId: missionId as string, cityId, isMissionComplete: currentIdx + 1 === questions.length });
        setSelectedId(null);
        setIsCorrect(null);
      } else {
        setIsCorrect(null);
      }
    }, 2000);
  };

  if (loadingMissions || loadingQuestions) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!qData) return null;

  const options = Array.isArray(qData.options) ? qData.options : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ChallengeHeader 
        cityId={cityId} 
        onClose={() => goToIntro(cityId)}
      />
      <ChallengeProgressBar progress={currentIdx / questions.length} color={colors.primary} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {!!qData.presentation_fr && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.presentationCard}>
            <MaterialIcons name="person" size={18} color={colors.primary} style={{ marginBottom: 6 }} />
            <Text style={[styles.presentationText, { color: colors.onSurfaceVariant }]}>{qData.presentation_fr}</Text>
          </Animated.View>
        )}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>CHOIX MULTIPLE</Text>
          <Text style={[styles.questionText, { color: colors.primary }]}>{qData.question_fr}</Text>
          {!!qData.question_ar && <Text style={styles.arabicHeader}>{qData.question_ar}</Text>}
        </Animated.View>

        <View style={styles.optionsContainer}>
          {options.map((option: any, index: number) => {
            const optKey = option.value ?? option.id ?? String(index);
            const optLabel = option.label ?? option.label_fr ?? option.text ?? '';
            const isSelected = selectedId === optKey;
            const isCorrectOpt = optKey === qData.correct_answer;
            return (
              <Animated.View key={optKey} entering={FadeInUp.delay(400 + index * 100)}>
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    { backgroundColor: colors.surface, borderColor: isSelected ? colors.primary : 'transparent' },
                    isCorrect !== null && isCorrectOpt && { borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.08)' },
                    isCorrect === false && isSelected && !isCorrectOpt && { borderColor: '#ff5252', backgroundColor: 'rgba(255,82,82,0.08)' }
                  ]}
                  onPress={() => { setSelectedId(optKey); playSound('click'); }}
                  disabled={isCorrect !== null}
                  hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionText, { color: colors.onSurface }]}>{optLabel}</Text>
                  </View>
                  <MaterialIcons 
                    name={isSelected ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={24} 
                    color={isSelected ? colors.primary : colors.border} 
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedId(null); playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }, (!selectedId || isCorrect !== null) && { opacity: 0.5 }]}
            onPress={handleValidation}
            disabled={!selectedId || isCorrect !== null}
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
        title={qData?.title_fr || "Défi d'observation"} 
        subtitle="Choisissez la bonne réponse"
        onFinish={() => setShowSplash(false)} 
      />
      <ChallengeIntroModal
        isVisible={showIntro}
        dialogue={qData?.context_dialogue}
        cityColor={colors.primary}
        onStart={() => setShowIntro(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24, paddingBottom: 40 },
  presentationCard: { backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 16, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#cca72f', alignItems: 'flex-start' },
  presentationText: { fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  header: { marginBottom: 24, alignItems: 'center' },
  instruction: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 10, opacity: 0.6 },
  questionText: { fontSize: 20, fontWeight: '800', textAlign: 'center', lineHeight: 28 },
  arabicHeader: { fontSize: 18, textAlign: 'center', marginTop: 8, color: '#B8860B', fontWeight: '700' },
  optionsContainer: { gap: 14 },
  optionCard: { padding: 18, borderRadius: 18, borderWidth: 2.5, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  optionText: { fontSize: 15, fontWeight: '600', lineHeight: 22, flex: 1 },
  optionTextAr: { fontSize: 14, marginTop: 4, opacity: 0.8 },
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
  },
  validateText: { color: '#fff', fontWeight: '900' },
});
