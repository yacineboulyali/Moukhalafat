import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, LayoutChangeEvent } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

const MATCHING_DATA = {
  left: [
    { id: 'l1', text: "Lune", textAr: "القمر", matchingId: 'r1' },
    { id: 'l2', text: "Mars", textAr: "المريخ", matchingId: 'r2' },
    { id: 'l3', text: "Saturne", textAr: "زحل", matchingId: 'r3' },
  ],
  right: [
    { id: 'r2', text: "Planète Rouge", textAr: "الكوكب الأحمر" },
    { id: 'r3', text: "Anneaux Géants", textAr: "حلقات عملاقة" },
    { id: 'r1', text: "Satellite Naturel", textAr: "قمر طبيعي" },
  ]
};

function MatchCard({ 
  id, 
  text, 
  onPress, 
  isSelected, 
  isMatched, 
  isError, 
  colors,
  onLayout
}: any) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
    backgroundColor: isMatched ? '#f1f8e9' : (isSelected ? colors.primary + '10' : colors.surface),
    borderColor: isMatched ? '#4CAF50' : (isError ? '#F44336' : (isSelected ? colors.primary : colors.border)),
    borderWidth: isSelected || isMatched || isError ? 2 : 1.5,
  }));

  return (
    <Animated.View 
      layout={Layout.springify()} 
      onLayout={onLayout}
      style={[styles.itemCard, animatedStyle]}
    >
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPress} 
        disabled={isMatched}
      >
        <Text style={[styles.itemText, { color: isMatched ? '#2E7D32' : colors.primary }]}>{text}</Text>
        <Text style={[styles.itemTextAr, { color: isMatched ? '#2E7D32' : colors.primary + '70' }]}>{id.startsWith('l') ? MATCHING_DATA.left.find(l => l.id === id)?.textAr : MATCHING_DATA.right.find(r => r.id === id)?.textAr}</Text>
        {isMatched && <MaterialIcons name="check-circle" size={16} color="#4CAF50" />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MatchingGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [errorIds, setErrorIds] = useState<string[]>([]);
  
  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({});

  const handleLayout = (id: string) => (event: LayoutChangeEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setPositions(prev => ({ 
        ...prev, 
        [id]: { x: pageX + (id.startsWith('l') ? width : 0), y: pageY + height / 2 } 
      }));
    });
  };

  const handleLeftSelect = (id: string) => {
    if (matches[id]) return;
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('light');
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightSelect = (id: string) => {
    if (!selectedLeft) return;
    
    const leftItem = MATCHING_DATA.left.find(l => l.id === selectedLeft);
    if (leftItem?.matchingId === id) {
      SoundService.getInstance().playSound('correct');
      SoundService.getInstance().triggerHaptic('success');
      setMatches(prev => ({ ...prev, [selectedLeft]: id }));
      setSelectedLeft(null);
      
      if (Object.keys(matches).length + 1 === MATCHING_DATA.left.length) {
        setTimeout(() => router.push('/(challenges)/scenario-dialogue'), 2500);
      }
    } else {
      SoundService.getInstance().playSound('wrong');
      SoundService.getInstance().triggerHaptic('error');
      setErrorIds([selectedLeft, id]);
      setTimeout(() => setErrorIds([]), 600);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: insets.top }} />
      <ChallengeTimer duration={120} onTimeUp={() => router.back()} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={[styles.tag, { backgroundColor: colors.gold + '15' }]}>
            <Text style={[styles.tagText, { color: colors.gold }]}>APPARIEMENT</Text>
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>Reliez les éléments correspondants</Text>
          <Text style={[styles.titleAr, { color: colors.primary + '80' }]}>اربط العناصر المتطابقة</Text>
        </Animated.View>

        <View style={styles.gameWrapper}>
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {Object.entries(matches).map(([leftId, rightId]) => {
              const start = positions[leftId];
              const end = positions[rightId];
              if (!start || !end) return null;
              
              const startX = 85; 
              const startY = start.y - 300;
              const endX = width - 135;
              const endY = end.y - 300;
              
              const cp1x = startX + (endX - startX) / 2;
              const cp1y = startY - 60; // Upward bump
              const cp2x = startX + (endX - startX) / 2;
              const cp2y = endY + 60;   // Downward bump
              
              const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

              return (
                <Path
                  key={`line-${leftId}`}
                  d={pathData}
                  stroke={colors.gold}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="6, 4"
                />
              );
            })}
          </Svg>

          <View style={styles.grid}>
            <View style={styles.column}>
              {MATCHING_DATA.left.map((item) => (
                <MatchCard
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  colors={colors}
                  isSelected={selectedLeft === item.id}
                  isMatched={!!matches[item.id]}
                  isError={errorIds.includes(item.id)}
                  onPress={() => handleLeftSelect(item.id)}
                  onLayout={handleLayout(item.id)}
                />
              ))}
            </View>

            <View style={styles.column}>
              {MATCHING_DATA.right.map((item) => (
                <MatchCard
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  colors={colors}
                  isSelected={false}
                  isMatched={Object.values(matches).includes(item.id)}
                  isError={errorIds.includes(item.id)}
                  onPress={() => handleRightSelect(item.id)}
                  onLayout={handleLayout(item.id)}
                />
              ))}
            </View>
          </View>
        </View>

        {Object.keys(matches).length === MATCHING_DATA.left.length && (
          <Animated.View entering={FadeInUp} style={styles.successBox}>
            <MaterialIcons name="stars" size={40} color={colors.gold} />
            <Text style={[styles.successText, { color: colors.primary }]}>Bravo ! Connexions établies.</Text>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 24) + 10, backgroundColor: colors.surface }]}>
        <View style={styles.footerRow}>
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setMatches({}); setSelectedLeft(null); SoundService.getInstance().playSound('click'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.skipIconBtn, { borderColor: colors.primary + '40' }]}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="fast-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { marginBottom: 32, alignItems: 'center' },
  tag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  tagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  titleAr: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  gameWrapper: { flex: 1, minHeight: 400 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },
  column: { flex: 1, gap: 12 },
  itemCard: { borderRadius: 16, overflow: 'hidden' },
  touchable: { padding: 16, alignItems: 'center', minHeight: 80, justifyContent: 'center' },
  itemText: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  itemTextAr: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  successBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 32, padding: 16, borderRadius: 20, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
  successText: { fontSize: 16, fontWeight: '800' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  footerRow: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' },
  sideActions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
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
