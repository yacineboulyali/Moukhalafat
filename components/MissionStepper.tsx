import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface MissionStepperProps {
  currentMissionIndex: number;
  totalMissions?: number;
  customColor?: string;
  lightText?: boolean;
}

export default function MissionStepper({ 
  currentMissionIndex, 
  totalMissions = 5,
  customColor,
  lightText
}: MissionStepperProps) {
  const { colors } = useTheme();
  const activeColor = customColor || colors.primary;
  
  // Ensure we don't go out of bounds
  const activeIdx = Math.max(0, Math.min(currentMissionIndex, totalMissions - 1));

  return (
    <View style={styles.container}>
      {Array.from({ length: totalMissions }).map((_, index) => {
        const isActive = index === activeIdx;
        const isPast = index < activeIdx;
        
        return (
          <React.Fragment key={`step-${index}`}>
            {/* Step Node */}
            <View style={styles.stepWrapper}>
              <View 
                style={[
                  styles.node, 
                  { 
                    borderColor: isActive || isPast ? activeColor : (lightText ? 'rgba(255,255,255,0.3)' : colors.border),
                    backgroundColor: isActive || isPast ? activeColor : 'transparent'
                  },
                  isActive && [styles.activeNodeOuter, { borderColor: activeColor }]
                ]}
              >
                {isActive && (
                  <Animated.View entering={FadeIn} style={[styles.activeNodeInner, { backgroundColor: activeColor }]} />
                )}
                <Text 
                  style={[
                    styles.nodeText, 
                    { color: isActive || isPast ? '#fff' : (lightText ? 'rgba(255,255,255,0.6)' : colors.onSurfaceVariant) }
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {isActive && (
                <Animated.View entering={FadeIn} style={[styles.indicatorLine, { backgroundColor: activeColor }]} />
              )}
            </View>

            {/* Connecting Line (except for last node) */}
            {index < totalMissions - 1 && (
              <View 
                style={[
                  styles.line, 
                  { backgroundColor: isPast ? activeColor : (lightText ? 'rgba(255,255,255,0.2)' : colors.border) }
                ]} 
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4, // Reduced from 12
    paddingHorizontal: 20,
    width: '100%',
  },
  stepWrapper: {
    alignItems: 'center',
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeNodeOuter: {
    borderWidth: 1,
    padding: 2,
    backgroundColor: 'transparent',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  activeNodeInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    margin: 2,
    zIndex: -1,
  },
  nodeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: -4,
    zIndex: 1,
  },
  indicatorLine: {
    position: 'absolute',
    bottom: -10,
    width: 24,
    height: 3,
    borderRadius: 2,
  }
});
