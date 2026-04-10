import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import ChallengeTimer from '../../components/ChallengeTimer';
import { SoundService } from '../../services/sounds';

export default function ShortAnswerScreen() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = () => {
    if (answer.trim().toLowerCase().includes('cuir') || answer.trim().toLowerCase().includes('tannage')) {
       SoundService.getInstance().playSound('correct');
       setIsDone(true);
       setTimeout(() => router.push('/(challenges)/matching'), 1500);
    } else {
       SoundService.getInstance().playSound('wrong');
       // Optionally show error state or trigger shake, but for now just wrong sound
    }
  };

  return (
    <View style={styles.container}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.iconBox}>
             <MaterialIcons name="edit" size={28} color="#fff" />
          </View>
          <Text style={styles.title}>Réponse Courte</Text>
          <Text style={styles.subtitle}>Saisissez votre réponse ci-dessous</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.inputCard}>
          <Text style={styles.question}>Comment appelle-t-on le quartier des tanneurs à Fès ?</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre réponse..."
            value={answer}
            onChangeText={setAnswer}
            multiline
            numberOfLines={2}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)} style={styles.tipBox}>
          <MaterialIcons name="lightbulb" size={18} color={THEME.light.gold} />
          <Text style={styles.tipText}>Indice : C'est un métier lié au travail des peaux d'animaux.</Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, (!answer.trim() || isDone) && styles.disabledBtn]} 
          onPress={handleSubmit}
          disabled={!answer.trim() || isDone}
        >
          <Text style={styles.btnText}>ENVOYER LA RÉPONSE</Text>
        </TouchableOpacity>
      </View>
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
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: THEME.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.light.onSurface,
    marginBottom: 20,
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: THEME.light.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: THEME.light.goldMuted,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  btn: {
    backgroundColor: THEME.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: THEME.light.locked,
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
