import { Stack, useRouter, useSegments } from 'expo-router';
import { View, LogBox } from 'react-native';

// Suppress known deprecation warnings from React Native Web / Expo 51+
LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".',
]);
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';

import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import { dbService } from '../services/database';
import { syncCurriculum } from '../services/sync';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { 
  NotoSansArabic_400Regular,
  NotoSansArabic_700Bold 
} from '@expo-google-fonts/noto-sans-arabic';
import { 
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_700Bold 
} from '@expo-google-fonts/be-vietnam-pro';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { user, loading, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded, fontError] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'Noto Sans Arabic': NotoSansArabic_400Regular,
    'NotoSansArabic-Bold': NotoSansArabic_700Bold,
    'Be Vietnam Pro': BeVietnamPro_400Regular,
    'BeVietnamPro-Medium': BeVietnamPro_500Medium,
    'BeVietnamPro-Bold': BeVietnamPro_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // ─── Initialize DB and Sync ───
    const initDb = async () => {
      try {
        await dbService.init();
        // Load settings into store
        await useGameStore.getState().loadSettings();
        // Background sync if online
        syncCurriculum();
      } catch (err) {
        console.error('DB Init Error:', err);
      }
    };
    initDb();

    // ─── Dev Auto-Login ───
    if (__DEV__ && !user && !loading) {
      console.log('Dev Mode: Auto-authenticating test user...');
      setUser({
        id: 'dev-test-user-001',
        full_name: 'Mehdi Ben Ali',
        xp: 2450,
        level: 8,
        badges: ['mniqqa', 'tabraat'],
        created_at: new Date().toISOString()
      });
    }

    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'welcome' || segments[0] === 'accueil';
    const isSplashScreen = !segments.length || (segments[0] as string) === 'index';

    if (!user && !inOnboardingGroup && !isSplashScreen && !inAuthGroup) {
      router.replace('/accueil');
    } else if (user && inOnboardingGroup) {
      router.replace('/map');
    }
  }, [user, loading, segments]);

  const showZelligeNav = segments.length > 0 && 
    !['welcome', 'index'].includes(segments[0] as string) && 
    segments[0] !== '(auth)';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: showZelligeNav ? (56 + (insets.bottom > 0 ? insets.bottom - 10 : 10)) : 0 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {/* ── Initial Loading / Splash ── */}
          <Stack.Screen name="index"          options={{ animation: 'none' }} />
          <Stack.Screen name="accueil"        options={{ animation: 'fade' }} />
          
          {/* ── Onboarding flow ── */}
          <Stack.Screen name="welcome"        options={{ animation: 'fade' }} />

          {/* ── Core Hub ── */}
          <Stack.Screen name="map"            options={{ animation: 'fade' }} />
          <Stack.Screen name="profil"         options={{ animation: 'fade' }} />
          <Stack.Screen name="leaderboard"    options={{ animation: 'fade' }} />
          <Stack.Screen name="pedago"         options={{ animation: 'fade' }} />

          {/* ── Challenges ── */}
          <Stack.Screen name="intro-defi"     options={{ animation: 'slide_from_bottom' }} />

          {/* ── Global Modals / Settings ── */}
          <Stack.Screen name="settings"       options={{ presentation: 'modal' }} />
        </Stack>
      </View>

      {/* Global Navigation */}
      {showZelligeNav && <ZelligeBottomNav />}
      
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}
