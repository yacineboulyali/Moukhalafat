import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  FadeInDown,
  FadeInUp,
  FadeIn,
  type SharedValue,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_500Medium,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_500Medium, BeVietnamPro_400Regular } from '@expo-google-fonts/be-vietnam-pro';
import Svg, { Path } from 'react-native-svg';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg: '#FFF8F0',
  primary: '#2c4e3e',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  primaryFixed: '#c4ebd6',
  surfaceContainerHigh: '#ebe8e2',
  surfaceContainerHighest: '#e6e2dc',
  onPrimaryFixedVariant: '#2b4e3e',
  lightGreen: '#52B788',
  error: '#EF4444',
  errorContainer: '#FEE2E2',
};

// ── Game data ─────────────────────────────────────────────────────────────
const ITEMS_INITIAL = [
  { id: 'step-3', fr: '🤝 Proposer une reformulation commune des points d\'accord', ar: 'اقتراح صياغة مشتركة لنقاط الاتفاق', correctPos: 2 },
  { id: 'step-1', fr: '🛑 Interrompre poliment la conversation pour recadrer', ar: 'مقاطعة المحادثة بأدب لإعادة توجيهها', correctPos: 0 },
  { id: 'step-2', fr: '💬 Écouter activement toutes les parties en présence', ar: 'الاستماع بفعالية لجميع الأطراف الحاضرة', correctPos: 1 },
  { id: 'step-4', fr: '✅ Résumer les décisions prises et confirmer les rôles', ar: 'تلخيص القرارات المتخذة وتأكيد الأدوار', correctPos: 3 },
];

// ── Drag constants ────────────────────────────────────────────────────────
const ITEM_H = 84;
const GAP = 12;
const ROW = ITEM_H + GAP;

/** Worklet: compute where the dragged item would land */
function getTargetIdx(fromIdx: number, dy: number, total: number): number {
  'worklet';
  return Math.max(0, Math.min(total - 1, Math.round(fromIdx + dy / ROW)));
}

// ── DraggableItem ─────────────────────────────────────────────────────────
type Item = (typeof ITEMS_INITIAL)[number];

type DraggableItemProps = {
  item: Item;
  index: number;
  total: number;
  activeIdx: SharedValue<number>;
  dragY: SharedValue<number>;
  onDrop: (from: number, to: number) => void;
  f: (n: string) => object;
};

function DraggableItem({ item, index, total, activeIdx, dragY, onDrop, f }: DraggableItemProps) {
  // Keep a shared value mirror of `index` so worklets always read the latest
  const indexSV = useSharedValue(index);
  useEffect(() => {
    indexSV.value = index;
  }, [index]);

  const selfOffset = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const zIndexValue = useSharedValue(1);

  // ── Shift siblings while another item is being dragged ──
  useAnimatedReaction(
    () => {
      const ai = activeIdx.value;
      const i = indexSV.value;
      if (ai === -1 || ai === i) return 0;
      const target = getTargetIdx(ai, dragY.value, total);
      if (ai < i && i <= target) return -ROW;  // shift up
      if (target <= i && i < ai) return ROW;   // shift down
      return 0;
    },
    (offset, prev) => {
      if (offset !== prev) {
        selfOffset.value = withSpring(offset, { damping: 20, stiffness: 220 });
      }
    },
  );

  // ── Scale up when this item becomes active ──
  useAnimatedReaction(
    () => activeIdx.value === indexSV.value,
    (isActive, wasActive) => {
      if (isActive !== wasActive) {
        scaleValue.value = withSpring(isActive ? 1.05 : 1, { damping: 12, stiffness: 180 });
        zIndexValue.value = isActive ? 100 : 1;
      }
    },
  );

  // ── Pan gesture ──
  const pan = Gesture.Pan()
    .minDistance(6)
    .onBegin(() => {
      activeIdx.value = indexSV.value;
      dragY.value = 0;
    })
    .onChange((e) => {
      dragY.value = e.translationY;
    })
    .onEnd(() => {
      const from = activeIdx.value;
      const to = getTargetIdx(from, dragY.value, total);
      // Reset drag state
      activeIdx.value = -1;
      dragY.value = 0;
      selfOffset.value = withSpring(0, { damping: 20, stiffness: 220 });
      if (from !== to) {
        runOnJS(onDrop)(from, to);
      }
    })
    .onFinalize(() => {
      // Safety: ensure cleanup if gesture is cancelled
      if (activeIdx.value === indexSV.value) {
        activeIdx.value = -1;
        dragY.value = 0;
      }
    });

  const animStyle = useAnimatedStyle(() => {
    const isActive = activeIdx.value === indexSV.value;
    return {
      transform: [
        { translateY: isActive ? dragY.value : selfOffset.value },
        { scale: scaleValue.value },
      ],
      zIndex: zIndexValue.value,
      shadowOpacity: withTiming(isActive ? 0.2 : 0.05, { duration: 180 }),
      elevation: withTiming(isActive ? 12 : 2, { duration: 180 }),
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.itemCard, animStyle]}
        entering={FadeInDown.delay(150 + index * 80).duration(400).springify().damping(16)}
      >
        {/* Position number */}
        <View style={styles.itemNumber}>
          <Text style={[styles.itemNumberTxt, f('PlusJakartaSans-Bold')]}>
            {index + 1}
          </Text>
        </View>

        {/* Text content */}
        <View style={styles.itemTextWrap}>
          <Text style={[styles.itemFr, f('PlusJakartaSans-Medium')]} numberOfLines={2}>
            {item.fr}
          </Text>
          <Text style={[styles.itemAr, f('BeVietnamPro-Regular')]} numberOfLines={1}>
            {item.ar}
          </Text>
        </View>

        {/* Drag handle */}
        <View style={styles.dragHandle}>
          <MaterialCommunityIcons name="drag-vertical" size={22} color={C.outlineVariant} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────
export default function MiniJeuScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
  });

  const [items, setItems] = useState(ITEMS_INITIAL);
  const [errorVisible, setErrorVisible] = useState(false);

  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  // ── Shared drag state (passed down to each DraggableItem) ──
  const activeIdx = useSharedValue(-1);
  const dragY = useSharedValue(0);

  // ── CTA button shake on wrong answer ──
  const ctaShake = useSharedValue(0);
  const ctaAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ctaShake.value }],
  }));
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  // ── Commit a drag-and-drop reorder ──
  const commitMove = useCallback((from: number, to: number) => {
    setItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const isOrderCorrect = () => items.every((item, idx) => item.correctPos === idx);

  const handleVerify = () => {
    if (isOrderCorrect()) {
      router.push('/dialogue');
    } else {
      setErrorVisible(true);
      ctaShake.value = withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
      setTimeout(() => setErrorVisible(false), 2000);
    }
  };

  const correct = isOrderCorrect();

  return (
    <View style={styles.root}>
      {/* Zellige accent */}
      <View style={styles.zelligeWrap} pointerEvents="none">
        <Svg width={150} height={150} viewBox="0 0 60 60" opacity={0.06}>
          <Path
            d="M30 0l15 15-15 15-15-15L30 0zm0 60l15-15-15-15-15 15 15 15zM0 30l15 15 15-15-15-15L0 30zm60 0l-15 15-15-15 15-15 15 15z"
            fill="#f4a261"
          />
        </Svg>
      </View>

      {/* ── App Bar ── */}
      <Animated.View style={styles.appBar} entering={FadeIn.duration(350)}>
        <View style={styles.appBarStep}>
          <Text style={[styles.appBarStepTxt, f('PlusJakartaSans-Bold')]}>Étape 3 / 4</Text>
        </View>
        <View style={styles.appBarCenter}>
          <Text style={[styles.appBarTitle, f('PlusJakartaSans-Bold')]}>Mini-jeu 🎮</Text>
          <Text style={[styles.appBarSub, f('PlusJakartaSans-Medium')]}>لعبة صغيرة</Text>
        </View>
        <View style={styles.appBarTimer}>
          <MaterialCommunityIcons name="timer" size={16} color={C.primary} />
          <Text style={[styles.appBarTimerTxt, f('PlusJakartaSans-Bold')]}>02:00</Text>
        </View>
      </Animated.View>

      {/* ── Instruction Card ── */}
      <Animated.View
        style={styles.instrCard}
        entering={FadeInDown.duration(450).delay(50).springify().damping(18)}
      >
        <View style={styles.instrBorder} />
        <View style={styles.instrBody}>
          <View style={styles.instrIconWrap}>
            <MaterialCommunityIcons name="hand-pointing-up" size={24} color={C.lightGreen} />
          </View>
          <View style={styles.instrTextWrap}>
            <View style={styles.instrBadge}>
              <Text style={[styles.instrBadgeTxt, f('PlusJakartaSans-Bold')]}>
                🎮 MINIJEU DE COMMUNICATION
              </Text>
            </View>
            <Text style={[styles.instrTitle, f('PlusJakartaSans-ExtraBold')]}>
              Ordonne les étapes dans le bon ordre
            </Text>
            <Text style={[styles.instrAra, f('BeVietnamPro-Medium')]}>
              رتّب الخطوات بالترتيب الصحيح
            </Text>
            <View style={styles.instrHintRow}>
              <MaterialCommunityIcons name="drag-vertical" size={14} color={C.outline} />
              <Text style={[styles.instrHint, f('PlusJakartaSans-Medium')]}>
                Glisse les cartes pour les réordonner
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ── Error Banner ── */}
      {errorVisible && (
        <Animated.View
          style={styles.errorBanner}
          entering={FadeInDown.duration(300)}
        >
          <MaterialCommunityIcons name="alert-circle" size={16} color={C.error} />
          <Text style={[styles.errorTxt, f('PlusJakartaSans-Bold')]}>
            Ce n'est pas le bon ordre. Réessaie !
          </Text>
        </Animated.View>
      )}

      {/* ── Draggable List ── */}
      <View style={styles.listWrap}>
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            activeIdx={activeIdx}
            dragY={dragY}
            onDrop={commitMove}
            f={f}
          />
        ))}
      </View>

      {/* ── Footer CTA ── */}
      <Animated.View style={styles.footer} entering={FadeInUp.duration(400).delay(500)}>
        <AnimatedTouchable
          style={[styles.ctaBtn, correct && styles.ctaBtnActive, ctaAnimStyle]}
          activeOpacity={0.9}
          onPress={handleVerify}
        >
          <Text style={[styles.ctaBtnTxt, correct && styles.ctaBtnTxtActive, f('PlusJakartaSans-Bold')]}>
            {correct ? '✓ Valider mon ordre' : 'Vérifier mon ordre →'}
          </Text>
        </AnimatedTouchable>
      </Animated.View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  zelligeWrap: { position: 'absolute', top: -30, right: -40, opacity: 0.8 },

  appBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,248,240,0.92)',
    zIndex: 10,
  },
  appBarStep: {
    backgroundColor: C.surfaceContainerHighest,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  appBarStepTxt: { fontSize: 10, color: C.onSurfaceVariant },
  appBarCenter: { alignItems: 'center' },
  appBarTitle: { fontSize: 16, color: C.primary },
  appBarSub: { fontSize: 10, color: 'rgba(44,78,62,0.7)' },
  appBarTimer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(230,226,220,0.6)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  appBarTimerTxt: { fontSize: 11, color: C.onSurface },

  instrCard: {
    marginHorizontal: 24, marginTop: 8, marginBottom: 20,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12, overflow: 'hidden',
    shadowColor: C.onSurface, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 16, elevation: 2,
  },
  instrBorder: { height: 5, backgroundColor: C.lightGreen },
  instrBody: { padding: 16, flexDirection: 'row', gap: 14 },
  instrIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(82,183,136,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  instrTextWrap: { flex: 1 },
  instrBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.primaryFixed,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, marginBottom: 6,
  },
  instrBadgeTxt: { fontSize: 9, color: C.onPrimaryFixedVariant },
  instrTitle: { fontSize: 14, color: C.onSurface, lineHeight: 20, marginBottom: 4 },
  instrAra: { fontSize: 12, color: C.primary, marginBottom: 6 },
  instrHintRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  instrHint: { fontSize: 11, color: C.outline },

  errorBanner: {
    marginHorizontal: 24, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.errorContainer,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 3, borderLeftColor: C.error,
  },
  errorTxt: { fontSize: 12, color: C.error },

  listWrap: {
    paddingHorizontal: 24,
    gap: GAP,
  },

  itemCard: {
    height: ITEM_H,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  itemNumber: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: 1, borderColor: 'rgba(191,201,193,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemNumberTxt: { fontSize: 13, color: C.onSurfaceVariant },
  itemTextWrap: { flex: 1, gap: 3 },
  itemFr: { fontSize: 12, color: C.onSurface, lineHeight: 18 },
  itemAr: { fontSize: 11, color: C.outline },
  dragHandle: {
    width: 32, alignItems: 'center', justifyContent: 'center',
    opacity: 0.6,
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 20,
    backgroundColor: 'rgba(255,248,240,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(191,201,193,0.15)',
    zIndex: 20,
  },
  ctaBtn: {
    height: 56,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: C.surfaceContainerHighest,
  },
  ctaBtnActive: {
    backgroundColor: C.lightGreen,
    borderBottomColor: C.primary,
  },
  ctaBtnTxt: { fontSize: 15, color: C.onSurfaceVariant },
  ctaBtnTxtActive: { color: '#fff' },
});
