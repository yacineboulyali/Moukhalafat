import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_400Regular_Italic,
} from '@expo-google-fonts/be-vietnam-pro';

const { width, height } = Dimensions.get('window');

export default function IntroDefiScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Italic': BeVietnamPro_400Regular_Italic,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  return (
    <View style={styles.root}>
      {/* ── Full screen background illustration ── */}
      <Image
        source={require('../assets/images/marrakech-intro-bg.jpg')}
        style={styles.bg}
        resizeMode="cover"
      />
      {/* ── Dark gradient overlay from bottom ── */}
      <LinearGradient
        colors={['transparent', 'rgba(18,8,5,0.7)', '#120805']}
        locations={[0.1, 0.45, 0.85]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ── Top: Close button ── */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.glassBtn} onPress={() => router.push('/map')}>
          <MaterialCommunityIcons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Bottom Narrative Panel (55% of screen) ── */}
      <View style={styles.panel}>
        {/* Badge */}
        <View style={styles.badge}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#e9c349" />
          <Text style={[styles.badgeText, f('PlusJakartaSans-Bold')]}>
            Marrakech | مراكش
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={[styles.h1, f('PlusJakartaSans-ExtraBold')]}>
            La famille Ben Ali arrive à Marrakech !
          </Text>
          <Text style={[styles.h1Ar, f('BeVietnamPro-Medium')]} >
            {'عائلة بن علي تصل إلى مراكش!'}
          </Text>
        </View>

        {/* Description */}
        <Text style={[styles.desc, f('BeVietnamPro-Regular')]}>
          Le père de famille a trouvé une opportunité professionnelle dans une entreprise
          internationale de la Ville Rouge...
        </Text>

        {/* Dialogue frosted glass bubble */}
        <View style={styles.bubble}>
          <View style={styles.bubbleAvatar}>
            <Image
              source={require('../assets/images/avatar-mehdi.jpg')}
              style={styles.bubbleAvatarImg}
              resizeMode="cover"
            />
          </View>
          <View style={styles.bubbleContent}>
            <Text style={[styles.bubbleName, f('PlusJakartaSans-Bold')]}>Mehdi Ben Ali</Text>
            <Text style={[styles.bubbleText, f('BeVietnamPro-Italic')]}>
              « C'est à toi de jouer ! Aide-moi à bien communiquer ici... »
            </Text>
          </View>
        </View>

        {/* Step dots + CTA */}
        <View style={styles.ctaBlock}>
          {/* Step dots */}
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* CTA button */}
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.9}
            onPress={() => router.push('/fatima')}
          >
            <Text style={[styles.ctaText, f('PlusJakartaSans-Bold')]}>Découvrir le défi</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120805' },

  bg: {
    ...StyleSheet.absoluteFillObject,
  },

  topBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 20,
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingRight: 16,
    paddingBottom: 8,
  },
  glassBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    // backdrop-filter not native, use just the tinted bg
  },

  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    paddingTop: 16,
    gap: 20,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(233,195,73,0.4)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#ffe088', letterSpacing: 1 },

  titleBlock: { gap: 4 },
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
  },
  h1Ar: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    writingDirection: 'rtl',
    marginTop: 4,
  },

  desc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    maxWidth: '90%',
  },

  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bubbleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffab69',
    flexShrink: 0,
  },
  bubbleAvatarImg: { width: '100%', height: '100%' },
  bubbleContent: { flex: 1, gap: 4 },
  bubbleName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffab69',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bubbleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#fff',
    lineHeight: 20,
  },

  ctaBlock: { gap: 24, marginTop: 8 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffab69',
    shadowColor: 'rgba(255,171,105,0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtn: {
    backgroundColor: '#C1440E',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#C1440E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
