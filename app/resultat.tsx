import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Dimensions, Platform,
} from 'react-native';
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

const { width } = Dimensions.get('window');

const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  primaryDark: '#2d6a4f',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  surfaceContainer: '#f1ede7',
  surfaceContainerLowest: '#ffffff',
  red: '#C1440E',
  redDark: '#a1390c',
  green: '#52B788',
  greenLight: '#D1FAE5',
  greenDark: '#065F46',
  orange: '#F4A261',
  orangeLight: 'rgba(244,162,97,0.1)',
  tertiaryContainer: '#cca72f',
  tertiaryFixed: '#ffe088',
  tertiary: '#735c00',
};

export default function ResultatScreen() {
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
      {/* ── TopAppBar ── */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <MaterialCommunityIcons name="city" size={24} color={C.primaryDark} />
          <View>
            <Text style={[styles.headerTitle, f('PlusJakartaSans-Bold')]}>Résultats intermédiaires</Text>
            <Text style={[styles.headerSub, f('PlusJakartaSans-Bold'), { textAlign: 'right' }]}>النتائج الأولية</Text>
          </View>
        </View>
        <View style={styles.appBarRight}>
          <View style={styles.badgeCity}>
            <Text style={[styles.badgeCityText, f('PlusJakartaSans-Bold')]}>MARRAKECH</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={22} color={C.outline} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Consequence Illustration Card */}
        <View style={styles.heroCard}>
          <Image
            source={require('../assets/images/resultat-meeting.jpg')}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroOverlayTop}>
            <View style={styles.greenBadge}>
              <MaterialCommunityIcons name="emoticon-happy-outline" size={14} color={C.greenDark} />
              <Text style={[styles.greenBadgeText, f('PlusJakartaSans-Bold')]}>
                Ambiance améliorée
              </Text>
            </View>
          </View>
          <View style={styles.heroOverlayBottom}>
            <Text style={[styles.heroText, f('PlusJakartaSans-ExtraBold')]}>
              La réunion continue...
            </Text>
          </View>
        </View>

        {/* 2. Decision Recap Cards */}
        <View style={styles.recapContainer}>
          {/* Decision 1 */}
          <View style={[styles.recapCard, { borderLeftColor: C.green }]}>
            <View style={styles.recapTop}>
              <View style={[styles.recapBadge, { backgroundColor: 'rgba(82,183,136,0.1)' }]}>
                <Text style={[styles.recapBadgeText, { color: C.green }, f('PlusJakartaSans-Bold')]}>
                  ✅ Excellent choix
                </Text>
              </View>
              <MaterialCommunityIcons name="dots-vertical" size={18} color="#d6d3d1" />
            </View>
            <View style={styles.recapBody}>
              <Text style={[styles.recapLabel, f('BeVietnamPro-Medium')]}>Votre action :</Text>
              <Text style={[styles.recapAction, f('PlusJakartaSans-SemiBold')]}>
                "J'interviens calmement pour recentrer la discussion"
              </Text>
            </View>
            <Text style={[styles.recapNote, f('BeVietnamPro-Medium')]}>
              Fatima approuve votre initiative.
            </Text>
          </View>

          {/* Decision 2 */}
          <View style={[styles.recapCard, { borderLeftColor: C.orange }]}>
            <View style={styles.recapTop}>
              <View style={[styles.recapBadge, { backgroundColor: C.orangeLight }]}>
                <Text style={[styles.recapBadgeText, { color: C.orange }, f('PlusJakartaSans-Bold')]}>
                  ⚡ Choix acceptable
                </Text>
              </View>
              <MaterialCommunityIcons name="dots-vertical" size={18} color="#d6d3d1" />
            </View>
            <View style={styles.recapBody}>
              <Text style={[styles.recapLabel, f('BeVietnamPro-Medium')]}>Votre action :</Text>
              <Text style={[styles.recapAction, f('PlusJakartaSans-SemiBold')]}>
                "Je propose de reformuler les points de désaccord"
              </Text>
            </View>
            <Text style={[styles.recapNote, f('BeVietnamPro-Medium')]}>
              Fatima reste prudente face à votre réaction.
            </Text>
          </View>
        </View>

        {/* 3. Consequence Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBorderTop} />
          <View style={styles.summaryContent}>
            <View style={styles.summaryTitleRow}>
              <View style={styles.summaryIconWrap}>
                <MaterialCommunityIcons name="handshake" size={20} color={C.red} />
              </View>
              <Text style={[styles.summaryTitle, f('PlusJakartaSans-Bold')]}>
                Conséquence de vos décisions
              </Text>
            </View>
            <Text style={[styles.summaryDesc, f('BeVietnamPro-Medium')]}>
              L'ambiance de la réunion s'est légèrement améliorée, mais la situation reste délicate. Marco semble plus attentif à vos interventions.
            </Text>
            <View style={styles.xpCard}>
              <Text style={[styles.xpText, f('PlusJakartaSans-SemiBold')]}>
                Tu gagneras environ <Text style={{ color: C.tertiary, fontWeight: '800' }}>⭐ +180 XP</Text> à la fin du défi
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* ── Bottom Action Shell ── */}
      <View style={styles.bottomShell}>
        <Text style={[styles.footerNote, f('BeVietnamPro-Medium')]}>
          Le défi n&apos;est pas terminé — une dernière épreuve t&apos;attend !
        </Text>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.92}
            onPress={() => router.push('/minijeu')}
          >
            <Text style={[styles.ctaBtnText, f('PlusJakartaSans-Bold')]}>Continuer le défi</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  appBar: {
    backgroundColor: C.bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 16,
    zIndex: 50,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { color: C.primaryDark, fontSize: 16, letterSpacing: -0.3 },
  headerSub: { color: '#a8a29e', fontSize: 12 },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeCity: {
    backgroundColor: C.red,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeCityText: { color: '#fff', fontSize: 10, letterSpacing: 1 },
  closeBtn: { padding: 4, backgroundColor: C.surfaceContainer, borderRadius: 20 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 16, flexGrow: 1 },

  heroCard: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 2,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlayTop: { position: 'absolute', top: 16, left: 16 },
  greenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  greenBadgeText: { color: C.greenDark, fontSize: 12 },
  heroOverlayBottom: { position: 'absolute', bottom: 16, left: 16 },
  heroText: { color: '#ffffff', fontSize: 15, letterSpacing: 0.5 },

  recapContainer: { gap: 16, marginBottom: 32 },
  recapCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderLeftWidth: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 20,
    elevation: 1,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  recapTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  recapBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  recapBadgeText: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  recapBody: { marginBottom: 8, gap: 4 },
  recapLabel: { fontSize: 12, color: '#78716c' },
  recapAction: { fontSize: 13, color: C.onSurface, lineHeight: 18 },
  recapNote: { fontSize: 12, color: '#a8a29e', fontStyle: 'italic' },

  summaryCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    marginBottom: 48,
  },
  summaryBorderTop: { height: 6, backgroundColor: C.red, width: '100%' },
  summaryContent: { padding: 24 },
  summaryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  summaryIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 14, color: C.onSurface, letterSpacing: -0.2 },
  summaryDesc: { fontSize: 14, color: '#57534e', lineHeight: 22, borderBottomWidth: 0, marginBottom: 24 },
  xpCard: {
    backgroundColor: 'rgba(255,224,136,0.3)',
    padding: 12,
    borderRadius: 8,
    borderColor: 'rgba(255,224,136,0.5)',
    borderWidth: 1,
    alignItems: 'center',
  },
  xpText: { color: '#735c00', fontSize: 12 },

  bottomShell: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNote: { fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 12 },
  bottomNav: {
    backgroundColor: 'rgba(253,249,243,0.9)',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 10,
  },
  ctaBtn: {
    width: '100%',
    backgroundColor: C.red,
    borderRadius: 99,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
});
