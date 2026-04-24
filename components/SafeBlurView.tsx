import React from 'react';
import { Platform, View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';

interface SafeBlurViewProps extends BlurViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  fallbackColor?: string;
}

/**
 * A wrapper for BlurView that provides a safe fallback for Android.
 * Android's BlurView implementation can sometimes trigger "Software rendering doesn't support hardware bitmaps"
 * when combined with complex clipping or hardware-accelerated children.
 */
export const SafeBlurView: React.FC<SafeBlurViewProps> = ({ 
  style, 
  children, 
  intensity = 50, 
  tint = 'default',
  fallbackColor,
  ...props 
}) => {
  if (Platform.OS === 'android') {
    // Determine a fallback color based on tint if not provided
    const defaultFallback = tint === 'dark' 
      ? 'rgba(0,0,0,0.8)' 
      : tint === 'light' 
        ? 'rgba(255,255,255,0.8)' 
        : 'rgba(255,255,255,0.5)';
        
    return (
      <View 
        style={[
          style, 
          { backgroundColor: fallbackColor || defaultFallback }
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView 
      style={style} 
      intensity={intensity} 
      tint={tint}
      {...props}
    >
      {children}
    </BlurView>
  );
};
