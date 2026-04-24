import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeBlurView } from './SafeBlurView';
import { router, usePathname } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SoundService } from '../services/sounds';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 3;

interface NavItemProps {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  path: string;
  isActive: boolean;
}

const NavItem = ({ icon, label, path, isActive }: NavItemProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isActive ? 1.1 : scale.value) },
      { translateY: withSpring(isActive ? -4 : translateY.value) }
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0),
    transform: [{ scaleX: withSpring(isActive ? 1 : 0) }]
  }));

  const handlePress = () => {
    if (isActive) return;
    
    SoundService.getInstance().triggerHaptic('light');
    SoundService.getInstance().playSound('click'); 
    
    scale.value = withSequence(withTiming(0.8, { duration: 100 }), withSpring(1));
    router.push(path as any);
  };

  return (
    <TouchableOpacity 
      style={styles.navItem} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <MaterialIcons 
          name={icon} 
          size={22} 
          color={isActive ? colors.gold : (isActive ? colors.onSurface : 'rgba(169, 180, 172, 0.4)')} 
        />
        {isActive && (
          <View style={[styles.activeGlow, { backgroundColor: colors.gold + '15' }]} />
        )}
      </Animated.View>
      <Animated.View style={[styles.indicator, { backgroundColor: colors.gold }, indicatorStyle]} />
    </TouchableOpacity>
  );
};

export const ZelligeBottomNav = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();

  return (
    <SafeBlurView 
      intensity={isDark ? 40 : 80} 
      tint={isDark ? 'dark' : 'light'} 
      style={[
        styles.container, 
        { 
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
          height: 48 + Math.max(insets.bottom, 0),
          borderTopColor: colors.border
        }
      ]}
    >
      <NavItem 
        name="accueil" 
        icon="home" 
        label="Accueil" 
        path="/accueil" 
        isActive={pathname === '/accueil'} 
      />
      <NavItem 
        name="map" 
        icon="map" 
        label="Carte" 
        path="/map" 
        isActive={pathname === '/map'} 
      />
      <NavItem 
        name="badges" 
        icon="military-tech" 
        label="Badges" 
        path="/badges" 
        isActive={pathname === '/badges'} 
      />
      <NavItem 
        name="profil" 
        icon="person" 
        label="Profil" 
        path="/profil-classique" 
        isActive={pathname === '/profil-classique'} 
      />
    </SafeBlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    zIndex: -1,
  },
  indicator: {
    width: 16,
    height: 3,
    borderRadius: 2,
    marginTop: 2,
  }
});
