import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn, FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import ChallengeTimer from '../../components/ChallengeTimer';

const { width } = Dimensions.get('window');

const PATTERNS = [
  { id: 1, type: 'star', color: '#D4AF37' },
  { id: 2, type: 'diamond', color: '#2D6B5A' },
  { id: 3, type: 'cross', color: '#8B4513' },
  { id: 4, type: 'circle', color: '#B22222' }
];

export default function ZelligeV2Screen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const handleFinish = () => {
    // End of scenario for now, return to map
    router.push('/map');
  };

  return (
    <View style={styles.container}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.title}>Atelier Zellige</Text>
          <Text style={styles.subtitle}>Choisissez le prochain motif à restaurer</Text>
        </Animated.View>

        <View style={styles.zelligeGrid}>
          {PATTERNS.map((pattern, idx) => (
            <Animated.View key={pattern.id} entering={ZoomIn.delay(400 + idx * 100)} style={styles.patternWrapper}>
              <TouchableOpacity 
                style={[
                  styles.patternCard,
                  selected === pattern.id && { borderColor: pattern.color, backgroundColor: `${pattern.color}15` }
                ]}
                onPress={() => setSelected(pattern.id)}
              >
                <View style={[styles.patternIcon, { backgroundColor: pattern.color }]}>
                   <MaterialIcons name="auto-fix-high" size={24} color="#fff" />
                </View>
                <Text style={styles.patternName}>Motif #{pattern.id}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeIn.delay(1000)} style={styles.illustrationBox}>
          <View style={styles.placeholderArt}>
            <MaterialIcons name="grid-on" size={80} color="rgba(45, 107, 90, 0.1)" />
            <Text style={styles.artText}>Aperçu de la restauration</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.finishBtn, !selected && styles.disabledBtn]} 
          onPress={handleFinish}
          disabled={!selected}
        >
          <Text style={styles.finishText}>TERMINER L'ÉTAPE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Zellige Clair V2 background
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D6B5A', // Vert Zellige
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  zelligeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  patternWrapper: {
    width: (width - 64) / 2,
  },
  patternCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  patternIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  patternName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D6B5A',
  },
  illustrationBox: {
    marginTop: 40,
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(45, 107, 90, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderArt: {
    alignItems: 'center',
    gap: 12,
  },
  artText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(45, 107, 90, 0.3)',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  finishBtn: {
    backgroundColor: '#2D6B5A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  finishText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  }
});
