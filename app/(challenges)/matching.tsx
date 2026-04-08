import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  FadeInDown,
  FadeInUp,
  ZoomIn
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { playSound } from '../../utils/SoundManager';

const { width, height } = Dimensions.get('window');

const DATA = {
  left: [
    { id: 'l1', text: 'Zellige', pairId: 'r2', initialY: 0 },
    { id: 'l2', text: 'Bab Boujloud', pairId: 'r1', initialY: 100 },
    { id: 'l3', text: 'Tanneurs', pairId: 'r3', initialY: 200 },
  ],
  right: [
    { id: 'r1', text: 'Porte Bleue', y: 100 },
    { id: 'r2', text: 'Mosaïque', y: 0 },
    { id: 'r3', text: 'Chouara', y: 200 },
  ]
};

const CARD_HEIGHT = 80;
const COLUMN_WIDTH = width * 0.4;

interface DraggableCardProps {
  item: any;
  onMatch: (lId: string, rId: string) => void;
  matches: Record<string, string>;
}

const DraggableCard = ({ item, onMatch, matches }: DraggableCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isPressed = useSharedValue(false);
  const isMatched = !!matches[item.id];

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      runOnJS(playSound)('click');
    })
    .onUpdate((event) => {
      if (isMatched) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isPressed.value = false;
      if (isMatched) return;

      // Check for collision with target column
      // Target is roughly Column Right which is around ColumnWidth + gap
      const dropX = event.translationX;
      const dropY = event.translationY + item.initialY;

      // Logic to find which item we are dropping on
      let matchedId: string | null = null;
      if (dropX > width * 0.3) {
        DATA.right.forEach(r => {
          if (Math.abs(dropY - r.y) < CARD_HEIGHT / 2) {
            matchedId = r.id;
          }
        });
      }

      if (matchedId && matchedId === item.pairId) {
        runOnJS(onMatch)(item.id, matchedId);
        runOnJS(playSound)('match');
        translateX.value = withSpring(width * 0.45); // Snap to position
        translateY.value = withSpring(DATA.right.find(r => r.id === matchedId)!.y - item.initialY);
      } else {
        if (matchedId) runOnJS(playSound)('wrong');
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
    opacity: isMatched ? 0.7 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, rStyle, isMatched && styles.matchedCard, { top: item.initialY }]}>
        <Text style={[styles.cardText, isMatched && styles.matchedText]}>{item.text}</Text>
        <MaterialIcons 
          name={isMatched ? "link" : "drag-indicator"} 
          size={20} 
          color={isMatched ? "#fff" : THEME.light.gold} 
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default function DragMatchChallenge() {
  const router = useRouter();
  const [matches, setMatches] = useState<Record<string, string>>({});

  const handleMatch = (lId: string, rId: string) => {
    setMatches(prev => {
      const newMatches = { ...prev, [lId]: rId };
      if (Object.keys(newMatches).length === DATA.left.length) {
        playSound('correct');
        setTimeout(() => router.push('/(challenges)/matching-epure'), 2000);
      }
      return newMatches;
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.title}>Mise en Relation</Text>
          <Text style={styles.subtitle}>Faites glisser les mots vers leur paire</Text>
        </Animated.View>

        <View style={styles.gameContainer}>
          {/* Left Column (Draggables) */}
          <View style={styles.column}>
            {DATA.left.map((item) => (
              <DraggableCard 
                key={item.id} 
                item={item} 
                onMatch={handleMatch} 
                matches={matches}
              />
            ))}
          </View>

          {/* Right Column (Targets) */}
          <View style={[styles.column, { alignItems: 'flex-end' }]}>
            {DATA.right.map((item) => (
              <View key={item.id} style={[styles.targetCard, { top: item.y }]}>
                <Text style={styles.targetText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {Object.keys(matches).length === DATA.left.length && (
          <Animated.View entering={ZoomIn} style={styles.successOverlay}>
             <MaterialIcons name="stars" size={80} color={THEME.light.gold} />
             <Text style={styles.successTitle}>INCROYABLE !</Text>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.light.primary,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.light.onSurfaceVariant,
    marginTop: 4,
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  column: {
    flex: 1,
    height: 300,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: COLUMN_WIDTH,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  matchedCard: {
    backgroundColor: THEME.light.primary,
    borderColor: THEME.light.primary,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.light.primary,
  },
  matchedText: {
    color: '#fff',
  },
  targetCard: {
    position: 'absolute',
    width: COLUMN_WIDTH,
    height: 70,
    backgroundColor: 'rgba(44, 78, 62, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(44, 78, 62, 0.2)',
  },
  targetText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.light.primary,
    opacity: 0.6,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.light.primary,
    marginTop: 20,
    letterSpacing: 2,
  }
});
