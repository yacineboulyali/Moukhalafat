import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn
} from 'react-native-reanimated';
import { playSound } from '../../utils/SoundManager';
import { BadgeRewardModal } from '../../components/BadgeRewardModal';
import ChallengeProgressBar from '../../components/ChallengeProgressBar';
import { ImmediateFeedback } from '../../components/ImmediateFeedback';
import { ChallengeHeader } from '../../components/ChallengeHeader';
import { useBadges } from '../../hooks/useBadges';
import { useChallenges } from '../../hooks/useChallenges';
import { useMissions } from '../../hooks/useMissions';
import { useQuestions } from '../../hooks/useQuestions';
import { useTheme } from '../../hooks/useTheme';
import { useChallengeNavigation } from '../../hooks/useChallengeNavigation';
import { useMissionStore } from '../../stores/missionStore';
import { ConfettiEffect } from '../../components/ConfettiEffect';
import { MissionSplash } from '../../components/MissionSplash';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 70;
const COLUMN_WIDTH = width * 0.38;
const GAP = 20;

interface DraggableCardProps {
  item: any;
  onMatch: (lId: string, rId: string) => void;
  onUnmatch: (lId: string) => void;
  matches: Record<string, string>;
  rightItems: any[];
  colors: any;
  onDragStateChange: (dragging: boolean) => void;
}

const DraggableCard = ({ item, onMatch, onUnmatch, matches, rightItems, colors, onDragStateChange }: DraggableCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isPressed = useSharedValue(false);
  const isMatched = !!matches[item.id];

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      runOnJS(onDragStateChange)(true);
      if (isMatched) {
        runOnJS(onUnmatch)(item.id);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isPressed.value = false;
      runOnJS(onDragStateChange)(false);

      const dropX = event.translationX;
      const dropY = event.translationY + item.initialY;

      let matchedId: string | null = null;
      if (dropX > width * 0.3) {
        rightItems.forEach(r => {
          if (Math.abs(dropY - r.y) < CARD_HEIGHT / 1.5) {
            matchedId = r.id;
          }
        });
      }

      if (matchedId) {
        runOnJS(onMatch)(item.id, matchedId);
        runOnJS(playSound)('match');
        translateX.value = withSpring(width * 0.45);
        translateY.value = withSpring(rightItems.find(r => r.id === matchedId)!.y - item.initialY);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(isPressed.value ? 1.05 : 1) }
    ],
    zIndex: isPressed.value ? 1000 : 1,
    opacity: isMatched ? 0.8 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[
        styles.card,
        rStyle,
        {
          top: item.initialY,
          backgroundColor: isMatched ? colors.primary : colors.surface,
          borderColor: isMatched ? colors.primary : colors.gold + '40',
        }
      ]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardText, { color: isMatched ? '#fff' : colors.primary }]}>{item.text}</Text>
          {!!item.textAr && <Text style={[styles.cardTextAr, { color: isMatched ? '#fff' : colors.onSurfaceVariant }]}>{item.textAr}</Text>}
        </View>
        <MaterialIcons name={isMatched ? "check-circle" : "drag-indicator"} size={20} color={isMatched ? '#fff' : colors.gold} />
      </Animated.View>
    </GestureDetector>
  );
};

export default function V1MatchingScreen() {
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

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(currentIdx === 0);
  const { awardBadge, showReward, lastAwardedBadge, dismissReward } = useBadges();

  useEffect(() => {
    if (questions.length > 0 && missionId) {
      initQueue(missionId as string, questions);
    }
  }, [questions, missionId]);

  const leftItems = useMemo(() => (qData?.options || []).map((o: any, i: number) => ({
    id: `l_${o.id}`,
    text: o.left_fr,
    textAr: o.left_ar,
    pairId: `r_${o.id}`,
    initialY: i * (CARD_HEIGHT + GAP)
  })), [qData]);

  const rightItems = useMemo(() => (qData?.options || []).map((o: any, i: number) => ({
    id: `r_${o.id}`,
    text: o.right_fr,
    textAr: o.right_ar,
    y: i * (CARD_HEIGHT + GAP)
  })).sort(() => Math.random() - 0.5), [qData]);

  const handleMatch = (lId: string, rId: string) => setMatches(prev => ({ ...prev, [lId]: rId }));
  const handleUnmatch = (lId: string) => setMatches(prev => {
    const next = { ...prev };
    delete next[lId];
    return next;
  });

  const handleValidate = () => {
    const correctMatches = leftItems.every((l: any) => matches[l.id] === l.pairId);
    setCompleted(correctMatches);
    setShowFeedback(true);
    playSound(correctMatches ? 'correct' : 'wrong');

    if (correctMatches && currentIdx + 1 === questions.length) {
      setShowConfetti(true);
      awardBadge('maitre_des_liens');
    }

    markComplete(missionId as string, currentIdx);

    setTimeout(() => {
      setShowFeedback(false);
      if (correctMatches) {
        navigateToNext({ missionId: missionId as string, cityId, isMissionComplete: currentIdx + 1 === questions.length });
        setMatches({});
      }
    }, 2500);
  };

  if (loadingMissions || loadingQuestions) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!qData) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <ChallengeHeader 
          cityId={cityId} 
          onBack={() => router.back()}
        />
        <ChallengeProgressBar progress={currentIdx / questions.length} color={colors.primary} />

        <ScrollView scrollEnabled={!isDragging} contentContainerStyle={styles.scroll}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <Text style={[styles.questionText, { color: colors.primary }]}>{qData.question_fr}</Text>
            {!!qData.question_ar && <Text style={styles.arabicHeader}>{qData.question_ar}</Text>}
          </Animated.View>

          <View style={styles.gameContainer}>
            <View style={styles.column}>
              {leftItems.map((item: any) => (
                <DraggableCard
                  key={item.id}
                  item={item}
                  onMatch={handleMatch}
                  onUnmatch={handleUnmatch}
                  matches={matches}
                  rightItems={rightItems}
                  colors={colors}
                  onDragStateChange={setIsDragging}
                />
              ))}
            </View>

            <View style={[styles.column, { alignItems: 'flex-end' }]}>
              {rightItems.map((item: any) => (
                <View key={item.id} style={[styles.targetCard, { top: item.y, borderColor: colors.primary + '30' }]}>
                  <Text style={[styles.targetText, { color: colors.primary }]}>{item.text}</Text>
                  {!!item.textAr && <Text style={styles.targetTextAr}>{item.textAr}</Text>}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 10, backgroundColor: colors.surface }]}>
          <View style={styles.footerRow}>
            <View style={styles.sideActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => { setMatches({}); playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
              style={[styles.primaryActionBtn, { backgroundColor: colors.primary }, Object.keys(matches).length < leftItems.length && { opacity: 0.5 }]}
              onPress={handleValidate}
              disabled={Object.keys(matches).length < leftItems.length || showFeedback}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="done-all" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ImmediateFeedback isVisible={showFeedback} isCorrect={completed} />
        {showConfetti && <ConfettiEffect />}
        <BadgeRewardModal badge={lastAwardedBadge} isVisible={showReward} onClose={dismissReward} />
        <MissionSplash 
          isVisible={showSplash} 
          title={qData?.title_fr || "Défis d'Association"} 
          subtitle="Reliez les éléments entre eux"
          onFinish={() => setShowSplash(false)} 
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24 },
  header: { marginBottom: 30, alignItems: 'center' },
  questionText: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  arabicHeader: { fontSize: 20, textAlign: 'center', marginTop: 8, color: '#B8860B' },
  gameContainer: { flexDirection: 'row', position: 'relative', marginTop: 10 },
  column: { flex: 1, minHeight: 400 },
  card: { position: 'absolute', width: COLUMN_WIDTH, height: CARD_HEIGHT, borderRadius: 16, padding: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', elevation: 4 },
  cardText: { fontSize: 13, fontWeight: '800' },
  cardTextAr: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  targetCard: { position: 'absolute', width: COLUMN_WIDTH, height: CARD_HEIGHT, borderRadius: 16, padding: 10, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' },
  targetText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  targetTextAr: { fontSize: 13, textAlign: 'center', marginTop: 2 },
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
