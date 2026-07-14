// Web fallback: empty font map — system sans-serif is used instead.
// @expo-google-fonts/inter is intentionally NOT imported here; importing it
// on web injects CSS @font-face rules that trigger a FontFaceObserver which
// throws an uncaught "6000ms timeout exceeded" error when the CDN is blocked.
export const fontMap: Record<string, unknown> = {};
