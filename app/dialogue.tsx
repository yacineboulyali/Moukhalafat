import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Dimensions, Platform, ImageBackground,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  BounceIn,
  SlideInUp,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  primaryFixedDim: '#a9cfba',
  secondaryFixed: '#ffdcc4',
  tertiaryFixed: '#ffe088',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  surfaceContainerLowest: '#ffffff',
  red: '#C1440E',
  orange: '#F4A261',
  tertiary: '#735c00',
  tertiaryContainer: '#cca72f',
};

export default function DialogueScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });

  const f = (n: string) => (fontsLoaded ? { fontFamily: n } : {});

  return (
    <View style={styles.root}>
      {/* ── Top Navigation Anchor ── */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="close" size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, f('PlusJakartaSans-Bold')]}>Le Voyage</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>

      {/* Background Hero Section (Marrakech Rooftop Dusk) */}
      <View style={styles.heroBgWrap}>
        <ImageBackground
          source={require('../assets/images/dialogue-bg.jpg')}
          style={styles.heroBg}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'transparent', C.bg]}
            style={StyleSheet.absoluteFillObject}
          />
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Titles */}
        <Animated.View style={styles.titleWrap} entering={FadeInDown.duration(500).delay(100).springify().damping(18)}>
          <View style={styles.badgeWrap}>
            <Text style={[styles.badgeTxt, f('PlusJakartaSans-Bold')]}>Marrakech ✓</Text>
          </View>
          <Text style={[styles.titleFr, f('PlusJakartaSans-ExtraBold')]}>🏆 Défi terminé !</Text>
          <Text style={[styles.titleAr, f('PlusJakartaSans-Bold')]}>انتهى التحدي ! 🏆</Text>
        </Animated.View>

        {/* Family Illustration */}
        <Animated.View style={styles.familyImgWrap} entering={FadeInDown.duration(600).delay(200).springify().damping(20)}>
          <Image
            source={require('../assets/images/dialogue-family.jpg')}
            style={styles.familyImg}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Speech Bubbles */}
        <View style={styles.bubblesWrap}>
          {/* Papa */}
          <Animated.View style={[styles.bubbleRow, { flexDirection: 'row' }]} entering={FadeInLeft.duration(450).delay(400).springify().damping(16)}>
            <View style={[styles.avatarCirc, { backgroundColor: C.primaryFixedDim }]}>
              <MaterialCommunityIcons name="account" size={20} color={C.primary} />
            </View>
            <View style={[styles.bubbleBubble, styles.bubbleLeft]}>
              <Text style={[styles.bubbleFr, f('PlusJakartaSans-Medium')]}>
                &quot;Tu as su garder ton calme dans une situation difficile. C&apos;est ça, la vraie communication.&quot;
              </Text>
              <Text style={[styles.bubbleAr, { color: C.primary }, f('BeVietnamPro-Medium')]}>
                "حافظت على هدوئك في موقف صعب."
              </Text>
            </View>
          </Animated.View>

          {/* Maman */}
          <Animated.View style={[styles.bubbleRow, { flexDirection: 'row-reverse' }]} entering={FadeInRight.duration(450).delay(600).springify().damping(16)}>
            <View style={[styles.avatarCirc, { backgroundColor: C.secondaryFixed }]}>
              <MaterialCommunityIcons name="face-woman" size={20} color="#8e4e14" />
            </View>
            <View style={[styles.bubbleBubble, styles.bubbleRight]}>
              <Text style={[styles.bubbleFr, f('PlusJakartaSans-Medium'), { textAlign: 'right' }]}>
                &quot;Comprendre les autres cultures, c&apos;est un cadeau précieux pour ta carrière.&quot;
              </Text>
              <Text style={[styles.bubbleAr, { color: '#8e4e14', textAlign: 'left' }, f('BeVietnamPro-Medium')]}>
                "فهم الثقافات الأخرى هدية قيّمة لمسيرتك المهنية."
              </Text>
            </View>
          </Animated.View>

          {/* Mehdi */}
          <Animated.View style={[styles.bubbleRow, { flexDirection: 'row' }]} entering={FadeInLeft.duration(450).delay(800).springify().damping(16)}>
            <View style={[styles.avatarCirc, { backgroundColor: C.tertiaryFixed }]}>
              <MaterialCommunityIcons name="emoticon-happy" size={20} color={C.tertiary} />
            </View>
            <View style={[styles.bubbleBubble, styles.bubbleLeft]}>
              <Text style={[styles.bubbleFr, f('PlusJakartaSans-Medium')]}>
                "Grâce à toi, la réunion s'est bien terminée ! On est fiers de toi 🎉"
              </Text>
              <Text style={[styles.bubbleAr, { color: C.tertiary }, f('BeVietnamPro-Medium')]}>
                "!بفضلك، انتهى الاجتماع بشكل جيد! نحن فخورون بك 🎉"
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Lesson Panel */}
        <Animated.View style={styles.lessonPanel} entering={SlideInUp.duration(500).delay(900).springify().damping(20)}>
          <LinearGradient
            colors={[C.red, C.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.lessonTopBorder}
          />
          <View style={styles.lessonBody}>
            <Text style={[styles.lessonTitle, f('PlusJakartaSans-Bold')]}>La communication interculturelle</Text>
            <Text style={[styles.lessonTitleAr, f('BeVietnamPro-Medium')]}>التواصل بين الثقافات</Text>
            
            <Text style={[styles.lessonDesc, f('BeVietnamPro-Medium')]}>
              Dans un contexte professionnel multiculturel, écouter activement et reformuler les idées de chacun permet de désamorcer les tensions et de construire des relations de confiance durables.
            </Text>

            <View style={styles.skillCard}>
              <View style={styles.skillIcon}>
                <MaterialCommunityIcons name="star-circle" size={24} color="#fff" />
              </View>
              <View>
                <Text style={[styles.skillSub, f('PlusJakartaSans-Bold')]}>COMMUNICATION INTERCULTURELLE</Text>
                <Text style={[styles.skillStatus, f('PlusJakartaSans-SemiBold')]}>Débloquée ✨</Text>
              </View>
            </View>

            <View style={styles.xpWrap}>
              <MaterialCommunityIcons name="star-four-points" size={16} color={C.tertiaryContainer} />
              <Text style={[styles.xpTxt, f('PlusJakartaSans-Bold')]}>Tu vas gagner environ +240 XP</Text>
            </View>

            <TouchableOpacity style={styles.ctaWrapper} activeOpacity={0.9} onPress={() => router.push('/dashboard')}>
              <LinearGradient
                colors={[C.red, C.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaInner}
              >
                <Text style={[styles.ctaTxt, f('PlusJakartaSans-Bold')]}>Voir mes résultats → 🏆</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  
  appBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16,
    zIndex: 50, backgroundColor: 'transparent',
  },
  appBarTitle: { fontSize: 18, color: C.primary, letterSpacing: -0.5 },
  iconBtn: { padding: 4 },

  heroBgWrap: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.55 },
  heroBg: { width: '100%', height: '100%' },

  scrollContent: { paddingTop: 20 },
  
  titleWrap: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 24 },
  badgeWrap: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  badgeTxt: { color: C.primary, fontSize: 12, letterSpacing: 0.5 },
  titleFr: { fontSize: 24, color: C.onSurface, letterSpacing: -0.5, marginBottom: 4 },
  titleAr: { fontSize: 20, color: C.onSurface },

  familyImgWrap: { alignItems: 'center', justifyContent: 'flex-end', height: 260, marginBottom: 32, paddingHorizontal: 24 },
  familyImg: { flex: 1, height: undefined, width: '100%', aspectRatio: 1.2, borderRadius: 16 },

  bubblesWrap: { paddingHorizontal: 24, gap: 16, marginBottom: 48 },
  bubbleRow: { alignItems: 'flex-start', gap: 12 },
  avatarCirc: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bubbleBubble: { backgroundColor: C.surfaceContainerLowest, padding: 16, borderRadius: 24, maxWidth: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  bubbleLeft: { borderTopLeftRadius: 4 },
  bubbleRight: { borderTopRightRadius: 4 },
  bubbleFr: { fontSize: 14, color: C.onSurface, lineHeight: 20, marginBottom: 8 },
  bubbleAr: { fontSize: 14, textAlign: 'right' },

  lessonPanel: {
    backgroundColor: C.surfaceContainerLowest,
    borderTopLeftRadius: 48, borderTopRightRadius: 48,
    shadowColor: C.onSurface, shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.06, shadowRadius: 40, elevation: 12,
    overflow: 'hidden',
  },
  lessonTopBorder: { height: 8, width: '100%' },
  lessonBody: { padding: 32 },
  lessonTitle: { fontSize: 18, color: '#8e4e14', marginBottom: 4 },
  lessonTitleAr: { fontSize: 18, color: '#8e4e14', opacity: 0.8, textAlign: 'left', marginBottom: 16 },
  lessonDesc: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22, marginBottom: 24 },
  
  skillCard: { backgroundColor: '#D1FAE5', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  skillIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  skillSub: { fontSize: 10, color: C.primary, letterSpacing: 0.5, marginBottom: 2 },
  skillStatus: { fontSize: 14, color: C.primary },

  xpWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 },
  xpTxt: { fontSize: 14, color: C.onSurface },

  ctaWrapper: { borderRadius: 99, overflow: 'hidden', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  ctaInner: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
});
