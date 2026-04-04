import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_400Regular,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_500Medium,
  BeVietnamPro_400Regular,
} from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// ── Design tokens (based on screen 1)
const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  surfaceContainer: '#f1ede7',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#ebe8e2',
  secondary: '#8e4e14',
  secondaryContainer: '#ffab69',
  onSecondaryContainer: '#783d01',
  tertiaryFixed: '#ffe088',
  onTertiaryFixed: '#241a00',
};

const CHOICES = [
  {
    id: 'A',
    fr: "J'interviens calmement pour recentrer la discussion",
    ar: 'أتدخل بهدوء لإعادة توجيه النقاش',
  },
  {
    id: 'B',
    fr: "J'attends que la situation se calme d'elle-même",
    ar: 'أنتظر حتى يهدأ الوضع من تلقاء نفسه',
  },
  {
    id: 'C',
    fr: "Je demande une pause et consulte Fatima en privé",
    ar: 'أطلب استراحة وأستشير فاطمة على انفراد',
  },
];

export default function ChoixScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
  });
  
  const [selected, setSelected] = useState<string | null>(null);

  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  // ── Validate button shake when no choice selected ──
  const validateShake = useSharedValue(0);
  const validateAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: validateShake.value }],
  }));
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const handleValidate = () => {
    if (!selected) {
      validateShake.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
      return;
    }
    router.push('/dilemme');
  };

  return (
    <View style={styles.root}>
      {/* ── HEADER ── */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(350)}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color={C.primary} />
        </TouchableOpacity>

        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: C.secondary }]} />
          <View style={[styles.dot, { backgroundColor: C.secondary }]} />
          <View style={[styles.dot, { backgroundColor: C.secondary }]} />
          <View style={[styles.dot, { backgroundColor: C.outlineVariant }]} />
        </View>

        <View style={styles.timer}>
          <MaterialCommunityIcons name="timer-outline" size={16} color={C.primary} />
          <Text style={[styles.timerText, f('PlusJakartaSans-Bold')]}>01:45</Text>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Moroccan Zellige Accent (Top Right) */}
        <View style={styles.zelligeWrap} pointerEvents="none">
          <Svg width={120} height={120} viewBox="0 0 60 60" opacity={0.06}>
            <Path d="M30 0l15 15-15 15-15-15L30 0zm0 60l15-15-15-15-15 15 15 15zM0 30l15 15 15-15-15-15L0 30zm60 0l-15 15-15-15 15-15 15 15z" fill={C.primary} />
          </Svg>
        </View>

        {/* ── SITUATION RECAP CARD ── */}
        <Animated.View style={styles.recapCard} entering={FadeInDown.duration(450).delay(100).springify().damping(18)}>
          <View style={styles.recapRow}>
            <View style={styles.avatarWrap}>
              <Image source={require('../assets/images/fatima-choix.jpg')} style={styles.avatar} />
              <View style={styles.chatBadge}>
                <MaterialCommunityIcons name="chat" size={12} color={C.onTertiaryFixed} />
              </View>
            </View>

            <View style={styles.recapTextWrap}>
              <Text style={[styles.recapTitle, f('PlusJakartaSans-SemiBold')]}>
                Fatima vous demande de réagir
              </Text>
              <Text style={[styles.recapSubtitle, f('BeVietnamPro-Regular')]}>
                مراكش — Bureau Atlas International
              </Text>
            </View>
          </View>

          <View style={styles.warningBadge}>
            <MaterialCommunityIcons name="alert" size={14} color={C.onSecondaryContainer} />
            <Text style={[styles.warningText, f('PlusJakartaSans-Bold')]}>SITUATION TENDUE</Text>
          </View>
        </Animated.View>

        {/* ── CHOICES ── */}
        <View style={styles.choicesWrap}>
          {CHOICES.map((choice, index) => {
            const isSelected = selected === choice.id;
            return (
              <Animated.View
                key={choice.id}
                entering={FadeInDown.duration(400).delay(200 + index * 100).springify().damping(16)}
              >
                <TouchableOpacity
                  style={[
                    styles.choiceBtn,
                    isSelected && styles.choiceBtnSelected,
                  ]}
                  onPress={() => setSelected(choice.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.choiceRow}>
                    <View style={[styles.choiceLetterBg, isSelected && styles.choiceLetterBgSel]}>
                      <Text style={[styles.choiceLetterTxt, isSelected && styles.choiceLetterTxtSel, f('PlusJakartaSans-Bold')]}>
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
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <Animated.View style={styles.bottomBar} entering={FadeInUp.duration(400).delay(100)}>
        <View style={styles.hintWrap}>
          <Text style={[styles.hintFr, f('BeVietnamPro-Medium')]}>
            🤔 Réfléchis bien — cette décision aura des conséquences
          </Text>
          <Text style={[styles.hintAr, f('BeVietnamPro-Regular'), { textAlign: 'center' }]}>
            فكر جيداً — سيكون لهذا القرار عواقب
          </Text>
        </View>

        <AnimatedTouchable
          style={[styles.validateBtn, !selected && styles.validateBtnDisabled, validateAnimStyle]}
          disabled={false}
          onPress={handleValidate}
        >
          <Text style={[styles.validateTxt, f('PlusJakartaSans-Bold')]}>
            Valider mon choix
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </AnimatedTouchable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  zelligeWrap: { position: 'absolute', top: -20, right: -20, opacity: 0.8 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16,
    backgroundColor: 'rgba(253,249,243,0.9)', zIndex: 10,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  timer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.surfaceContainerHigh,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
  },
  timerText: { fontSize: 12, color: C.primary, marginTop: Platform.OS === 'ios' ? 2 : 0 },
  
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 140 },
  
  recapCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16, padding: 16, marginBottom: 32,
    borderLeftWidth: 4, borderLeftColor: C.secondary,
    shadowColor: '#1c1c18', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04, shadowRadius: 24, elevation: 3,
  },
  recapRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: C.surfaceContainer },
  chatBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: C.tertiaryFixed,
    alignItems: 'center', justifyContent: 'center',
  },
  recapTextWrap: { flex: 1 },
  recapTitle: { fontSize: 14, color: C.onSurface, lineHeight: 20 },
  recapSubtitle: { fontSize: 12, color: C.outline, marginTop: 2 },
  warningBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,171,105,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    alignSelf: 'flex-start', marginTop: 12,
  },
  warningText: { fontSize: 10, color: C.onSecondaryContainer },

  choicesWrap: { gap: 16 },
  choiceBtn: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(191,201,193,0.3)',
  },
  choiceBtnSelected: { borderColor: C.primary, backgroundColor: '#f2f8f4' },
  choiceRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  choiceLetterBg: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  choiceLetterBgSel: { backgroundColor: C.primary },
  choiceLetterTxt: { fontSize: 16, color: C.primary },
  choiceLetterTxtSel: { color: '#fff' },
  choiceTextWrap: { flex: 1, gap: 4 },
  choiceFr: { fontSize: 15, color: C.onSurface, lineHeight: 22 },
  choiceAr: { fontSize: 13, color: C.outline },
  
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(253,249,243,0.95)',
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center', gap: 16,
  },
  hintWrap: { alignItems: 'center' },
  hintFr: { fontSize: 13, color: C.onSurfaceVariant, fontStyle: 'italic' },
  hintAr: { fontSize: 12, color: C.outline, marginTop: 2 },
  validateBtn: {
    width: '100%', maxWidth: 320,
    backgroundColor: C.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    paddingVertical: 16, borderRadius: 16,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  validateBtnDisabled: {
    backgroundColor: C.surfaceContainerHigh,
    shadowOpacity: 0, elevation: 0,
  },
  validateTxt: { fontSize: 16, color: '#fff' },
});
