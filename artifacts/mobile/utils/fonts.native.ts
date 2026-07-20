// Native-only: load Plus Jakarta Sans from Google Fonts.
// Metro resolves this file on iOS/Android and fonts.ts on web, so
// @expo-google-fonts/plus-jakarta-sans is never imported on web.
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export const fontMap = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} as const;
