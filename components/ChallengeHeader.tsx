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
  /** Called when the X (close) button is pressed. Defaults to router.back(). */
  onClose?: () => void;
  /** @deprecated use onClose instead */
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
  onClose,
  onBack
}: ChallengeHeaderProps) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Automate finding the active mission index if not explicitly provided
  const { missionId } = useLocalSearchParams();
  const { missions } = useMissions(cityId);
  const calculatedIndex = missions?.findIndex(m => m.id === missionId);
  const finalMissionIndex = propMissionIndex !== undefined ? propMissionIndex : Math.max(0, calculatedIndex);

  // Effective close handler: onClose > onBack > router.back()
  const handleClose = onClose ?? onBack ?? (() => {
    if (router.canGoBack()) router.back();
    else router.replace('/map');
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          {/* Always show Close / X button */}
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>

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
      
      <View style={{ marginTop: 4 }}>
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
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    opacity: 0.6,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
