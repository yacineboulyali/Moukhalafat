import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor 
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useGameStore } from '../stores/gameStore';

const { width } = Dimensions.get('window');

export default function FamilyTrustGauge() {
  const familyTrust = useGameStore((state) => state.familyTrust);
  const COLORS = THEME.light;

  const barStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${familyTrust}%`),
      backgroundColor: interpolateColor(
        familyTrust,
        [0, 50, 100],
        ['#FF5252', '#FFA000', '#4CAF50'] // Rouge -> Orange -> Vert
      ),
    };
  });

  const getStatusLabel = () => {
    if (familyTrust >= 80) return "Confiance Totale";
    if (familyTrust >= 50) return "Soutien Stable";
    if (familyTrust >= 30) return "Doutes";
    return "Méfiance";
  };

  const getStatusIcon = () => {
    if (familyTrust >= 80) return "family-restroom";
    if (familyTrust >= 50) return "favorite";
    return "warning";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelGroup}>
          <MaterialIcons name={getStatusIcon() as any} size={18} color={COLORS.primary} />
          <Text style={styles.title}>Jauge de Confiance Familiale</Text>
        </View>
        <Text style={styles.value}>{familyTrust}%</Text>
      </View>

      <View style={styles.gaugeTrack}>
        <Animated.View style={[styles.gaugeFill, barStyle]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
        <Text style={styles.arabicLabel}>ثقة العائلة</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.light.primary,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.light.gold,
  },
  gaugeTrack: {
    height: 10,
    backgroundColor: '#F1EDE7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.light.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  arabicLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.light.gold,
  },
});
