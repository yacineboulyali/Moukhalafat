import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

interface MissionTrackerProps {
  totalMissions: number;
  currentMissionIndex: number; // 0-indexed
  cityColor?: string;
}

export default function MissionTracker({ totalMissions, currentMissionIndex, cityColor }: MissionTrackerProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalMissions }).map((_, idx) => {
          const isCompleted = idx < currentMissionIndex;
          const isCurrent = idx === currentMissionIndex;
          
          return (
            <View key={idx} style={styles.stepWrapper}>
              <View 
                style={[
                  styles.segment, 
                  { backgroundColor: colors.border + '40' },
                  isCompleted && { backgroundColor: cityColor || colors.gold },
                  isCurrent && { backgroundColor: colors.surface, borderColor: cityColor || colors.gold, borderWidth: 2 }
                ]}
              >
                {isCompleted && (
                  <Animated.View entering={FadeIn}>
                    <MaterialIcons name="check" size={10} color="#fff" />
                  </Animated.View>
                )}
                {isCurrent && (
                   <View style={[styles.activeDot, { backgroundColor: cityColor || colors.gold }]} />
                )}
              </View>
              {idx < totalMissions - 1 && (
                <View style={[styles.connector, { backgroundColor: isCompleted ? (cityColor || colors.gold) : colors.border + '20' }]} />
              )}
            </View>
          );
        })}
      </View>
      <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
        Missions du Défi
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 10,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 6,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  connector: {
    width: 20,
    height: 3,
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.6,
  }
});
