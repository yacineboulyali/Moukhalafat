import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { THEME } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const COLORS = THEME.light; // Default for onboarding

const ASSETS_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets';

export default function AccueilScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top 35%: Hero Illustration Section */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Subtle Zellige Texture Overlay */}
        <View style={StyleSheet.absoluteFillObject}>
          <Svg width={width} height={353}>
            {Array.from({ length: 15 }).map((_, i) =>
              Array.from({ length: 10 }).map((_, j) => (
                <Circle 
                  key={`${i}-${j}`} 
                  cx={i * 30} 
                  cy={j * 30} 
                  r={1} 
                  fill="#F4A261" 
                  opacity={0.2} 
                />
              ))
            )}
          </Svg>
        </View>

        {/* Main Hero Image: Ben Ali Family */}
        <View style={styles.imageContainer}>
          <Video
            source={{ uri: `${ASSETS_URL}/welcome_video.mp4` }}
            style={styles.heroImage}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted
          />
        </View>

        {/* Decorative Arch Overlay */}
        <View style={styles.archOverlay} />
      </View>

      {/* Middle 30%: Content Block */}
      <View style={styles.contentSection}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Bienvenue dans le Voyage !</Text>
          <Text style={styles.arabicTitle}>أهلاً بك في رحلة المهارات!</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.description}>
          Suis la famille Ben Ali à travers le Maroc et développe tes compétences professionnelles en t’amusant.
        </Text>
      </View>

      {/* Bottom 25%: Action Buttons */}
      <View style={[styles.actionSection, { paddingBottom: Math.max(insets.bottom, 48) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/welcome')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Démarrer l&apos;Aventure</Text>
          <MaterialIcons name="auto-fix-high" size={24} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.zelligeStrip}>
          <View style={styles.stripLine} />
          <View style={styles.gridWrapper}>
            {Array.from({ length: 10 }).map((_, i) => (
              <MaterialIcons key={i} name="grid-view" size={10} color={COLORS.onSurfaceVariant} style={{ opacity: 0.3, marginHorizontal: 8 }} />
            ))}
          </View>
        </View>
        <Text style={styles.footerText}>© 2026 Le Voyage des Compétences</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    height: 353,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '90%',
    transform: [{ scale: 1.05 }],
  },
  archOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.onSurface,
    textAlign: 'center',
    lineHeight: 34,
  },
  arabicTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.outline,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 2,
    marginVertical: 24,
  },
  description: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 16,
  },
  primaryButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: COLORS.onPrimary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 32,
    alignItems: 'center',
  },
  zelligeStrip: {
    width: '100%',
    height: 32,
    backgroundColor: COLORS.surfaceContainerLow,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 1,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.4,
  },
  gridWrapper: {
    flexDirection: 'row',
    opacity: 0.3,
  },
  footerText: {
    fontSize: 12,
    color: '#426655',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    zIndex: 1,
  },
});
