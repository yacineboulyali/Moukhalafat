import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { SoundService } from '../../services/sounds';
import { useChallengeNavigation } from '../../hooks/useChallengeNavigation';
import { ImmediateFeedback } from '../../components/ImmediateFeedback';
import { useMissionStore } from '../../stores/missionStore';
import { ChallengeHeader } from '../../components/ChallengeHeader';
import { useQuestions } from '../../hooks/useQuestions';

const { width } = Dimensions.get('window');

const SCENARIO_DATA = {
  narrator: "Capitaine Amine",
  dialogue: "Félicitations aventurier ! Tu as surmonté les épreuves de l'espace. Nous approchons maintenant de notre destination finale. Quelle est ta première action à l'atterrissage ?",
  dialogueAr: "تهانينا أيها المغامر! لقد تغلبت على اختبارات الفضاء. نحن الآن نقترب من وجهتنا النهائية. ما هو إجراءك الأول عند الهبوط؟",
  choices: [
    { id: '1', text: "Sécuriser le périmètre du vaisseau", textAr: "تأمين محيط السفينة" },
    { id: '2', text: "Déployer les panneaux solaires", textAr: "نشر الألواح الشمسية" },
    { id: '3', text: "Établir un signal de communication", textAr: "إرسال إشارة اتصال" }
  ]
};

export default function ScenarioDialogueScreen() {
  const { navigateToNext, skipQuestion, goBack, restartMission } = useChallengeNavigation();
  const { initQueue, markComplete, getQueue } = useMissionStore();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const missionId = params.missionId as string;
  const cityId = params.cityId as string;
  const questionIndex = params.questionIndex || '0';

  const { questions: dbQuestions, loading: loadingQuestions } = useQuestions(missionId);
  const questions = dbQuestions || [];
  
  const qData = questions[parseInt(questionIndex as string)];
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [runtimeError, setRuntimeError] = useState<any>(null);

  React.useEffect(() => {
    try {
      if (questions && questions.length > 0 && missionId) {
        initQueue(missionId, questions);
      }
    } catch (err) {
      console.error("Queue initialization error:", err);
      setRuntimeError(err);
    }
  }, [questions, missionId, initQueue]);

  // Transform DB options to dialogue data
  const dialogueLines = Array.isArray(qData?.options) ? qData.options : [];
  const firstLine = dialogueLines[0] || { speaker: 'Personnage', text: qData?.question_fr || '...' };

  const handleSelect = (id: string) => {
    setSelectedChoice(id);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('light');
  };

  const onConfirmResult = () => {
    try {
      if (!selectedChoice) return;
      setShowFeedback(true);
      SoundService.getInstance().triggerHaptic('medium');
      
      markComplete(missionId, parseInt(questionIndex as string));
      
      setTimeout(() => {
        setShowFeedback(false);
        const queue = getQueue(missionId);

        if (queue.length > 0) {
          navigateToNext({ missionId, cityId });
        } else {
          navigateToNext({ missionId, cityId, isMissionComplete: true });
        }
      }, 2000);
    } catch (err) {
      console.error("Confirmation error:", err);
      setRuntimeError(err);
    }
  };

  if (loadingQuestions) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.primary, fontWeight: '600' }}>Chargement du dialogue...</Text>
      </View>
    );
  }

  if (runtimeError || !qData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text style={{ fontSize: 20, fontWeight: '900', color: colors.primary, marginTop: 24, textAlign: 'center' }}>
          Oups ! Une erreur est survenue
        </Text>
        <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 12, textAlign: 'center', lineHeight: 20 }}>
          Nous ne pouvons pas charger ce défi pour le moment.
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 32, backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 }}
          onPress={() => skipQuestion({ missionId, cityId })}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>Passer au défi suivant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ChallengeHeader 
        cityId={params.cityId as string} 
        onBack={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { borderColor: colors.gold }]}>
             <MaterialIcons name="account-circle" size={100} color={colors.primary} />
          </View>
          <View style={[styles.nameTag, { backgroundColor: colors.gold }]}>
            <Text style={styles.nameText}>{firstLine.speaker}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bubbleText, { color: colors.primary }]}>{firstLine.text}</Text>
          {!!firstLine.text_ar && <Text style={[styles.bubbleTextAr, { color: colors.primary + '80' }]}>{firstLine.text_ar}</Text>}
          <View style={[styles.bubbleTail, { borderTopColor: colors.surface }]} />
        </Animated.View>

        <View style={styles.choicesContainer}>
          {dialogueLines.slice(1).map((choice: any, idx: number) => (
            <Animated.View key={choice.id || idx} entering={FadeInUp.delay(600 + idx * 100)}>
              <TouchableOpacity
                onPress={() => handleSelect(choice.id)}
                style={[
                  styles.choiceCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedChoice === choice.id && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + '05' }
                ]}
              >
                <View style={styles.choiceInfo}>
                  <Text style={[styles.choiceText, { color: colors.primary }]}>{choice.text}</Text>
                  {!!choice.text_ar && <Text style={[styles.choiceTextAr, { color: colors.onSurfaceVariant }]}>{choice.text_ar}</Text>}
                </View>
                <MaterialIcons 
                  name={selectedChoice === choice.id ? "radio-button-checked" : "radio-button-unchecked"} 
                  size={24} 
                  color={selectedChoice === choice.id ? colors.primary : colors.border} 
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 24) + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedChoice(null); SoundService.getInstance().playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/pedago' as any, params: { cityId, fromChallenge: 'true' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="info-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.skipButton, { borderColor: colors.primary + '40' }]}
            onPress={() => skipQuestion({ missionId, cityId })}
          >
            <Text style={[styles.skipButtonText, { color: colors.primary }]}>IGNORER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.validateButton, 
              { backgroundColor: colors.primary }, 
              !selectedChoice && { backgroundColor: '#ccc', opacity: 0.6 }
            ]}
            onPress={onConfirmResult}
            disabled={!selectedChoice || showFeedback}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.validateButtonText}>VALIDER</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImmediateFeedback 
        isVisible={showFeedback} 
        isCorrect={true} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  nameTag: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 15, marginTop: -20, elevation: 4 },
  nameText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  bubble: { padding: 24, borderRadius: 32, borderWidth: 1, marginBottom: 40, position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  bubbleText: { fontSize: 16, fontWeight: '700', lineHeight: 24, textAlign: 'center', marginBottom: 12 },
  bubbleTextAr: { fontSize: 18, textAlign: 'center', lineHeight: 28 },
  bubbleTail: { position: 'absolute', bottom: -15, alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 15, borderLeftColor: 'transparent', borderRightWidth: 15, borderRightColor: 'transparent', borderTopWidth: 15 },
  choicesContainer: { gap: 12 },
  choiceCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1.5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
  choiceInfo: { flex: 1 },
  choiceText: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  choiceTextAr: { fontSize: 13, fontWeight: '600' },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
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
  validateButton: { flex: 1.8, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  skipButton: { flex: 1, height: 60, borderRadius: 30, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  skipButtonText: { fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  validateButtonText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
