import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#fdf9f3',
  surface: '#fdf9f3',
  primary: '#2c4e3e',
  onPrimary: '#ffffff',
  secondaryContainer: '#ffab69',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  surfaceContainerLow: '#f7f3ed',
  tertiaryContainer: '#cca72f',
};

export default function AccueilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top 35%: Hero Illustration Section */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={['#FFF8F0', '#FFE8CC']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Subtle Zellige Texture Overlay */}
        <View style={StyleSheet.absoluteFillObject}>
          <Svg width={width} height={353}>
            {Array.from({ length: 15 }).map((_, i) =>
              Array.from({ length: 10 }).map((_, j) => (
                <View key={`${i}-${j}`} style={[styles.zelligeDot, { left: i * 30, top: j * 30 }]} />
              ))
            )}
          </Svg>
        </View>

        {/* Main Hero Image: Ben Ali Family */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/ben-ali-family-transparent.png')}
            style={styles.heroImage}
            resizeMode="contain"
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
          Suis la famille Ben Ali à travers le Maroc et développe tes compétences professionnelles en t'amusant.
        </Text>
      </View>

      {/* Bottom 25%: Action Buttons */}
      <SafeAreaView style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/map' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Créer un compte
            / أنشئ حساب</Text>
          <MaterialIcons name="arrow-forward" size={24} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => router.push('/profil' as any)}
        >
          <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </SafeAreaView>

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
        <Text style={styles.footerText}>© 2024 Le Voyage des Compétences</Text>
      </View>
    </SafeAreaView>
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
  zelligeDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#F4A261',
    opacity: 0.2,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '90%',
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
    fontFamily: 'Plus Jakarta Sans', // Fallback, should use Arabic font if available
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
