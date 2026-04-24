import { Stack, useRouter, useSegments } from 'expo-router';
import { View, LogBox, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';

import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { MainBottomNav } from '../components/MainBottomNav';
import { dbService } from '../services/database';
import { syncCurriculum } from '../services/sync';
import { diagnosticService } from '../services/DiagnosticService';
import { ErrorBoundary } from '../components/ErrorBoundary';
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

// Import web-specific styles
if (Platform.OS === 'web') {
  require('../assets/web.css');
}

// Suppress known deprecation warnings from React Native Web / Expo 51+
LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".',
]);

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { user, loading, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

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
        // Run diagnostics & self-healing first
        await diagnosticService.performFullCheck();
        
        await dbService.init();
        // Load settings into store
        await useGameStore.getState().loadSettings();
        // Background sync if online
        syncCurriculum(user?.id);
      } catch (err) {
        console.error('DB Init Error:', err);
      }
    };
    initDb();

    // ─── Dev Auto-Login ───
    if (__DEV__ && !user) {
      console.log('Dev Mode: Auto-authenticating test user...');
      setUser({
        id: '123e4567-e89b-12d3-a456-426614174000',
        full_name: 'Mehdi Ben Ali',
        xp: 2450,
        level: 8,
        badges: ['mniqqa', 'tabraat'],
        created_at: new Date().toISOString()
      });
    } else if (!__DEV__ && loading) {
      // Fallback for production if no user is found initially
      // (This should ideally be replaced by a real session check)
      const timer = setTimeout(() => {
        if (loading) {
          useAuthStore.setState({ loading: false });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'welcome' || segments[0] === 'accueil';
    const isSplashScreen = !segments.length || (segments[0] as string) === 'index';

    if (!user && !inOnboardingGroup && !isSplashScreen && !inAuthGroup) {
      setTimeout(() => router.replace('/accueil'), 0);
    } else if (user && (inOnboardingGroup || isSplashScreen)) {
      // Ensure we redirect to map if we land on onboarding or splash while logged in
      setTimeout(() => router.replace('/map'), 0);
    }
  }, [user, loading, segments]);

  const showBottomNav = segments.length > 0 && 
    !['welcome', 'index'].includes(segments[0] as string) && 
    segments[0] !== '(auth)';

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: isWeb ? '#F3F0EA' : undefined }}>
      <View style={isWeb ? styles.webWrapper : { flex: 1 }}>
        <View style={isWeb ? styles.webContainer : { flex: 1 }}>
          <View style={{ flex: 1 }}>
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

          {/* Global Navigation - Render inside webContainer to stay centered */}
          {showBottomNav && <MainBottomNav />}
        </View>
      </View>
      
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0EA',
  },
  webContainer: {
    width: '100%',
    maxWidth: 480, // Mobile portrait width
    height: '100%',
    maxHeight: 900, // Typical phone height
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    // Premium shadow for web
    ...Platform.select({
      web: {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: 24,
        marginVertical: 20,
      }
    }),
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootLayoutContent />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
