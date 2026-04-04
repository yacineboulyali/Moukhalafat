import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Animated, Dimensions, Platform, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_500Medium,
  BeVietnamPro_400Regular_Italic,
} from '@expo-google-fonts/be-vietnam-pro';

const { width, height } = Dimensions.get('window');

export default function FatimaScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Italic': BeVietnamPro_400Regular_Italic,
  });
  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const CHAR_W = Math.min(320, width * 0.8);
  const CHAR_H = (CHAR_W * 4) / 3;

  return (
    <View style={styles.root}>
      {/* ── Fixed blurred background ── */}
      <Image
        source={require('../assets/images/fatima-character.jpg')}
        style={styles.blurredBg}
        resizeMode="cover"
        blurRadius={16}
      />
      {/* Light overlay */}
      <View style={styles.lightOverlay} />

      {/* ── Fixed header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1b4332" />
        </TouchableOpacity>

        {/* Step dots: 4 total, dot 2 active */}
        <View style={styles.stepDots}>
          <View style={[styles.stepDot, { backgroundColor: 'rgba(193,68,14,0.3)' }]} />
          <View style={[styles.stepDot, { backgroundColor: '#C1440E' }]} />
          <View style={[styles.stepDot, { backgroundColor: '#e6e2dc' }]} />
          <View style={[styles.stepDot, { backgroundColor: '#e6e2dc' }]} />
        </View>

        <TouchableOpacity style={styles.glassBtn}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#1b4332" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── NPC illustration zone ── */}
        <View style={[styles.npcZone, { height: CHAR_H + 32 }]}>
          {/* Greeting bubble (bouncing, top-right) */}
          <Animated.View
            style={[styles.greetingBubble, { transform: [{ translateY: bounceAnim }] }]}
          >
            <Text style={[styles.greetingText, f('PlusJakartaSans-Bold')]}>Marhaba ! 👋</Text>
          </Animated.View>

          {/* Character image */}
          <View style={[styles.charImgWrap, { width: CHAR_W, height: CHAR_H }]}>
            <Image
              source={require('../assets/images/fatima-character.jpg')}
              style={styles.charImg}
              resizeMode="cover"
            />
          </View>

          {/* Identity pill */}
          <View style={styles.identityPill}>
            <Text style={[styles.pillName, f('PlusJakartaSans-ExtraBold')]}>
              Fatima Bennani
            </Text>
            <Text style={[styles.pillRole, f('BeVietnamPro-Medium')]}>Responsable RH</Text>
            <View style={styles.pillLocation}>
              <Text style={[styles.pillLocationText, f('PlusJakartaSans-Bold')]}>
                Marrakech 🏙️
              </Text>
            </View>
          </View>
        </View>

        {/* ── Message panel ── */}
        <View style={styles.msgPanel}>
          {/* Message 1 */}
          <View style={styles.msgBlock}>
            <Text style={[styles.msgText, f('BeVietnamPro-Medium')]}>
              {'« Bienvenue à Marrakech ! Je suis '}
              <Text style={{ fontWeight: '700', color: '#2c4e3e' }}>Fatima</Text>
              {', votre guide pour cette étape. »'}
            </Text>
            <Text style={[styles.msgAr, f('BeVietnamPro-Italic')]}>
              {'« مرحبًا بكم في مراكش! أنا فاطمة، مرشدتكم لهذه المرحلة. »'}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Message 2 */}
          <View style={styles.msgBlock}>
            <Text style={[styles.msgText, f('BeVietnamPro-Medium')]}>
              « Notre équipe vient de plusieurs pays pour partager son savoir-faire. »
            </Text>
            <Text style={[styles.msgAr, f('BeVietnamPro-Italic')]}>
              {'« فريقنا يأتي من عدة دول لمشاركة خبراته. »'}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* CTA text */}
          <View style={styles.ctaTextBlock}>
            <Text style={[styles.ctaQuestion, f('PlusJakartaSans-Bold')]}>
              Es-tu prêt(e) à relever le défi ? 💪
            </Text>
          </View>

          {/* 3D style CTA button */}
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.9}
            onPress={() => router.push('/scenario')}
          >
            <Text style={[styles.ctaBtnText, f('PlusJakartaSans-ExtraBold')]}>
              Je suis prêt(e) !
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fdf9f3' },

  blurredBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  lightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253,249,243,0.55)',
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 12,
  },
  glassBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  stepDots: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },

  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    flexGrow: 1,
  },

  npcZone: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 32,
  },
  greetingBubble: {
    position: 'absolute',
    top: '12%',
    right: '10%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderBottomRightRadius: 0,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(191,201,193,0.2)',
    zIndex: 10,
  },
  greetingText: { fontSize: 15, fontWeight: '700', color: '#2c4e3e' },

  charImgWrap: {
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 5,
  },
  charImg: { width: '100%', height: '100%', objectFit: 'cover' } as any,

  identityPill: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: '75%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    zIndex: 20,
    gap: 4,
  },
  pillName: { fontSize: 18, fontWeight: '800', color: '#2c4e3e', textAlign: 'center' },
  pillRole: { fontSize: 14, color: '#404943', fontWeight: '500' },
  pillLocation: {
    marginTop: 4,
    backgroundColor: '#ffdcc4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  pillLocationText: { fontSize: 10, fontWeight: '700', color: '#2f1400', textTransform: 'uppercase', letterSpacing: 1 },

  msgPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.6)',
  },
  msgBlock: { gap: 4 },
  msgText: { fontSize: 15, color: '#1c1c18', lineHeight: 24, fontWeight: '500' },
  msgAr: {
    fontSize: 13,
    color: 'rgba(64,73,67,0.8)',
    fontStyle: 'italic',
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: 'rgba(191,201,193,0.1)', marginVertical: 4 },

  ctaTextBlock: { alignItems: 'center', paddingVertical: 8 },
  ctaQuestion: { fontSize: 18, fontWeight: '700', color: '#C1440E', textAlign: 'center', lineHeight: 26 },

  ctaBtn: {
    backgroundColor: '#C1440E',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // 3D shadow effect
    borderBottomWidth: 6,
    borderBottomColor: '#8B2E09',
    shadowColor: '#8B2E09',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
    marginBottom: 8,
  },
  ctaBtnText: { fontSize: 19, fontWeight: '800', color: '#fff' },
});
