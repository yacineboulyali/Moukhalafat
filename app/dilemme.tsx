import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_500Medium,
  BeVietnamPro_400Regular,
} from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// ── Design tokens (based on screen 2)
const C = {
  bg: '#FFF8F0', // warm background
  primary: '#2D6A4F',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  errorContainer: '#FEE2E2',
  error: '#EF4444',
  orangeDark: '#C1440E',
  orangeBg: '#FFF7ED',
  brown: '#783D01',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
};

const CHOICES = [
  {
    id: 'A',
    fr: "Je vais chercher Marco et m'excuse au nom de l'équipe",
    ar: 'سأبحث عن ماركو وأعتذر نيابة عن الفريق',
    risk: 'faible', // green
  },
  {
    id: 'B',
    fr: "Je m'occupe d'abord de Yuki pour réparer la relation",
    ar: 'سأهتم بيوكي أولاً لإصلاح العلاقة',
    risk: 'moyen', // yellow
  },
  {
    id: 'C',
    fr: "Je propose de reprendre la réunion à un autre moment",
    ar: 'أقترح استئناف الاجتماع في وقت آخر',
    risk: 'moyen', // yellow
  },
  {
    id: 'D',
    fr: "Je laisse Fatima gérer — ce n'est pas mon rôle de stagiaire",
    ar: 'سأترك فاطمة تتولى الأمر — ليس هذا دوري كمتدرب',
    risk: 'eleve', // red
  },
];

export default function DilemmeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
  });
  
  const [selected, setSelected] = useState<string | null>(null);

  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  // ── Critical dot pulse ──
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(1);
  useEffect(() => {
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      false,
    );
    dotOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, []);
  const dotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotOpacity.value,
  }));

  // ── Confirm button shake ──
  const confirmShake = useSharedValue(0);
  const confirmAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: confirmShake.value }],
  }));
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const handleConfirm = () => {
    if (!selected) {
      confirmShake.value = withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
      return;
    }
    router.replace('/resultat');
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'faible') return C.green;
    if (risk === 'moyen') return C.yellow;
    return C.error;
  };

  return (
    <View style={styles.root}>
      {/* ── HEADER ── */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(350)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, f('PlusJakartaSans-Bold')]}>Décision 2 / 2</Text>
        </View>

        <View style={styles.timer}>
          <MaterialCommunityIcons name="timer-outline" size={16} color={C.error} />
          <Text style={[styles.timerText, f('PlusJakartaSans-Bold')]}>01:20</Text>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Moroccan Zellige Accent (Top Right) */}
        <View style={styles.zelligeWrap} pointerEvents="none">
          <Svg width={120} height={120} viewBox="0 0 60 60" opacity={0.06}>
            <Path d="M30 0l15 15-15 15-15-15L30 0zm0 60l15-15-15-15-15 15 15 15zM0 30l15 15 15-15-15-15L0 30zm60 0l-15 15-15-15 15-15 15 15z" fill={C.primary} />
          </Svg>
        </View>

        {/* ── CONSEQUENCE BANNER ── */}
        <Animated.View style={styles.banner} entering={FadeInLeft.duration(450).delay(100).springify().damping(18)}>
          <Text style={{ fontSize: 20 }}>💬</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerText, f('BeVietnamPro-Medium')]}>
              Votre choix précédent : <Text style={{ fontWeight: 'bold', color: C.orangeDark }}>Vous avez décidé d'intervenir calmement</Text>
            </Text>
          </View>
        </Animated.View>

        {/* ── NEW SITUATION CARD ── */}
        <Animated.View style={styles.situationCard} entering={FadeInDown.duration(450).delay(200).springify().damping(18)}>
          <View style={styles.situationHeader}>
            <View style={styles.avatarRow}>
              <Image source={require('../assets/images/fatima-dilemme.jpg')} style={styles.avatar} />
              <View>
                <Text style={[styles.avatarName, f('PlusJakartaSans-Bold')]}>FATIMA</Text>
                <Text style={styles.avatarRole}>Mentor du Projet</Text>
              </View>
            </View>
            <View style={styles.criticalBadge}>
              <Animated.View style={[styles.criticalDot, dotAnimStyle]} />
              <Text style={[styles.criticalTxt, f('PlusJakartaSans-Bold')]}>SITUATION CRITIQUE</Text>
            </View>
          </View>

          <View style={styles.situationContent}>
            <Text style={[styles.situationFr, f('PlusJakartaSans-SemiBold')]}>
              Marco quitte la salle en colère. Yuki reste mais semble blessée. Fatima vous regarde, attendant une décision rapide.
            </Text>
            <Text style={[styles.situationAr, f('BeVietnamPro-Medium'), { textAlign: 'right' }]}>
              ماركو يغادر الغرفة غاضباً. يوكي لا تزال هنا ولكنها تبدو متأثرة. فاطمة تنظر إليك منتظرة قراراً سريعاً.
            </Text>
          </View>
        </Animated.View>

        {/* ── ANSWERS ── */}
        <View style={styles.choicesWrap}>
          {CHOICES.map((choice, index) => {
            const isSelected = selected === choice.id;
            return (
              <Animated.View
                key={choice.id}
                entering={FadeInRight.duration(400).delay(300 + index * 90).springify().damping(16)}
              >
                <TouchableOpacity
                  style={[
                    styles.choiceBtn,
                    isSelected && styles.choiceBtnSelected,
                  ]}
                  onPress={() => setSelected(choice.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.choiceLetterBg, isSelected && styles.choiceLetterBgSel]}>
                    <Text style={[styles.choiceLetterTxt, isSelected && styles.choiceLetterTxtSel, f('PlusJakartaSans-ExtraBold')]}>
                      {choice.id}
                    </Text>
                  </View>
                  <View style={styles.choiceTextWrap}>
                    <Text style={[styles.choiceFr, f('PlusJakartaSans-SemiBold'), isSelected && { color: C.primary }]}>
                      {choice.fr}
                    </Text>
                    <Text style={[styles.choiceAr, f('BeVietnamPro-Regular'), { textAlign: 'right' }]}>
                      {choice.ar}
                    </Text>
                  </View>
                  <View style={[styles.riskDot, { backgroundColor: getRiskColor(choice.risk) }]} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <Animated.View style={styles.bottomBar} entering={FadeInUp.duration(400).delay(100)}>
        <View style={styles.hintWrap}>
          <MaterialCommunityIcons name="alert" size={14} color={C.error} />
          <Text style={[styles.hintFr, f('BeVietnamPro-Medium')]}>
            Décision finale — il n&apos;y aura pas de retour en arrière
          </Text>
        </View>

        <AnimatedTouchable
          style={[styles.validateBtn, !selected && styles.validateBtnDisabled, confirmAnimStyle]}
          disabled={false}
          onPress={handleConfirm}
        >
          <Text style={[styles.validateTxt, f('PlusJakartaSans-ExtraBold')]}>
            Confirmer ma décision
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
        </AnimatedTouchable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  zelligeWrap: { position: 'absolute', top: -30, right: -40, opacity: 0.6 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16,
    backgroundColor: 'rgba(253,249,243,0.95)', zIndex: 10,
  },
  headerTitle: { fontSize: 18, color: C.primary, letterSpacing: -0.5 },
  timer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.errorContainer,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
  },
  timerText: { fontSize: 14, color: C.error, marginTop: Platform.OS === 'ios' ? 2 : 0, letterSpacing: -0.5 },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 160 },
  
  // Banner
  banner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: C.orangeBg,
    borderLeftWidth: 4, borderLeftColor: C.orangeDark,
    padding: 16, borderRadius: 12, marginBottom: 24,
  },
  bannerText: { fontSize: 14, color: C.brown, lineHeight: 20 },

  // Situation Card
  situationCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12, padding: 20, marginBottom: 24,
    borderLeftWidth: 4, borderLeftColor: '#E76F51',
    shadowColor: '#1c1c18', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04, shadowRadius: 32, elevation: 2,
    gap: 16,
  },
  situationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: C.surfaceContainerLow },
  avatarName: { fontSize: 12, color: C.outline, letterSpacing: 1 },
  avatarRole: { fontSize: 12, color: C.onSurfaceVariant },
  criticalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.errorContainer, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
  },
  criticalDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.error },
  criticalTxt: { fontSize: 10, color: C.error, letterSpacing: 0.5 },
  situationContent: { gap: 8 },
  situationFr: { fontSize: 15, color: C.onSurface, lineHeight: 22 },
  situationAr: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22 },

  // Choices
  choicesWrap: { gap: 12 },
  choiceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: '#E5E7EB',
  },
  choiceBtnSelected: { borderColor: C.primary, backgroundColor: 'rgba(196,235,214,0.1)' },
  choiceLetterBg: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
  },
  choiceLetterBgSel: { backgroundColor: C.primary },
  choiceLetterTxt: { fontSize: 16, color: C.primary },
  choiceLetterTxtSel: { color: '#fff' },
  choiceTextWrap: { flex: 1 },
  choiceFr: { fontSize: 14, color: C.onSurface, marginBottom: 2 },
  choiceAr: { fontSize: 12, color: 'rgba(64,73,67,0.7)' },
  riskDot: { width: 10, height: 10, borderRadius: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },

  // Bottom action
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingTop: 32, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: C.bg,
    alignItems: 'center', gap: 16,
  },
  hintWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintFr: { fontSize: 11, color: C.error, fontStyle: 'italic' },
  validateBtn: {
    width: '100%', maxWidth: 360,
    backgroundColor: C.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    paddingVertical: 16, borderRadius: 40,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  validateBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0, elevation: 0,
  },
  validateTxt: { fontSize: 18, color: '#fff', letterSpacing: -0.5 },
});
