import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

export default function SearchingScreen() {
  const insets = useSafeAreaInsets();
  const [found, setFound] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // Pulse animation for the center dot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Expanding rings
  useEffect(() => {
    function animateRing(val: Animated.Value, delay: number) {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 1600, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    }
    Animated.parallel([
      animateRing(ring1, 0),
      animateRing(ring2, 800),
    ]).start();
  }, []);

  // Auto-find rider after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      setFound(true);
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const ringScale1 = ring1.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] });
  const ringOpacity1 = ring1.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.5, 0.2, 0] });
  const ringScale2 = ring2.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] });
  const ringOpacity2 = ring2.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.5, 0.2, 0] });

  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <View style={styles.root}>
      <MapBackground showRoute />

      {/* Back */}
      <TouchableOpacity
        style={[styles.backBtn, { top: topPad + 8 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Center animation */}
      <View style={styles.center} pointerEvents="none">
        {/* Rings */}
        <Animated.View style={[styles.ring, { transform: [{ scale: ringScale1 }], opacity: ringOpacity1 }]} />
        <Animated.View style={[styles.ring, { transform: [{ scale: ringScale2 }], opacity: ringOpacity2 }]} />
        {/* Center dot */}
        <Animated.View style={[styles.dot, { transform: [{ scale: pulse }] }]}>
          <Ionicons name="car-sport" size={28} color="#FFFFFF" />
        </Animated.View>
      </View>

      {/* Status label */}
      <View style={styles.statusWrap} pointerEvents="none">
        <Text style={styles.statusText}>
          {found ? 'Rider Found!' : 'Searching for riders...'}
        </Text>
        <Text style={styles.statusSub}>
          {found ? 'Ahmad M. is on the way · ETA 8 min' : '4 riders nearby'}
        </Text>
      </View>

      {/* Bottom card */}
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
          <View style={styles.riderRow}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={26} color="#00B14F" />
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Ahmad M.</Text>
              <Text style={styles.riderSub}>Motorcycle · Plate: ABC 1234</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.ratingText}>4.92 · 3,204 trips</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color="#00B14F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#00B14F" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.etaRow}>
            <Ionicons name="time-outline" size={16} color="#6B6B6B" />
            <Text style={styles.etaText}>Arriving in <Text style={styles.etaBold}>8 min</Text></Text>
          </View>

          <TouchableOpacity
            style={styles.trackBtn}
            activeOpacity={0.88}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.trackBtnText}>Track Rider</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  backBtn: {
    position: 'absolute', left: 16, zIndex: 20,
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },

  center: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2, borderColor: '#00B14F',
  },
  dot: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00B14F', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },

  statusWrap: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', top: '58%',
  },
  statusText: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  statusSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B6B6B', marginTop: 6 },

  // Searching sheet
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
  sheetTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', marginBottom: 12 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  nearbyDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  nearbyText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B6B6B' },
  cancelBtn: {
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 30,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#5A5A5A' },

  // Found card
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
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  chatBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  etaText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#5A5A5A' },
  etaBold: { fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  trackBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center',
  },
  trackBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
