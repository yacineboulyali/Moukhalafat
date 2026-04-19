import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ChallengeTimer from './ChallengeTimer';
import MissionStepper from './MissionStepper';
import { useTheme } from '../hooks/useTheme';
import { useMissions } from '../hooks/useMissions';

interface ChallengeHeaderProps {
  cityId: string;
  hasTimer?: boolean;
  timerDuration?: number;
  missionIndex?: number;
  totalMissions?: number;
  onTimeUp?: () => void;
  onSkip?: () => void;
  onReset?: () => void;
  onPrevious?: () => void;
  onRestart?: () => void;
  onBack?: () => void;
}

export const ChallengeHeader = ({ 
  cityId, 
  hasTimer = true, 
  timerDuration = 90, 
  missionIndex: propMissionIndex,
  totalMissions = 5,
  onTimeUp,
  onSkip,
  onReset,
  onPrevious,
  onRestart,
  onBack
}: ChallengeHeaderProps) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Automate finding the active mission index if not explicitly provided
  const { missionId } = useLocalSearchParams();
  const { missions } = useMissions(cityId);
  const calculatedIndex = missions?.findIndex(m => m.id === missionId);
  const finalMissionIndex = propMissionIndex !== undefined ? propMissionIndex : Math.max(0, calculatedIndex);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          {onBack && (
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={onBack}
            >
              <MaterialIcons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            <Text style={[styles.missionLabel, { color: colors.onSurfaceVariant }]}>
              MISSION {finalMissionIndex + 1} / {totalMissions}
            </Text>
            {missions && missions[finalMissionIndex] && (
              <Text 
                style={[styles.missionTitle, { color: colors.primary }]} 
                numberOfLines={1}
              >
                {missions[finalMissionIndex].title_fr}
              </Text>
            )}
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {hasTimer && (
            <ChallengeTimer duration={timerDuration} onTimeUp={onTimeUp || (() => router.back())} />
          )}

          {onRestart && (
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={onRestart}
            >
              <MaterialIcons name="replay" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={{ marginTop: 10 }}>
        <MissionStepper currentMissionIndex={finalMissionIndex} totalMissions={totalMissions} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    width: '100%',
  },
  missionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    opacity: 0.6,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
