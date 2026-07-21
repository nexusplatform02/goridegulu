/**
 * GoogleMap — renders a real Google Maps embed via WebView.
 * No API key required; uses the classic maps.google.com/maps?output=embed URL.
 *
 * Props:
 *   lat / lng        — centre point (required)
 *   destLat/destLng  — if provided, shows a route from lat,lng → destLat,destLng
 *   zoom             — zoom level (default 17)
 *   satellite        — use hybrid satellite+labels view (default true)
 *   style            — additional View/WebView style
 */
import React, { useMemo } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

interface Props {
  lat: number;
  lng: number;
  destLat?: number;
  destLng?: number;
  zoom?: number;
  satellite?: boolean;
  style?: object;
}

function buildUrl(props: Props): string {
  const { lat, lng, destLat, destLng, zoom = 17, satellite = true } = props;
  // t=h → hybrid (satellite imagery + road/label overlay)
  // t=k → pure satellite (no labels)
  const tileType = satellite ? 't=h&' : '';
  if (destLat != null && destLng != null) {
    return `https://maps.google.com/maps?${tileType}saddr=${lat},${lng}&daddr=${destLat},${destLng}&output=embed`;
  }
  return `https://maps.google.com/maps?${tileType}q=${lat},${lng}&z=${zoom}&output=embed`;
}

// ─── Web platform: plain iframe ────────────────────────────────────────────
function GoogleMapWeb(props: Props) {
  const url = useMemo(() => buildUrl(props), [props.lat, props.lng, props.destLat, props.destLng]);
  return (
    <View style={[styles.fill, props.style]}>
      {/* @ts-ignore — iframe is valid on web */}
      <iframe
        src={url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

// ─── Native platform: WebView ───────────────────────────────────────────────
// Lazy-require so Metro doesn't try to resolve react-native-webview on web.
let NativeMap: React.ComponentType<Props> | null = null;
if (Platform.OS !== 'web') {
  const { WebView } = require('react-native-webview');
  NativeMap = function GoogleMapNative(props: Props) {
    const url = useMemo(() => buildUrl(props), [props.lat, props.lng, props.destLat, props.destLng]);
    return (
      <WebView
        source={{ uri: url }}
        style={[styles.fill, props.style]}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    );
  };
}

export function GoogleMap(props: Props) {
  if (Platform.OS === 'web') return <GoogleMapWeb {...props} />;
  if (NativeMap) return <NativeMap {...props} />;
  return <View style={[styles.fill, props.style]} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
