import { Stack, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import DevQuickNav from '../components/DevQuickNav';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ZelligeBottomNav } from '../components/ZelligeBottomNav';

export default function RootLayout() {
  const { user, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'welcome' || segments[0] === 'accueil';
    const isSplashScreen = !segments.length || segments[0] === 'index';

    if (!user && !inOnboardingGroup && !isSplashScreen && !inAuthGroup) {
      // Redirect to welcome if not logged in and not in onboarding or splash
      router.replace('/accueil');
    } else if (user && inOnboardingGroup) {
      // Redirect to map if logged in but trying to access onboarding
      router.replace('/map');
    }
    // We let SplashScreen (index) handle its own navigation
  }, [user, loading, segments]);

  const showZelligeNav = ['accueil', 'map', 'badges', 'profil', 'profil-classique', 'leaderboard', 'pedago'].includes(segments[0] as string);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Container for everything that should be scaled -5% */}
        <View style={{ 
          flex: 1, 
          width: '105.26%', 
          height: '105.26%', 
          alignSelf: 'center', 
          transform: [{ scale: 0.95 }] 
        }}>
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
            <Stack.Screen name="modal"          options={{ presentation: 'transparentModal', animation: 'fade' }} />
          </Stack>
        </View>

        {/* Global Navigations (Not scaled) */}
        {showZelligeNav && <ZelligeBottomNav />}
        <DevQuickNav />
        
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
