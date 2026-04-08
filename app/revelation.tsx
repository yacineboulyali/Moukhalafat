import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function RevelationScreen() {
  const COLORS = THEME.light;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, '#080C0A']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        <Animated.View 
          entering={ZoomIn.duration(1000)}
          style={styles.revelationCircle}
        >
          <MaterialIcons name="auto-awesome" size={40} color={COLORS.gold} />
          <Text style={styles.revelationLabel}>ARCHÉTYPE DÉCOUVERT</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(500).duration(800)}
          style={styles.resultCard}
        >
          <Image 
            source={require('../assets/images/avatar-stratege.jpg')} 
            style={styles.archetypeImage} 
          />
          <Text style={styles.archetypeTitle}>LE STRATÈGE</Text>
          <Text style={styles.archetypeArabic}>المخطط الاستراتيجي</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Tu as l'oeil pour les détails et une capacité naturelle à anticiper les obstacles. 
            Ta vision aidera la famille Ben Ali à conquérir les marchés les plus difficiles.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+50</Text>
              <Text style={styles.statLabel}>Logique</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+30</Text>
              <Text style={styles.statLabel}>Vision</Text>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.replace('/map')}
        >
          <Text style={styles.exploreButtonText}>ENTRER DANS LE MAROC</Text>
          <MaterialIcons name="explore" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revelationCircle: {
    alignItems: 'center',
    marginBottom: 40,
  },
  revelationLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    width: '100%',
    padding: 32,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  archetypeImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: THEME.light.gold,
    marginBottom: 20,
  },
  archetypeTitle: {
    fontSize: 32,
    fontWeight: '950',
    color: THEME.light.primary,
  },
  archetypeArabic: {
    fontSize: 24,
    color: THEME.light.gold,
    fontWeight: '700',
    marginBottom: 20,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1.5,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.light.primary,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.light.onSurfaceVariant,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  exploreButton: {
    backgroundColor: THEME.light.gold,
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 40,
  },
  exploreButtonText: {
    color: THEME.light.primary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
