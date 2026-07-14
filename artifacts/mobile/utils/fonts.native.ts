// Native-only: load Inter from Google Fonts.
// Metro resolves this file on iOS/Android and fonts.ts on web, so
// @expo-google-fonts/inter is never imported on web → no FontFaceObserver.
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export const fontMap = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} as const;
