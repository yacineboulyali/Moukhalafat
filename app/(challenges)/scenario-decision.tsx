import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import ChallengeTimer from '../../components/ChallengeTimer';
import { THEME } from '../../constants/theme';
import { SoundService } from '../../services/sounds';

const SCENARIO = {
  context: "Un artisan vous explique que son secret se transmet de père en fils, mais il semble hésiter à vous laisser entrer dans son atelier.",
  choices: [
    { id: '1', text: "Lui offrir un thé et l'écouter parler de sa famille.", impact: "Confiance ++", color: '#4CAF50' },
    { id: '2', text: "Lui proposer de l'argent pour voir son travail.", impact: "Méfiance +", color: '#FF5252' },
    { id: '3', text: "Lui montrer vos propres dessins d'artisanat.", impact: "Respect +", color: '#2196F3' }
  ]
};

export default function ScenarioDecisionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleChoice = (id: string) => {
    setSelected(id);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('medium');
    setTimeout(() => router.push('/(challenges)/error-detection'), 2000);
  };

  return (
    <View style={styles.container}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />

      <View style={styles.topSection}>
        <Animated.View entering={FadeIn} style={styles.characterBox}>
          <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Hassan' }} style={styles.avatar} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{SCENARIO.context}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.choicesSection}>
        {SCENARIO.choices.map((choice, idx) => (
          <Animated.View key={choice.id} entering={SlideInRight.delay(400 + idx * 200)}>
            <TouchableOpacity
              style={[
                styles.choiceCard,
                selected === choice.id && { borderColor: choice.color, backgroundColor: `${choice.color}10` }
              ]}
              onPress={() => handleChoice(choice.id)}
              disabled={!!selected}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
              {selected === choice.id && (
                <View style={[styles.impactBadge, { backgroundColor: choice.color }]}>
                  <Text style={styles.impactText}>{choice.impact}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
  },
  topSection: {
    padding: 24,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  characterBox: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    elevation: 4,
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.light.primary,
    lineHeight: 24,
    textAlign: 'center',
  },
  choicesSection: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  choiceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.light.primary,
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  }
});
