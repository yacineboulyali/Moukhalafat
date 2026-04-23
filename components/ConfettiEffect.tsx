import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// OPTIMISATION ANDROID : 
// - 20 pièces sur Android (mid-range) vs 30 sur iOS
// - Moins d'animations withRepeat simultanées pour réduire la charge du thread UI
const CONFETTI_COUNT = Platform.OS === 'android' ? 20 : 30;
const COLORS = ['#FFD700', '#FFA500', '#FF4500', '#4CAF50', '#2196F3', '#9C27B0'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const startX = React.useMemo(() => Math.random() * width, []);
  const color = React.useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);
  
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotation = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const duration = 2500 + Math.random() * 2000;
    const delay = Math.random() * 1000;

    translateY.value = withDelay(delay, withTiming(height + 20, { 
      duration, 
      easing: Easing.bezier(0.41, 0, 0.58, 1) 
    }));

    // OPTIMISATION: Sur Android, on réduit les withRepeat pour alléger le thread UI
    // On utilise une oscillation simple au lieu d'un withRepeat infini
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + 20, { duration: 500 }),
          withTiming(startX - 20, { duration: 500 })
        ),
        Math.ceil(duration / 1000), // Nombre fini d'itérations basé sur la durée
        true
      )
    );

    rotation.value = withDelay(delay, withTiming(rotation.value + 720, { duration }));
    opacity.value = withDelay(delay + duration - 500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` }
    ] as any,
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
    position: 'absolute',
    top: 0,
    width: 8,
    height: 12,
    borderRadius: 2,
    zIndex: 9999,
  },
});
