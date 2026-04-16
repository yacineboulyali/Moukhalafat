import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  FadeInDown,
  ScaleInCenter,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface ChallengeIntroModalProps {
  isVisible: boolean;
  dialogue?: {
    speaker: string;
    text: string;
    contexte: string;
  };
  onStart: () => void;
  cityColor?: string;
}

export const ChallengeIntroModal: React.FC<ChallengeIntroModalProps> = ({ 
  isVisible, 
  dialogue,
  onStart,
  cityColor = '#D4AF37'
}) => {
  if (!isVisible || !dialogue) return null;

  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={styles.container}
    >
      <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <MaterialIcons name="info-outline" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.contextLabel}>CONTEXTE</Text>
          </View>
          <Text style={styles.contextText}>{dialogue.contexte}</Text>
        </Animated.View>

        <Animated.View entering={ScaleInCenter.delay(400)} style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { borderColor: cityColor }]}>
            <MaterialIcons name="account-circle" size={80} color="#fff" />
          </View>
          <View style={[styles.speakerBadge, { backgroundColor: cityColor }]}>
            <Text style={styles.speakerName}>{dialogue.speaker}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)} style={styles.bubble}>
          <Text style={styles.bubbleText}>"{dialogue.text}"</Text>
          <View style={[styles.bubbleTail, { borderTopColor: 'rgba(255,255,255,0.1)' }]} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: cityColor }]} 
            onPress={onStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>COMMENCER LE DÉFI</Text>
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 30,
    width: width * 0.9,
    alignItems: 'center',
  },
  contextCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contextLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  contextText: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    opacity: 0.9,
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  speakerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: -15,
    elevation: 4,
  },
  speakerName: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    borderRadius: 30,
    width: '100%',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bubbleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  bubbleTail: {
    position: 'absolute',
    top: -15,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 15,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  footer: {
    width: '100%',
  },
  startBtn: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
});
