import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  surface: '#fdf9f3',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  primaryFixed: '#c4ebd6',
  tertiaryContainer: '#cca72f',
  secondaryContainer: '#ffab69',
  onPrimary: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f7f3ed',
  surfaceContainerHigh: '#ebe8e2',
};

interface SettingSectionProps {
  title: string;
  arabicTitle: string;
  color: string;
  children: React.ReactNode;
}

const SettingSection = ({ title, arabicTitle, color, children }: SettingSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIndicator, { backgroundColor: color }]} />
      <Text style={styles.sectionTitle}>
        {title} <Text style={styles.sectionArabic}>{arabicTitle}</Text>
      </Text>
    </View>
    {children}
  </View>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { themeMode, setTheme, colors } = useTheme();
  const [username, setUsername] = useState('Ahmed_AlMaghribi');
  const [language, setLanguage] = useState('fr');

  const COLORS_DYNAMIC = colors;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient
        colors={[COLORS.surface, '#f1ede7']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => router.back()}
          >
            <MaterialIcons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Zellige Odyssey</Text>
          <View style={styles.headerAvatarContainer}>
            <Image
               source={require('../assets/images/settings-avatar.png')}
               style={styles.headerAvatar}
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Edit Section */}
        <View style={styles.profileEditSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCard}>
              <Image
                source={require('../assets/images/settings-avatar.png')}
                style={styles.profileAvatar}
              />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <MaterialIcons name="edit" size={20} color={COLORS.onPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.pageTitle}>Paramètres du profil</Text>
          <Text style={styles.pageSubtitle}>إعدادات الملف الشخصي</Text>
          
          <View style={styles.inputCard}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
              <Text style={styles.inputLabelArabic}>اسم المستخدم</Text>
            </View>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

        {/* Display Settings */}
        <SettingSection 
          title="Mode d'affichage" 
          arabicTitle="وضع العرض" 
          color={COLORS.tertiaryContainer}
        >
          <View style={styles.modeGrid}>
            <TouchableOpacity 
              style={[
                styles.modeBtn, 
                themeMode === 'light' && styles.modeBtnActive
              ]}
              onPress={() => setTheme('light')}
            >
              <MaterialIcons 
                name="light-mode" 
                size={24} 
                color={themeMode === 'light' ? colors.white : colors.onSurfaceVariant} 
              />
              <View style={styles.modeTextContainer}>
                <Text style={[styles.modeText, themeMode === 'light' && styles.modeTextActive]}>Clair</Text>
                <Text style={[styles.modeTextArabic, themeMode === 'light' && styles.modeTextActive]}>مضيء</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.modeBtnInactive,
                themeMode === 'dark' && styles.modeBtnActive
              ]}
              onPress={() => setTheme('dark')}
            >
              <MaterialIcons 
                name="dark-mode" 
                size={24} 
                color={themeMode === 'dark' ? colors.white : colors.onSurfaceVariant} 
              />
              <View style={styles.modeTextContainer}>
                <Text style={[styles.modeText, themeMode === 'dark' && styles.modeTextActive]}>Sombre</Text>
                <Text style={[styles.modeTextArabic, themeMode === 'dark' && styles.modeTextActive]}>مظلم</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.modeBtnInactive,
                themeMode === 'system' && styles.modeBtnActive
              ]}
              onPress={() => setTheme('system')}
            >
              <MaterialIcons 
                name="settings-brightness" 
                size={24} 
                color={themeMode === 'system' ? colors.white : colors.onSurfaceVariant} 
              />
              <View style={styles.modeTextContainer}>
                <Text style={[styles.modeText, themeMode === 'system' && styles.modeTextActive]}>Système</Text>
                <Text style={[styles.modeTextArabic, themeMode === 'system' && styles.modeTextActive]}>النظام</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SettingSection>

        {/* Language Settings */}
        <SettingSection 
          title="Langue d'affichage" 
          arabicTitle="لغة العرض" 
          color={COLORS.secondaryContainer}
        >
          <View style={styles.languageCard}>
            <TouchableOpacity 
              style={[
                styles.langBtn, 
                language === 'fr' && styles.langBtnActive
              ]}
              onPress={() => setLanguage('fr')}
            >
              <Text style={[styles.langBtnText, language === 'fr' && styles.langBtnTextActive]}>Français</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.langBtn, 
                language === 'ar' && styles.langBtnActive
              ]}
              onPress={() => setLanguage('ar')}
            >
              <Text style={[styles.langBtnText, language === 'ar' && styles.langBtnTextActive]}>العربية</Text>
            </TouchableOpacity>
          </View>
        </SettingSection>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.9}>
            <View style={styles.saveBtnContent}>
              <Text style={styles.saveBtnText}>Enregistrer les modifications</Text>
              <Text style={styles.saveBtnTextArabic}>حفظ التغييرات</Text>
            </View>
            <MaterialIcons name="save" size={24} color={COLORS.onPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BlurView intensity={80} tint="light" style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 16), height: 60 + Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/leaderboard')}>
          <MaterialIcons name="leaderboard" size={24} color="#426655" />
          <Text style={styles.navText}>Ligue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/map')}>
          <MaterialIcons name="map" size={24} color="#426655" />
          <Text style={styles.navText}>Carte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profil')}>
          <MaterialIcons name="person" size={24} color="#426655" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="settings" size={24} color="#fff" />
          <Text style={styles.navTextActive}>RÉGLAGES</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fdf9f3',
    zIndex: 40,
  },
  headerContent: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
    letterSpacing: -0.5,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 99,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryFixed,
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 160,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  profileEditSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarCard: {
    width: 128,
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLowest,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#1c1c18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  inputLabelArabic: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    opacity: 0.6,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.onSurface,
    fontWeight: '500',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 40,
    height: 4,
    borderRadius: 99,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionArabic: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
    marginLeft: 8,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modeBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  modeBtnInactive: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  modeTextContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  modeTextArabic: {
    fontSize: 10,
    opacity: 0.8,
    color: COLORS.onSurfaceVariant,
  },
  modeTextActive: {
    color: COLORS.onPrimary,
  },
  languageCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 8,
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  langBtnActive: {
    backgroundColor: COLORS.primaryFixed,
  },
  langBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  langBtnTextActive: {
    color: COLORS.primary,
  },
  saveContainer: {
    marginTop: 20,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  saveBtnContent: {
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
  saveBtnTextArabic: {
    fontSize: 14,
    color: COLORS.onPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(191, 201, 193, 0.15)',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#426655',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
