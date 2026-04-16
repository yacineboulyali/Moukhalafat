import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CONFETTI_COUNT = 40;
const COLORS = ['#FFD700', '#FFA500', '#FF4500', '#4CAF50', '#2196F3', '#9C27B0'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * width);
  const rotation = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  useEffect(() => {
    const duration = 2500 + Math.random() * 2000;
    const delay = Math.random() * 1000;

    translateY.value = withDelay(delay, withTiming(height + 20, { 
      duration, 
      easing: Easing.bezier(0.41, 0, 0.58, 1) 
    }));

    translateX.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(translateX.value + 20, { duration: 500 }),
        withTiming(translateX.value - 20, { duration: 500 })
      ),
      -1,
      true
    ));

    rotation.value = withDelay(delay, withTiming(rotation.value + 720, { duration }));
    opacity.value = withDelay(delay + duration - 500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
    backgroundColor: color,
  }));

  return <Animated.View style={[styles.confetti, animatedStyle]} />;
};

export const ConfettiEffect = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  confetti: {
    paddingHorizontal: 1, // Fix blank file issue
    position: 'absolute',
    top: 0,
    width: 8,
    height: 12,
    borderRadius: 2,
    zIndex: 9999,
  },
});
