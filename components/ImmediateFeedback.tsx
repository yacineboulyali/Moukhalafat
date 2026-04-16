import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface ImmediateFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  message?: string;
}

export const ImmediateFeedback: React.FC<ImmediateFeedbackProps> = ({ 
  isVisible, 
  isCorrect, 
  message 
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  if (!isVisible) return null;

  const backgroundColor = isCorrect ? '#d7ffb8' : '#ffdfe0';
  const textColor = isCorrect ? '#58a700' : '#ea2b2b';
  const iconName = isCorrect ? "check-circle" : "cancel";

  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(15)} 
      exiting={SlideOutDown.duration(300)}
      style={[
        styles.container, 
        { 
          backgroundColor,
          paddingBottom: Math.max(insets.bottom, 20) + 10,
          borderColor: isCorrect ? '#84d800' : '#ff4b4b',
          borderTopWidth: 2
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons 
            name={iconName} 
            size={32} 
            color={textColor} 
          />
          <Text style={[styles.title, { color: textColor }]}>
            {isCorrect ? "Excellent !" : "Presque !"}
          </Text>
        </View>
        
        <Text style={[styles.message, { color: textColor }]}>
          {message || (isCorrect 
            ? "Vous avez trouvé la bonne réponse." 
            : "La réponse correcte était à portée de main.")}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    paddingHorizontal: 24,
    paddingTop: 24,
    zIndex: 2000,
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    opacity: 0.95,
  },
});
