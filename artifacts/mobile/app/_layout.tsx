import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Metro resolves this to utils/fonts.native.ts on iOS/Android (loads Inter)
// and utils/fonts.ts on web (empty map, system fonts used instead).
// @expo-google-fonts/inter is therefore NEVER imported on web, which
// permanently eliminates the "6000ms timeout exceeded" FontFaceObserver error.
import { fontMap } from '@/utils/fonts';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"               options={{ animation: 'none' }} />
      <Stack.Screen name="onboarding/location" options={{ animation: 'fade' }} />
      <Stack.Screen name="onboarding/country"  options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="(tabs)"              options={{ animation: 'fade' }} />
      <Stack.Screen name="transport"           options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap as Record<string, unknown>);

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
