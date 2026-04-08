import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';

export default function RootLayout() {
  const { user, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'welcome' || segments[0] === 'index' || segments[0] === 'accueil';

    if (!user && !inOnboardingGroup) {
      // Redirect to welcome if not logged in and not in onboarding
      router.replace('/accueil');
    } else if (user && inOnboardingGroup) {
      // Redirect to map if logged in but trying to access onboarding
      router.replace('/map');
    }
  }, [user, loading, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        {/* ── Initial Loading / Splash ── */}
        <Stack.Screen name="index"          options={{ animation: 'none' }} />
        <Stack.Screen name="accueil"        options={{ animation: 'fade' }} />
        
        {/* ── Onboarding flow ── */}
        <Stack.Screen name="welcome"        options={{ animation: 'fade' }} />
        <Stack.Screen name="create-profile" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="quiz"           options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="revelation"     options={{ animation: 'fade' }} />

        {/* ── Core Hub ── */}
        <Stack.Screen name="map"            options={{ animation: 'fade' }} />
        <Stack.Screen name="profil"         options={{ animation: 'fade' }} />
        <Stack.Screen name="portfolio"      options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="leaderboard"    options={{ animation: 'fade' }} />
        <Stack.Screen name="competence-detail" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="pedago"         options={{ animation: 'fade' }} />

        {/* ── Challenges ── */}
        <Stack.Screen name="marrakech"      options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="intro-defi"     options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="scenario"       options={{ animation: 'fade' }} />
        <Stack.Screen name="choix"          options={{ animation: 'fade' }} />
        <Stack.Screen name="resultat"       options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="minijeu"        options={{ animation: 'fade' }} />

        {/* ── Global Modals / Settings ── */}
        <Stack.Screen name="settings"       options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal"          options={{ presentation: 'transparentModal', animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
