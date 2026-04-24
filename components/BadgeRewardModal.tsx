import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Modal, 
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeBlurView } from './SafeBlurView';
import Svg, { Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  FadeInUp, 
  ZoomIn, 
  BounceIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { THEME } from '../constants/theme';
import { Badge } from '../constants/Badges';

import { ConfettiEffect } from './ConfettiEffect';
import { SoundService } from '../services/sounds';

const { width } = Dimensions.get('window');

interface BadgeRewardModalProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

export const BadgeRewardModal: React.FC<BadgeRewardModalProps> = ({ badge, isVisible, onClose }) => {
  const soundService = SoundService.getInstance();

  React.useEffect(() => {
    if (isVisible) {
      soundService.playSound('success');
      soundService.triggerHaptic('success');
    }
  }, [isVisible]);

  if (!badge) return null;

  const size = 180;
  const offset = size * 0.28;
  const points = `
    ${offset},0 
    ${size - offset},0 
    ${size},${offset} 
    ${size},${size - offset} 
    ${size - offset},${size} 
    ${offset},${size} 
    0,${size - offset} 
    0,${offset}
  `;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeBlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <ConfettiEffect />
        
        <Animated.View 
          entering={ZoomIn.springify()} 
          style={styles.container}
        >
          <Animated.View 
            entering={BounceIn.delay(300)}
            style={styles.badgeWrapper}
          >
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Defs>
                <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FBEEAC" />
                  <Stop offset="50%" stopColor="#D4AF37" />
                  <Stop offset="100%" stopColor="#8A6D3B" />
                </LinearGradient>
              </Defs>
              <Polygon
                points={points}
                fill="url(#goldGrad)"
                stroke="#D4AF37"
                strokeWidth={4}
              />
            </Svg>

            <View style={[StyleSheet.absoluteFill, styles.badgeIconContainer]}>
               {badge.remoteImage || badge.image ? (
                <Image 
                  source={badge.remoteImage || badge.image} 
                  style={{ width: size * 0.8, height: size * 0.8 }}
                  contentFit="contain"
                />
              ) : (
                <MaterialIcons name={badge.icon as any} size={size * 0.5} color={THEME.light.primary} />
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)} style={styles.textStack}>
            <Text style={styles.congrats}>Nouveau Badge Débloqué !</Text>
            <Text style={styles.arabicCongrats}>أحسنت! فتحت شارة جديدة</Text>
            
            <View style={styles.badgeNameContainer}>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeArabicName}>{badge.arabicName}</Text>
            </View>

            <Text style={styles.description}>{badge.description}</Text>
          </Animated.View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>CONTINUER LE VOYAGE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  badgeWrapper: {
    width: 180,
    height: 180,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStack: {
    alignItems: 'center',
    width: '100%',
  },
  congrats: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  arabicCongrats: {
    fontSize: 16,
    color: '#D4AF37',
    marginTop: 4,
    fontWeight: '600',
  },
  badgeNameContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  badgeName: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.light.primary,
    textAlign: 'center',
  },
  badgeArabicName: {
    fontSize: 22,
    color: THEME.light.gold,
    fontWeight: '700',
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: THEME.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
