import { Stack, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';
import { dbService } from '../services/database';
import { syncCurriculum } from '../services/sync';

export default function RootLayout() {
  const { user, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // ─── Initialize DB and Sync ───
    const initDb = async () => {
      try {
        await dbService.init();
        // Background sync if online
        syncCurriculum();
      } catch (err) {
        console.error('DB Init Error:', err);
      }
    };
    initDb();

    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'welcome' || segments[0] === 'accueil';
    const isSplashScreen = !segments.length || segments[0] === 'index';

    if (!user && !inOnboardingGroup && !isSplashScreen && !inAuthGroup) {
      router.replace('/accueil');
    } else if (user && inOnboardingGroup) {
      router.replace('/map');
    }
  }, [user, loading, segments]);

  const showZelligeNav = ['accueil', 'map', 'badges', 'profil', 'profil-classique', 'leaderboard', 'pedago'].includes(segments[0] as string);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* REMOVED scaling hack for Android touch alignment fixes */}
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

        {/* Global Navigation & Dev Tools */}
        {showZelligeNav && <ZelligeBottomNav />}
        {__DEV__ && <DevQuickNavLazy />}
        
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// Lazy load DevQuickNav only in dev to avoid it being included in prod builds at all
function DevQuickNavLazy() {
  const DevQuickNav = require('../components/DevQuickNav').default;
  return <DevQuickNav />;
}
