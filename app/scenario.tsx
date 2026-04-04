import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Dimensions, Platform,
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
import { BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro';

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
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerLowest: '#ffffff',
  primaryFixed: '#c4ebd6',
  secondaryFixed: '#ffdcc4',
  tertiaryFixed: '#ffe088',
  onPrimaryFixedVariant: '#2b4e3e',
  onSecondaryFixedVariant: '#6f3800',
  onTertiaryFixedVariant: '#574500',
  surfaceVariant: '#e6e2dc',
  red: '#C1440E',
};

const MARKER_CHARS = [
  { color: C.red, name: 'Fatima' },
  { color: C.red, name: 'Marco' },
  { color: C.red, name: 'Yuki' },
];

export default function ScenarioScreen() {
  const router = useRouter();
  const [arabicExpanded, setArabicExpanded] = useState(false);

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={C.primary} />
          </TouchableOpacity>
          {/* Step dots: 4-dot progress, dot 3 active */}
          <View style={styles.stepDots}>
            <View style={[styles.stepDot]} />
            <View style={[styles.stepDot]} />
            <View style={[styles.stepDot, { backgroundColor: C.red }]} />
            <View style={[styles.stepDot]} />
          </View>
        </View>
        {/* ~2 min badge */}
        <View style={styles.timeBadge}>
          <MaterialCommunityIcons name="book-open-variant" size={14} color={C.primary} />
          <Text style={[styles.timeBadgeText, f('PlusJakartaSans-Bold')]}>~2 min</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero image ── */}
        <View style={styles.heroWrap}>
          <Image
            source={require('../assets/images/scenario-office.jpg')}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Badge & title over image */}
          <View style={styles.heroOverlay}>
            <View style={styles.redBadge}>
              <Text style={[styles.redBadgeText, f('PlusJakartaSans-Bold')]}>
                📍 Marrakech
              </Text>
            </View>
            <Text style={[styles.heroTitle, f('PlusJakartaSans-ExtraBold')]}>
              La réunion qui tourne mal
            </Text>
          </View>
        </View>

        {/* ── Scenario content card ── */}
        <View style={styles.card}>
          {/* Chips */}
          <View style={styles.chips}>
            <View style={[styles.chip, { backgroundColor: C.primaryFixed }]}>
              <MaterialCommunityIcons name="account-group" size={13} color={C.onPrimaryFixedVariant} />
              <Text style={[styles.chipText, { color: C.onPrimaryFixedVariant }, f('PlusJakartaSans-Bold')]}>
                4 personnages
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: C.secondaryFixed }]}>
              <MaterialCommunityIcons name="map-marker" size={13} color={C.onSecondaryFixedVariant} />
              <Text style={[styles.chipText, { color: C.onSecondaryFixedVariant }, f('PlusJakartaSans-Bold')]}>
                Bureau Atlas Int.
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: C.tertiaryFixed }]}>
              <MaterialCommunityIcons name="account-voice" size={13} color={C.onTertiaryFixedVariant} />
              <Text style={[styles.chipText, { color: C.onTertiaryFixedVariant }, f('PlusJakartaSans-Bold')]}>
                Communication
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Narrative text */}
          <View style={styles.narrative}>
            <Text style={[styles.narrativePar, f('BeVietnamPro-Medium')]}>
              Tu es stagiaire chez{' '}
              <Text style={{ color: C.primary, fontStyle: 'italic', fontWeight: '600' }}>
                Atlas International
              </Text>
              , une entreprise basée à{' '}
              <Text style={{ color: C.primary, fontStyle: 'italic', fontWeight: '600' }}>
                Marrakech
              </Text>
              , spécialisée dans l'architecture durable.
            </Text>

            <Text style={[styles.narrativePar, f('BeVietnamPro-Medium')]}>
              <Text style={{ color: C.red, fontWeight: '600' }}>Fatima</Text>, ta responsable RH,
              t'a demandé d'assister à une réunion stratégique avec{' '}
              <Text style={{ color: C.red, fontWeight: '600' }}>Marco</Text>, un consultant
              italien expert en matériaux, et{' '}
              <Text style={{ color: C.red, fontWeight: '600' }}>Yuki</Text>, une partenaire
              japonaise spécialisée dans les jardins zen urbains.
            </Text>

            <Text style={[styles.narrativePar, f('BeVietnamPro-Medium')]}>
              L'ambiance est tendue.{' '}
              <Text style={{ color: C.red, fontWeight: '600' }}>Marco</Text> parle fort, utilise
              de grands gestes et coupe systématiquement la parole à{' '}
              <Text style={{ color: C.red, fontWeight: '600' }}>Yuki</Text>. Cette dernière
              s'enferme dans un silence de plus en plus pesant.
            </Text>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={18} color={C.primary} />
              <Text style={[styles.infoText, f('PlusJakartaSans-SemiBold')]}>
                C'est le moment d'agir pour restaurer l'équilibre et la collaboration.
              </Text>
            </View>
          </View>

          {/* Arabic summary (collapsible) */}
          <View style={styles.arabicSection}>
            <TouchableOpacity
              style={styles.arabicHeader}
              onPress={() => setArabicExpanded(!arabicExpanded)}
            >
              <Text style={[styles.arabicHeaderText, f('PlusJakartaSans-Bold')]}>
                {'ملخص بالعربية'}
              </Text>
              <MaterialCommunityIcons
                name={arabicExpanded ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={C.primary}
              />
            </TouchableOpacity>
            {arabicExpanded && (
              <View style={styles.arabicBody}>
                <Text style={[styles.arabicBodyText, f('BeVietnamPro-Medium')]}>
                  {
                    'أنت متدرب في شركة "أطلس إنترناشيونال" بمراكش. طلبت منك فاطمة، مديرة الموارد البشرية، حضور اجتماع مع ماركو (إيطالي) ويوكي (يابانية). ماركو يقاطع يوكي باستمرار مما جعلها تلتزم الصمت. دورك هو التدخل لإنجاح التواصل.'
                  }
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Fixed bottom nav ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Text style={[styles.relireText, f('PlusJakartaSans-Bold')]}>Relire</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.92}
          onPress={() => router.push('/choix')}
        >
          <Text style={[styles.ctaBtnText, f('PlusJakartaSans-Bold')]}>
            J'ai compris — à moi de jouer !
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
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
    paddingBottom: 12,
    position: 'sticky' as any,
    top: 0,
    zIndex: 50,
    elevation: 2,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 4 },
  stepDots: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e6e2dc' },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  timeBadgeText: { fontSize: 12, fontWeight: '700', color: C.primary },

  scrollContent: { paddingTop: 8, flexGrow: 1 },

  heroWrap: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 6,
  },
  redBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  redBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 26 },

  card: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 32,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(191,201,193,0.1)',
    gap: 24,
  },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  chipText: { fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: C.surfaceVariant },

  narrative: { gap: 16 },
  narrativePar: { fontSize: 15, color: C.onSurface, lineHeight: 26, fontWeight: '500' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: C.surfaceContainerLow,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: { fontSize: 14, fontWeight: '600', color: C.primary, flex: 1, lineHeight: 20 },

  arabicSection: {
    backgroundColor: C.surfaceContainer,
    borderRadius: 12,
    overflow: 'hidden',
  },
  arabicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  arabicHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  arabicBody: { paddingHorizontal: 16, paddingBottom: 16 },
  arabicBodyText: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'right',
    fontWeight: '500',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(253,249,243,0.85)',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    gap: 16,
    alignItems: 'center',
  },
  relireText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#783d01',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  ctaBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: 99,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
});
