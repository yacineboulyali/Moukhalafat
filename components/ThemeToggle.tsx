import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  useDerivedValue,
  interpolateColor
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, setTheme, colors } = useTheme();

  // 0 is light, 1 is dark
  const transition = useDerivedValue(() => {
    return withTiming(isDark ? 1 : 0, { duration: 400 });
  });

  const sunStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(transition.value, [0, 1], [1, 0]) },
        { rotate: `${interpolate(transition.value, [0, 1], [0, 90])}deg` },
      ],
      opacity: interpolate(transition.value, [0, 0.5, 1], [1, 0, 0]),
    };
  });

  const moonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(transition.value, [0, 1], [0, 1]) },
        { rotate: `${interpolate(transition.value, [0, 1], [-90, 0])}deg` },
      ],
      opacity: interpolate(transition.value, [0, 0.5, 1], [0, 0, 1]),
    };
  });

  return (
    <TouchableOpacity 
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      style={[styles.container, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.icon, moonStyle]}>
          <MaterialIcons name="dark-mode" size={20} color={colors.gold} />
        </Animated.View>
        <Animated.View style={[styles.icon, sunStyle]}>
          <MaterialIcons name="light-mode" size={20} color={colors.gold} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
  },
});
