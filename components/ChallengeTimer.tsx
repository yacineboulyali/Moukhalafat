import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor,
  useSharedValue,
  withSequence,
  withRepeat
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';

interface ChallengeTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export default function ChallengeTimer({ duration, onTimeUp }: ChallengeTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = useSharedValue(1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        // Trigger haptic every second if less than 10s left
        if (next <= 10 && next > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          shake.value = withSequence(
            withTiming(-5, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
        }
        // Critical haptic at 3, 2, 1
        if (next <= 3 && next > 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    progress.value = withTiming(timeLeft / duration, { duration: 1000 });
  }, [timeLeft]);

  const barStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.2, 0.5, 1],
        ['#FF5252', '#FF5252', '#FFA000', '#4CAF50']
      ),
    };
  });

  const timerContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Animated.View style={[styles.container, timerContainerStyle]}>
      <View style={styles.header}>
        <MaterialIcons 
          name="timer" 
          size={20} 
          color={timeLeft <= 10 ? '#FF5252' : THEME.light.primary} 
        />
        <Text style={[
          styles.timerText,
          timeLeft <= 10 && styles.criticalText
        ]}>
          {formatTime(timeLeft)}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8, // Reduced from 20
    paddingVertical: 4,   // Reduced from 10
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced from 8
    marginBottom: 4, // Reduced from 8
  },
  timerText: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.light.primary,
    letterSpacing: 1,
  },
  criticalText: {
    color: '#FF5252',
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
