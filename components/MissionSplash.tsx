import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  ScaleInCenter,
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface MissionSplashProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
  onFinish?: () => void;
  cityColor?: string;
}

export const MissionSplash: React.FC<MissionSplashProps> = ({ 
  isVisible, 
  title, 
  subtitle, 
  onFinish,
  cityColor = '#D4AF37'
}) => {
  const [active, setActive] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
        if (onFinish) onFinish();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!active) return null;

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={styles.container}
    >
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
      
      <Animated.View 
        entering={ScaleInCenter} 
        style={styles.content}
      >
        <View style={[styles.iconCircle, { borderColor: cityColor }]}>
          <MaterialIcons name="stars" size={60} color={cityColor} />
        </View>
        
        <Text style={styles.label}>MISSION SUIVANTE</Text>
        <Text style={styles.title}>{title}</Text>
        
        <View style={[styles.divider, { backgroundColor: cityColor }]} />
        
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 30,
    width: width * 0.85,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    opacity: 0.6,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 26,
  },
});
