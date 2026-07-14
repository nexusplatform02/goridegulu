import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Platform,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

/** Format metres → "450 m" or "1.2 km" */
function fmtDist(m: number) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

// Simulated rider path waypoints (as fractions of screen W/H)
// Rider starts top-right and moves diagonally down to user location
const RIDER_START = { xFrac: 0.78, yFrac: 0.08 };
const USER_POS    = { xFrac: 0.50, yFrac: 0.38 };  // user pin visible above sheet

const INITIAL_DIST = 1800; // metres
const STEP_MS      = 500;  // update every 500 ms
const STEP_M       = 18;   // metres per step (~36 m/s = ~130 km/h... shrink for realism)

export default function SearchingScreen() {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  // ── State ────────────────────────────────────────────────────
  const [found, setFound]       = useState(false);
  const [distM, setDistM]       = useState(INITIAL_DIST);
  const etaMin = Math.max(1, Math.round(distM / 250));

  // ── Animated values ──────────────────────────────────────────
  const riderX  = useRef(new Animated.Value(W * RIDER_START.xFrac)).current;
  const riderY  = useRef(new Animated.Value(H * RIDER_START.yFrac)).current;
  const riderRot= useRef(new Animated.Value(0)).current;   // wobble
  const pulse   = useRef(new Animated.Value(1)).current;   // user-pin pulse
  const fadeIn  = useRef(new Animated.Value(0)).current;   // found card fade
  const searchRing1 = useRef(new Animated.Value(0)).current;
  const searchRing2 = useRef(new Animated.Value(0)).current;

  // ── Searching ring animation (while !found) ──────────────────
  useEffect(() => {
    function animRing(val: Animated.Value, delay: number) {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 1600, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    }
    const a = Animated.parallel([animRing(searchRing1, 0), animRing(searchRing2, 800)]);
    a.start();
    return () => a.stop();
  }, []);

  // ── User-pin pulse ───────────────────────────────────────────
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  // ── Rider wobble ─────────────────────────────────────────────
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(riderRot, { toValue: 8,  duration: 300, useNativeDriver: true }),
        Animated.timing(riderRot, { toValue: -8, duration: 300, useNativeDriver: true }),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  // ── Distance countdown + rider movement ──────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setDistM(prev => {
        const next = Math.max(0, prev - STEP_M);
        // progress 0→1 as dist goes from INITIAL→0
        const progress = 1 - next / INITIAL_DIST;
        const targetX = W * RIDER_START.xFrac + (W * USER_POS.xFrac - W * RIDER_START.xFrac) * progress;
        const targetY = H * RIDER_START.yFrac + (H * USER_POS.yFrac - H * RIDER_START.yFrac) * progress;
        Animated.spring(riderX, { toValue: targetX, useNativeDriver: false, speed: 12, bounciness: 0 }).start();
        Animated.spring(riderY, { toValue: targetY, useNativeDriver: false, speed: 12, bounciness: 0 }).start();
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [W, H]);

  // ── Auto-find after 3 seconds ────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setFound(true);
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Interpolations ───────────────────────────────────────────
  const ring1Scale   = searchRing1.interpolate({ inputRange: [0, 1], outputRange: [1, 3.2] });
  const ring1Opacity = searchRing1.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.45, 0.15, 0] });
  const ring2Scale   = searchRing2.interpolate({ inputRange: [0, 1], outputRange: [1, 3.2] });
  const ring2Opacity = searchRing2.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.45, 0.15, 0] });
  const riderRotDeg  = riderRot.interpolate({ inputRange: [-8, 8], outputRange: ['-8deg', '8deg'] });

  // Screen position for user pin marker (centre-ish of visible map)
  const userPinX = W * USER_POS.xFrac - 18; // offset by half marker size
  const userPinY = H * USER_POS.yFrac - 18;

  return (
    <View style={styles.root}>
      {/* ── Map ───────────────────────────────────────────────── */}
      <MapBackground showRoute />

      {/* ── User location pin (fixed, pulsing) ────────────────── */}
      <View
        pointerEvents="none"
        style={[styles.userPinWrap, { left: userPinX, top: userPinY }]}
      >
        {/* Pulse ring */}
        <Animated.View
          style={[styles.userPulseRing, { transform: [{ scale: pulse }], opacity: pulse.interpolate({ inputRange: [1, 1.3], outputRange: [0.4, 0] }) }]}
        />
        <View style={styles.userPinOuter}>
          <View style={styles.userPinInner} />
        </View>
        <Text style={styles.userPinLabel}>You</Text>
      </View>

      {/* ── Rider marker (animated) ───────────────────────────── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.riderMarker,
          {
            left: Animated.subtract(riderX, new Animated.Value(20)),
            top: Animated.subtract(riderY, new Animated.Value(20)),
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: riderRotDeg }] }}>
          <View style={styles.riderBubble}>
            <Ionicons name="bicycle" size={18} color="#FFFFFF" />
          </View>
        </Animated.View>
        {/* Live distance label above rider */}
        <View style={styles.riderDistBubble}>
          <Text style={styles.riderDistText}>{fmtDist(distM)}</Text>
        </View>
      </Animated.View>

      {/* ── Back button ───────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.backBtn, { top: topPad + 8 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* ── Searching animation (center of screen, !found only) ─ */}
      {!found && (
        <View style={styles.searchCenter} pointerEvents="none">
          <Animated.View style={[styles.searchRing, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />
          <Animated.View style={[styles.searchRing, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
          <View style={styles.searchDot}>
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </View>
        </View>
      )}

      {/* ── Status label ──────────────────────────────────────── */}
      <View style={styles.statusWrap} pointerEvents="none">
        <Text style={styles.statusText}>
          {found ? 'Rider Found!' : 'Searching for riders...'}
        </Text>
        <Text style={styles.statusSub}>
          {found
            ? `Ahmad M. is on the way · ${fmtDist(distM)} away`
            : '4 riders nearby'}
        </Text>
      </View>

      {/* ── Bottom sheet ──────────────────────────────────────── */}
      {!found ? (
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Finding the fastest rider for you</Text>
          <View style={styles.nearbyRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.nearbyDot}>
                <Ionicons name="bicycle" size={14} color="#00B14F" />
              </View>
            ))}
            <Text style={styles.nearbyText}>4 riders nearby</Text>
          </View>
          {/* Live distance */}
          <View style={styles.distRow}>
            <Ionicons name="navigate-circle-outline" size={18} color="#00B14F" />
            <Text style={styles.distLabel}>
              Nearest rider: <Text style={styles.distValue}>{fmtDist(distM)}</Text> away
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={[styles.sheet, styles.foundSheet,
            { paddingBottom: Math.max(insets.bottom, 20) + 8, opacity: fadeIn }]}
        >
          <View style={styles.handle} />

          {/* Live distance badge */}
          <View style={styles.liveDistRow}>
            <View style={[styles.liveDot, { backgroundColor: distM < 200 ? '#00B14F' : '#FF6B35' }]} />
            <Text style={styles.liveDistText}>
              Rider is <Text style={styles.liveDistVal}>{fmtDist(distM)}</Text> away
            </Text>
            <Text style={styles.etaBadge}>{etaMin} min</Text>
          </View>

          <View style={styles.riderRow}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={26} color="#00B14F" />
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Ahmad M.</Text>
              <Text style={styles.riderSub}>Motorcycle · Plate: UG ABC 1234</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.ratingText}>4.92 · 3,204 trips</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={20} color="#00B14F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#00B14F" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.trackBtn}
            activeOpacity={0.88}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.trackBtnText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Back button
  backBtn: {
    position: 'absolute', left: 16, zIndex: 30,
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },

  // User location pin
  userPinWrap: {
    position: 'absolute', width: 36, height: 56,
    alignItems: 'center', zIndex: 20,
  },
  userPulseRing: {
    position: 'absolute', top: -10, left: -10,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#00B14F',
  },
  userPinOuter: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, elevation: 6,
  },
  userPinInner: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF',
  },
  userPinLabel: {
    fontSize: 10, fontFamily: 'Inter_700Bold', color: '#00B14F',
    backgroundColor: '#FFFFFF', borderRadius: 4,
    paddingHorizontal: 4, paddingVertical: 1, marginTop: 3,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
  },

  // Rider marker
  riderMarker: {
    position: 'absolute', zIndex: 25,
    alignItems: 'center',
  },
  riderBubble: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#FFFFFF',
    shadowColor: '#FF6B35', shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
  },
  riderDistBubble: {
    backgroundColor: '#1A1A1A', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3, marginTop: 4,
  },
  riderDistText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },

  // Searching animation (center dot)
  searchCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  searchRing: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: '#00B14F',
  },
  searchDot: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00B14F', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },

  // Status label
  statusWrap: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', top: '56%',
  },
  statusText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  statusSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B6B6B', marginTop: 4 },

  // Sheets
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, elevation: 14,
    zIndex: 30,
  },
  foundSheet: {},
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0',
    alignSelf: 'center', marginBottom: 16,
  },

  // Searching sheet
  sheetTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', marginBottom: 12 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  nearbyDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  nearbyText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B6B6B' },
  distRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F0FCF5', borderRadius: 12, padding: 12, marginBottom: 16,
  },
  distLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#5A5A5A' },
  distValue: { fontFamily: 'Inter_700Bold', color: '#00B14F' },
  cancelBtn: {
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 30,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#5A5A5A' },

  // Found sheet
  liveDistRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF7F4', borderRadius: 12, padding: 12, marginBottom: 14,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveDistText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: '#5A5A5A' },
  liveDistVal: { fontFamily: 'Inter_700Bold', color: '#FF6B35' },
  etaBadge: {
    fontSize: 12, fontFamily: 'Inter_700Bold', color: '#00B14F',
    backgroundColor: '#E0F5EA', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },

  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  riderAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  riderSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  ratingText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#6B6B6B' },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 14 },
  trackBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center',
  },
  trackBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
