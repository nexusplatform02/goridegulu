import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// @expo-google-fonts injects CSS @font-face rules at import time on web.
// When the CDN is unreachable the FontFaceObserver inside useFonts rejects
// with "Xms timeout exceeded" — as an *unhandled* Promise rejection because
// it escapes the try/catch inside the hook.  Suppress it here so the app
// continues to render using system fonts.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const msg: string = (event.reason as Error)?.message ?? '';
    if (msg.includes('timeout exceeded')) {
      event.preventDefault();
    }
  });
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"              options={{ animation: 'none' }} />
      <Stack.Screen name="onboarding/location" options={{ animation: 'fade' }} />
      <Stack.Screen name="onboarding/country"  options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="(tabs)"              options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(
    Platform.OS === 'web'
      ? {} // on web pass empty map – fonts fall back to system; the unhandled-
           // rejection handler above silences the observer timeout
      : { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold }
  );

  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
