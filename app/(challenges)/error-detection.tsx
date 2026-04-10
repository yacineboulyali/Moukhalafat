import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ChallengeTimer from '../../components/ChallengeTimer';
import { THEME } from '../../constants/theme';
import { SoundService } from '../../services/sounds';

const MISTAKES = [
  { id: 1, text: "Fès est la capitale actuelle du Maroc.", correct: "Rabat est la capitale actuelle du Maroc." },
  { id: 2, text: "La monnaie du Maroc est le Dollar.", correct: "La monnaie du Maroc est le Dirham." }
];

export default function ErrorDetectionScreen() {
  const router = useRouter();
  const [found, setFound] = useState<number[]>([]);

  const handlePress = (id: number) => {
    if (found.includes(id)) return;
    const newFound = [...found, id];
    setFound(newFound);
    if (newFound.length === MISTAKES.length) {
      SoundService.getInstance().playSound('success');
      setTimeout(() => router.push('/(challenges)/zellige-v2'), 2000);
    } else {
      SoundService.getInstance().playSound('correct');
    }
  };

  return (
    <View style={styles.container}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <MaterialIcons name="search" size={32} color={THEME.light.primary} />
          <Text style={styles.title}>Détection d'Erreurs</Text>
          <Text style={styles.subtitle}>Trouvez les {MISTAKES.length} erreurs dans le texte</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          {MISTAKES.map((item, idx) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(400 + idx * 200)}>
              <TouchableOpacity
                style={[styles.errorCard, found.includes(item.id) && styles.fixedCard]}
                onPress={() => handlePress(item.id)}
              >
                <Text style={[styles.errorText, found.includes(item.id) && styles.strikethrough]}>
                  {item.text}
                </Text>
                {found.includes(item.id) && (
                  <Animated.View entering={FadeInDown} style={styles.fixBox}>
                    <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
                    <Text style={styles.fixText}>{item.correct}</Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {found.length === MISTAKES.length && (
        <View style={styles.successBar}>
          <Text style={styles.successBarText}>Toutes les erreurs ont été corrigées !</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.light.primary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.light.onSurfaceVariant,
    marginTop: 4,
  },
  textContainer: {
    gap: 20,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 82, 82, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FF5252',
  },
  fixedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
    lineHeight: 24,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: THEME.light.onSurfaceVariant,
    opacity: 0.5,
  },
  fixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  fixText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  successBar: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: THEME.light.primary,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  successBarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  }
});
