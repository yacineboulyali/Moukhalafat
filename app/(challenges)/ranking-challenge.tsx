import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence, 
  withTiming,
  Layout
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

const RANKING_DATA = {
  question: "Dans quel ordre faut-il gérer un conflit professionnel ?",
  questionAr: "بأي ترتيب يجب إدارة النزاع المهني؟",
  items: [
    { id: '1', text: "Analyser les causes", textAr: "تحليل الأسباب", correctPos: 0 },
    { id: '2', text: "Écouter activement", textAr: "الاستماع الفعال", correctPos: 1 },
    { id: '3', text: "Identifier les besoins", textAr: "تحديد الاحتياجات", correctPos: 2 },
    { id: '4', text: "Proposer une solution", textAr: "اقتراح حل", correctPos: 3 },
  ],
};

export default function RankingChallengeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [currentOrder, setCurrentOrder] = useState(() => 
    [...RANKING_DATA.items].sort(() => Math.random() - 0.5)
  );
  
  const [completed, setCompleted] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const shake = useSharedValue(0);

const moveUp = (index: number) => {
    if (index === 0 || completed) return;
    const newItems = [...currentOrder];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setCurrentOrder(newItems);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('light');
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1 || completed) return;
    const newItems = [...currentOrder];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setCurrentOrder(newItems);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('light');
  };

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const validate = () => {
    const isCorrect = currentOrder.every((item, index) => item.correctPos === index);
    
    if (isCorrect) {
      setCompleted(true);
      setErrorStatus(false);
      SoundService.getInstance().playSound('correct');
      SoundService.getInstance().triggerHaptic('success');
      setTimeout(() => router.push('/defi-resultat'), 2000);
    } else {
      setErrorStatus(true);
      SoundService.getInstance().playSound('wrong');
      SoundService.getInstance().triggerHaptic('error');
      triggerShake();
      setTimeout(() => setErrorStatus(false), 1500);
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }]
  }));

  const validateBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(completed ? 1.05 : 1) }],
    backgroundColor: withTiming(completed ? '#4CAF50' : colors.primary)
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: insets.top }} />
      
      <ChallengeTimer duration={120} onTimeUp={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={[styles.tag, { backgroundColor: colors.gold + '20' }]}>
            <Text style={[styles.tagText, { color: colors.gold }]}>DÉFI LOGIQUE</Text>
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>{RANKING_DATA.question}</Text>
          <Text style={[styles.titleAr, { color: colors.primary + '80' }]}>{RANKING_DATA.questionAr}</Text>
          <Text style={[styles.instruction, { color: colors.onSurfaceVariant }]}>
            Réorganisez les étapes dans le bon ordre chronologique.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.itemsContainer, containerStyle]}>
          {currentOrder.map((item, index) => (
            <Animated.View 
              key={item.id} 
              layout={Layout.springify().mass(0.8)}
              entering={FadeInUp.delay(400 + index * 100)}
              style={[
                styles.rankItem, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                completed && styles.correctItem,
                errorStatus && styles.errorItem
              ]}
            >
              <View style={[styles.rankBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              
              <View style={styles.textStack}>
                <Text style={[styles.itemText, { color: colors.primary }]}>{item.text}</Text>
                <Text style={[styles.itemTextAr, { color: colors.primary + '70' }]}>{item.textAr}</Text>
              </View>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  onPress={() => moveUp(index)} 
                  disabled={index === 0 || completed}
                  style={styles.controlBtn}
                >
                  <MaterialIcons 
                    name="keyboard-arrow-up" 
                    size={28} 
                    color={index === 0 || completed ? colors.locked : colors.gold} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => moveDown(index)} 
                  disabled={index === currentOrder.length - 1 || completed}
                  style={styles.controlBtn}
                >
                  <MaterialIcons 
                    name="keyboard-arrow-down" 
                    size={28} 
                    color={index === currentOrder.length - 1 || completed ? colors.locked : colors.gold} 
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          <TouchableOpacity 
            onPress={validate}
            disabled={completed}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.validateBtn, validateBtnStyle]}>
              <Text style={styles.validateBtnText}>{completed ? "BRAVO !" : "VALIDER L'ORDRE"}</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  tag: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  tagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  titleAr: { fontSize: 18, textAlign: 'center', marginBottom: 12 },
  instruction: { fontSize: 14, fontWeight: '600', textAlign: 'center', opacity: 0.7 },
  itemsContainer: { gap: 12 },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  correctItem: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  errorItem: { borderColor: '#EF4444' },
  rankBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumber: { color: '#fff', fontWeight: '900', fontSize: 14 },
  itemText: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  textStack: { flex: 1 },
  itemTextAr: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  controls: { flexDirection: 'column', marginLeft: 8 },
  controlBtn: { padding: 4 },
  footer: { marginTop: 32, alignItems: 'center' },
  validateBtn: { width: width - 48, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  validateBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});




