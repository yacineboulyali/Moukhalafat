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
import { ConfettiEffect } from '../../components/ConfettiEffect';
import { MissionSplash } from '../../components/MissionSplash';
import { useBadges } from '../../hooks/useBadges';
import { useChallenges } from '../../hooks/useChallenges';
import { useMissions } from '../../hooks/useMissions';
import { useQuestions } from '../../hooks/useQuestions';
import { useTheme } from '../../hooks/useTheme';
import { playSound } from '../../utils/SoundManager';
import { useChallengeNavigation } from '../../hooks/useChallengeNavigation';
import { useMissionStore } from '../../stores/missionStore';

const { width } = Dimensions.get('window');

export default function ErrorDetectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { navigateToNext, skipQuestion, goBack, restartMission } = useChallengeNavigation();
  const { initQueue, markComplete, getQueue } = useMissionStore();
  const { missionId, questionIndex = '0', cityId: cityParam } = useLocalSearchParams();
  const cityId = cityParam as string;

  const { missions, loading: loadingMissions } = useMissions(cityId);
  const { questions: dbQuestions, loading: loadingQuestions } = useQuestions(missionId as string);
  
  const questions = dbQuestions || [];

  const currentIdx = parseInt(questionIndex as string) || 0;
  const qData = questions[currentIdx];

  const { awardBadge, showReward, lastAwardedBadge, dismissReward } = useBadges();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(currentIdx === 0);

  useEffect(() => {
    if (questions.length > 0 && missionId) {
      initQueue(missionId as string, questions);
    }
  }, [questions, missionId]);

  const handleValidation = () => {
    if (!qData || !selectedWord) return;
    
    // In error detection, the selectedWord is the one identified as error
    // We compare it with the identified error in qData (usually qData.options[0] or similar)
    const errorIdentified = Array.isArray(qData.options) ? qData.options[0] : qData.options;
    const correct = selectedWord === errorIdentified;

    setIsCorrect(correct);
    setShowFeedback(true);
    playSound(correct ? 'correct' : 'wrong');

    if (correct && currentIdx + 1 === questions.length) {
      setShowConfetti(true);
      awardBadge('detective_culturel');
    }

    markComplete(missionId as string, currentIdx);

    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        navigateToNext({ missionId: missionId as string, cityId, isMissionComplete: currentIdx + 1 === questions.length });
        setSelectedWord(null);
        setIsCorrect(null);
      } else {
        setIsCorrect(null);
      }
    }, 2500);
  };

  const handleSkip = () => skipQuestion({ missionId: missionId as string, cityId });
  const handleCancel = () => {
    setSelectedWord(null);
    playSound('click');
  };

  if (loadingMissions || loadingQuestions) {
    return <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" /></View>;
  }

  if (!qData) return null;

  // Split sentence into interactive words
  const wordsFr = qData.question_fr.split(' ');
  const wordsAr = qData.question_ar ? qData.question_ar.split(' ') : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ChallengeHeader 
        cityId={cityId} 
        onBack={() => router.back()}
      />
      <ChallengeProgressBar
        progress={currentIdx / questions.length}
        label={`Question ${currentIdx + 1} / ${questions.length}`}
        color={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>DÉTECTION D'ERREUR</Text>
          <Text style={[styles.desc, { color: colors.onSurfaceVariant }]}>Appuyez sur le mot qui contient une erreur.</Text>
        </Animated.View>

        <View style={styles.sentenceBox}>
          <View style={styles.wordsRow}>
            {wordsFr.map((word: string, idx: number) => (
              <TouchableOpacity
                key={`fr-${idx}`}
                onPress={() => { setSelectedWord(word.replace(/[.,'']/g, '')); playSound('click'); }}
                style={[
                  styles.wordChip,
                  selectedWord === word.replace(/[.,'']/g, '') && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
              >
                <Text style={[styles.wordText, selectedWord === word.replace(/[.,'']/g, '') && { color: '#fff' }]}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {wordsAr.length > 0 && (
            <View style={[styles.wordsRow, { marginTop: 20 }]}>
              {wordsAr.map((word: string, idx: number) => (
                <TouchableOpacity
                  key={`ar-${idx}`}
                  onPress={() => { setSelectedWord(word); playSound('click'); }}
                  style={[
                    styles.wordChip,
                    selectedWord === word && { backgroundColor: colors.gold, borderColor: colors.gold }
                  ]}
                >
                  <Text style={[styles.wordTextAr, selectedWord === word && { color: '#fff' }]}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedWord && isCorrect === false && (
          <Animated.View entering={FadeInUp} style={styles.explanationBox}>
            <MaterialIcons name="info" size={24} color="#EF4444" />
            <Text style={styles.explanationText}>Ce n'est pas l'erreur. Réessayez !</Text>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 24) + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedWord(null); playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/pedago' as any, params: { cityId, fromChallenge: 'true' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="info-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.skipIconBtn, { borderColor: colors.primary + '40' }]} 
            onPress={handleSkip}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="fast-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }, (!selectedWord || isCorrect !== null) && { opacity: 0.5 }]}
            onPress={handleValidation}
            disabled={!selectedWord || isCorrect !== null}
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
        subtitle="Repérez l'erreur dans le texte"
        onFinish={() => setShowSplash(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  header: { marginBottom: 24, alignItems: 'center' },
  instruction: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  desc: { fontSize: 14, textAlign: 'center', opacity: 0.8 },
  sentenceBox: { padding: 30, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  wordChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  wordText: { fontSize: 18, fontWeight: '600' },
  wordTextAr: { fontSize: 20, fontWeight: '700' },
  explanationBox: { flexDirection: 'row', alignItems: 'center', marginTop: 24, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12 },
  explanationText: { marginLeft: 12, color: '#991B1B', fontWeight: '600' },
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
