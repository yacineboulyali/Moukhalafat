import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface ChallengeProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  color?: string;
}

export default function ChallengeProgressBar({ progress, label, color }: ChallengeProgressBarProps) {
  const { colors } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(progress, { damping: 15, stiffness: 80 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
    backgroundColor: color || colors.gold,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>{label || 'Progression'}</Text>
        <Text style={[styles.percentage, { color: colors.primary }]}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border + '40' }]}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '900',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
