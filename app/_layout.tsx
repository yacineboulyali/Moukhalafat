import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* ── Onboarding flow ── */}
        <Stack.Screen name="index"          options={{ animation: 'none' }} />
        <Stack.Screen name="welcome"        options={{ animation: 'fade' }} />
        <Stack.Screen name="create-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="quiz"           options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="revelation"     options={{ animation: 'fade' }} />

        {/* ── Map Hub ── */}
        <Stack.Screen name="map"            options={{ animation: 'fade' }} />

        {/* ── Marrakech Challenge Flow ── */}
        <Stack.Screen name="marrakech"      options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="intro-defi"     options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="fatima"         options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="scenario"       options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="choix"          options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dilemme"        options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="resultat"       options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="minijeu"        options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dialogue"       options={{ animation: 'fade' }} />
        <Stack.Screen name="dashboard"      options={{ animation: 'fade' }} />

        {/* ── Legacy tabs (kept for compatibility) ── */}
        <Stack.Screen name="(tabs)"         options={{ headerShown: false }} />
        <Stack.Screen name="modal"          options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
