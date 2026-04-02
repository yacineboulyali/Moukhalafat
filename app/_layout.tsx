import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Splash Screen — entry point */}
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />

        {/* Welcome Screen */}
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
            animation: 'fade',         // smooth fade from splash
          }}
        />

        {/* Main app tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" hidden={false} />
    </>
  );
}
