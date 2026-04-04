import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  primaryDark: '#2d6a4f',
  surfaceLowest: '#ffffff',
  surfaceContainerHighest: '#e6e2dc',
  primaryFixed: '#c4ebd6',
  outlineVariant: '#bfc9c1',
  onSurface: '#1c1c18',
  surfaceText: '#1A1A2E',
  onSurfaceVariant: '#404943',
  progressGreen: '#52B788',
};

// Diamond pattern motif (top-right)
function DiamondPattern() {
  return (
    <View style={styles.motif} pointerEvents="none">
      <Svg width={192} height={192} opacity={0.48}>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <Path
              key={`${row}-${col}`}
              d={`M${col * 30 + 15},${row * 30} L${col * 30 + 30},${row * 30 + 15} L${col * 30 + 15},${row * 30 + 30} L${col * 30},${row * 30 + 15} Z`}
              fill="#F4A261"
              fillOpacity={0.08}
            />
          ))
        )}
      </Svg>
    </View>
  );
}

const QUESTIONS = [
  {
    emoji: '📋',
    question: 'En équipe, quel rôle prends-tu naturellement ?',
    questionAr: 'ما الدور الذي تؤديه بشكل طبيعي في العمل الجماعي؟',
    options: [
      { icon: 'clipboard-text', iconColor: '#9333ea', bg: '#f3e8ff', label: 'J\'organise et je planifie' },
      { icon: 'heart', iconColor: '#ec4899', bg: '#fce7f3', label: 'J\'écoute et je soutiens' },
      { icon: 'lightbulb', iconColor: '#f97316', bg: '#ffedd5', label: 'Je propose des idées nouvelles' },
      { icon: 'star', iconColor: '#3b82f6', bg: '#dbeafe', label: 'Je prends les décisions' },
    ],
  },
  {
    emoji: '🎯',
    question: 'Quand tu as un problème à résoudre, tu…',
    questionAr: 'عندما يكون لديك مشكلة تحاول حلها، ماذا تفعل؟',
    options: [
      { icon: 'magnify', iconColor: '#9333ea', bg: '#f3e8ff', label: 'Je cherche des données' },
      { icon: 'account-group', iconColor: '#ec4899', bg: '#fce7f3', label: 'J\'en parle à quelqu\'un' },
      { icon: 'pencil-ruler', iconColor: '#f97316', bg: '#ffedd5', label: 'Je dessine un plan' },
      { icon: 'lightning-bolt', iconColor: '#3b82f6', bg: '#dbeafe', label: 'J\'agis vite' },
    ],
  },
  {
    emoji: '💼',
    question: 'Quelle activité te donne le plus d\'énergie ?',
    questionAr: 'ما النشاط الذي يمنحك أكثر طاقة؟',
    options: [
      { icon: 'presentation', iconColor: '#9333ea', bg: '#f3e8ff', label: 'Présenter mes idées' },
      { icon: 'tools', iconColor: '#ec4899', bg: '#fce7f3', label: 'Fabriquer quelque chose' },
      { icon: 'chat', iconColor: '#f97316', bg: '#ffedd5', label: 'Aider les autres' },
      { icon: 'chart-line', iconColor: '#3b82f6', bg: '#dbeafe', label: 'Analyser des résultats' },
    ],
  },
  {
    emoji: '🧠',
    question: 'Comment tu apprends le mieux ?',
    questionAr: 'كيف تتعلم بشكل أفضل؟',
    options: [
      { icon: 'book-open-variant', iconColor: '#9333ea', bg: '#f3e8ff', label: 'En lisant' },
      { icon: 'video', iconColor: '#ec4899', bg: '#fce7f3', label: 'En regardant' },
      { icon: 'hand-wave', iconColor: '#f97316', bg: '#ffedd5', label: 'En pratiquant' },
      { icon: 'microphone', iconColor: '#3b82f6', bg: '#dbeafe', label: 'En écoutant' },
    ],
  },
  {
    emoji: '🌟',
    question: 'On te dit souvent que tu es…',
    questionAr: 'يُقال لك كثيراً أنك...',
    options: [
      { icon: 'account-tie', iconColor: '#9333ea', bg: '#f3e8ff', label: 'Bien organisé(e)' },
      { icon: 'emoticon-happy', iconColor: '#ec4899', bg: '#fce7f3', label: 'Très empathique' },
      { icon: 'rocket-launch', iconColor: '#f97316', bg: '#ffedd5', label: 'Créatif(ve)' },
      { icon: 'crown', iconColor: '#3b82f6', bg: '#dbeafe', label: 'Naturellement leader' },
    ],
  },
  {
    emoji: '🗺️',
    question: 'Pour réussir une mission, tu as besoin de…',
    questionAr: 'لإنجاز مهمة بنجاح، تحتاج إلى...',
    options: [
      { icon: 'map-marker-check', iconColor: '#9333ea', bg: '#f3e8ff', label: 'Un plan précis' },
      { icon: 'account-check', iconColor: '#ec4899', bg: '#fce7f3', label: 'L\'accord de l\'équipe' },
      { icon: 'domain', iconColor: '#f97316', bg: '#ffedd5', label: 'Une idée originale' },
      { icon: 'trophy', iconColor: '#3b82f6', bg: '#dbeafe', label: 'Un défi motivant' },
    ],
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  const q = QUESTIONS[currentQ];
  const progress = (currentQ + 1) / QUESTIONS.length;

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      router.push('/revelation');
    }
  };

  return (
    <View style={styles.root}>
      <DiamondPattern />

      {/* ── TopAppBar ── */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={C.primaryDark} />
        </TouchableOpacity>
        {/* Step dots: 2 filled, 1 empty */}
        <View style={styles.stepDots}>
          <View style={[styles.dot, { backgroundColor: C.primary }]} />
          <View style={[styles.dot, { backgroundColor: C.primary }]} />
          <View style={[styles.dot, { borderWidth: 2, borderColor: '#a9cfba', backgroundColor: 'transparent' }]} />
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Progress ── */}
        <View style={styles.progressBlock}>
          <Text style={[styles.progressLabel, f('PlusJakartaSans-Bold')]}>
            Question {currentQ + 1} / {QUESTIONS.length}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* ── Question card ── */}
        <View style={styles.card}>
          <Text style={styles.emoji}>{q.emoji}</Text>
          <Text style={[styles.questionText, f('PlusJakartaSans-Bold')]}>{q.question}</Text>
          <Text style={[styles.questionAr, f('BeVietnamPro-Medium')]}>{q.questionAr}</Text>
        </View>

        {/* ── Answer grid ── */}
        <View style={styles.grid}>
          {q.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionBtn,
                selected === idx && styles.optionSelected,
              ]}
              onPress={() => setSelected(idx)}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconWrap, { backgroundColor: opt.bg }]}>
                <MaterialCommunityIcons name={opt.icon as any} size={22} color={opt.iconColor} />
              </View>
              <Text style={[styles.optionText, f('BeVietnamPro-Medium')]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext}>
          <Text style={[styles.skipText, f('BeVietnamPro-Medium')]}>Passer cette question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.9}>
          <Text style={[styles.nextBtnText, f('PlusJakartaSans-Bold')]}>Suivant</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  motif: { position: 'absolute', top: 0, right: 0, zIndex: 0 },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 16,
    backgroundColor: C.bg,
    height: Platform.OS === 'ios' ? 100 : 64,
    zIndex: 10,
  },
  backBtn: { padding: 8, borderRadius: 20 },
  stepDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  spacer: { width: 40 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 8, zIndex: 5 },

  progressBlock: { marginBottom: 32, zIndex: 10 },
  progressLabel: { fontSize: 13, fontWeight: '700', color: C.onSurfaceVariant, marginBottom: 8 },
  progressBarBg: {
    height: 12,
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: C.progressGreen,
    borderRadius: 999,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 4,
    zIndex: 10,
  },
  emoji: { fontSize: 44, marginBottom: 24 },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: C.surfaceText,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  questionAr: {
    fontSize: 15,
    color: C.onSurfaceVariant,
    writingDirection: 'rtl',
    textAlign: 'center',
    lineHeight: 24,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    zIndex: 10,
  },
  optionBtn: {
    width: (width - 64) / 2,
    height: 128,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  optionSelected: {
    borderColor: C.primary,
    backgroundColor: '#c4ebd6',
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.onSurface,
    textAlign: 'center',
    lineHeight: 18,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: 'rgba(253,249,243,0.85)',
    gap: 24,
    alignItems: 'center',
  },
  skipText: { fontSize: 13, color: C.onSurfaceVariant, textDecorationLine: 'underline', fontWeight: '500' },
  nextBtn: {
    width: '100%',
    height: 56,
    backgroundColor: C.primary,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  nextBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
