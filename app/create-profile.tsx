import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
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
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ── Design tokens ──────────────────────────────────────
const C = {
  bg: '#fdf9f3',
  primary: '#2c4e3e',
  primaryDark: '#2d6a4f',
  surface: '#fdf9f3',
  surfaceContainer: '#f1ede7',
  surfaceContainerHighest: '#e6e2dc',
  outlineVariant: '#bfc9c1',
  outline: '#707973',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  primaryFixed: '#c4ebd6',
};

// Avatar data
const AVATARS = [
  { id: 0, img: require('../assets/images/avatar-default.jpg'), color: '#40916c' },
  { id: 1, img: require('../assets/images/avatar-1.jpg'), color: '#a855f7' },
  { id: 2, img: require('../assets/images/avatar-2.jpg'), color: '#ec4899' },
  { id: 3, img: require('../assets/images/avatar-3.jpg'), color: '#f97316' },
  { id: 4, img: require('../assets/images/avatar-4.jpg'), color: '#ef4444' },
  { id: 5, img: require('../assets/images/avatar-5.jpg'), color: '#3b82f6' },
  { id: 6, img: require('../assets/images/avatar-6.jpg'), color: '#22c55e' },
];

// Decorative diamond motif (top-right corner)
function DiamondMotif() {
  return (
    <View style={styles.motifWrap} pointerEvents="none">
      <Svg width={192} height={192} opacity={0.1}>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <Path
              key={`${row}-${col}`}
              d={`M${col * 48 + 24},${row * 48} L${col * 48 + 48},${row * 48 + 24} L${col * 48 + 24},${row * 48 + 48} L${col * 48},${row * 48 + 24} Z`}
              fill="#F4A261"
            />
          ))
        )}
      </Svg>
    </View>
  );
}

export default function CreateProfileScreen() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [name, setName] = useState('');

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
  });
  const f = (name: string) => (fontsLoaded ? { fontFamily: name } : {});

  return (
    <View style={styles.root}>
      <DiamondMotif />

      {/* ── TopAppBar ── */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={C.primaryDark} />
          </TouchableOpacity>
          {/* Step dots: 1 filled, 2 empty */}
          <View style={styles.stepDots}>
            <View style={[styles.dot, { backgroundColor: C.primary }]} />
            <View style={[styles.dot, { backgroundColor: C.surfaceContainerHighest }]} />
            <View style={[styles.dot, { backgroundColor: C.surfaceContainerHighest }]} />
          </View>
        </View>
        <Text style={[styles.stepLabel, f('PlusJakartaSans-Bold')]}>1/3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Title ── */}
        <View style={styles.titleBlock}>
          <Text style={[styles.h1, f('PlusJakartaSans-Bold')]}>Crée ton profil</Text>
          <Text style={[styles.arabicSub, f('BeVietnamPro-Medium')]}>{'أنشئ ملفك الشخصي'}</Text>
        </View>

        {/* ── Avatar Zone ── */}
        <View style={styles.avatarZone}>
          {/* Main preview */}
          <View style={styles.avatarPreviewWrap}>
            <View style={styles.avatarPreview}>
              <Image
                source={AVATARS[selectedAvatar].img}
                style={styles.avatarPreviewImg}
                resizeMode="cover"
              />
            </View>
            {/* Check badge */}
            <View style={styles.checkBadge}>
              <MaterialCommunityIcons name="check" size={14} color="#fff" />
            </View>
          </View>

          {/* Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            style={styles.carouselScroll}
          >
            {AVATARS.map((av) => (
              <TouchableOpacity
                key={av.id}
                onPress={() => setSelectedAvatar(av.id)}
                style={[styles.carouselItem, { borderColor: av.color }]}
              >
                <Image source={av.img} style={styles.carouselItemImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Name input */}
          <View style={styles.inputWrap}>
            <Text style={[styles.inputLabel, f('PlusJakartaSans-SemiBold')]}>
              Prénom / الاسم الأول
            </Text>
            <TextInput
              style={[styles.input, f('BeVietnamPro-Medium')]}
              placeholder="ex: Yassine"
              placeholderTextColor={C.outline}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Specialty picker */}
          <View style={styles.pickerLabelWrap}>
            <Text style={[styles.pickerLabel, f('PlusJakartaSans-SemiBold')]}>
              Ta filière OFPPT
            </Text>
          </View>
          <TouchableOpacity style={styles.picker}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIcon}>
                <MaterialCommunityIcons name="school" size={22} color={C.primary} />
              </View>
              <Text style={[styles.pickerText, f('BeVietnamPro-Medium')]}>
                Sélectionne ta filière...
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={22} color={C.outline} />
          </TouchableOpacity>
        </View>

        {/* bottom spacer for fixed CTA */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Fixed bottom CTA ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.92}
          onPress={() => router.push('/quiz')}
        >
          <Text style={[styles.ctaBtnText, f('PlusJakartaSans-Bold')]}>Continuer</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
          <View style={styles.ctaDivider} />
          <Text style={[styles.ctaArabic, f('BeVietnamPro-Medium')]}>{'متابعة'}</Text>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Help FAB ── */}
      <TouchableOpacity style={styles.helpFab}>
        <MaterialCommunityIcons name="help-circle-outline" size={24} color={C.primaryDark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  motifWrap: { position: 'absolute', top: 0, right: 0, zIndex: 0 },

  // AppBar
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 16,
    backgroundColor: C.bg,
    zIndex: 10,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 4 },
  stepDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  stepLabel: { fontSize: 14, fontWeight: '700', color: C.primaryDark },

  // Scroll content
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, zIndex: 5 },

  // Title
  titleBlock: { alignItems: 'center', marginBottom: 32 },
  h1: { fontSize: 24, fontWeight: '700', color: C.onSurface, lineHeight: 30, textAlign: 'center' },
  arabicSub: { fontSize: 16, color: 'rgba(28,28,24,0.6)', writingDirection: 'rtl', marginTop: 4 },

  // Avatar zone
  avatarZone: { alignItems: 'center', marginBottom: 40 },
  avatarPreviewWrap: { position: 'relative', marginBottom: 24 },
  avatarPreview: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: C.primaryDark,
    padding: 3,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarPreviewImg: { width: '100%', height: '100%', borderRadius: 99 },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  carouselScroll: { width: '100%' },
  carousel: { paddingHorizontal: 8, gap: 16, paddingVertical: 8 },
  carouselItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    flexShrink: 0,
  },
  carouselItemImg: { width: '100%', height: '100%' },

  // Form
  form: { gap: 20 },
  inputWrap: { position: 'relative' },
  inputLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: C.bg,
    paddingHorizontal: 8,
    fontSize: 11,
    fontWeight: '600',
    color: C.primary,
    zIndex: 10,
  },
  input: {
    height: 56,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.outlineVariant,
    color: C.onSurface,
    fontSize: 15,
    fontWeight: '500',
  },
  pickerLabelWrap: { marginBottom: -12, marginLeft: 16 },
  pickerLabel: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant },
  picker: {
    height: 64,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.outlineVariant,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pickerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c4ebd6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: { fontSize: 14, color: C.outline, fontWeight: '500' },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(253,249,243,0.9)',
  },
  ctaBtn: {
    height: 56,
    backgroundColor: C.primary,
    borderRadius: 28,
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
  ctaBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  ctaDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 4 },
  ctaArabic: { fontSize: 14, color: '#fff', fontWeight: '500' },

  // Help FAB
  helpFab: {
    position: 'absolute',
    bottom: 128,
    right: 24,
    backgroundColor: '#f1ede7',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(191,201,193,0.2)',
  },
});
