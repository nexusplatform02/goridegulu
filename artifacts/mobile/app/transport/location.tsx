import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

const DESTINATIONS = [
  { id: '1', name: 'Central Market / Town Square', sub: '12 Market St, City Center', dist: '0.0 km' },
  { id: '2', name: 'Bus Terminal 1',               sub: '5 Terminal Rd, Downtown',  dist: '0.0 km' },
  { id: '3', name: 'Shopping Mall Main Entrance',  sub: '88 Commerce Ave, Midtown', dist: '0.1 km' },
];

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [selected, setSelected] = useState('1');
  const [query, setQuery] = useState('');

  function handleChoose() {
    router.push('/transport/confirm');
  }

  return (
    <View style={styles.root}>
      {/* ── Map background ───────────────────────────────────── */}
      <MapBackground showRoute={false} />

      {/* ── Top overlay ──────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        {/* Search input */}
        <View style={styles.searchBox}>
          <View style={styles.dotGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#AAAAAA"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {/* ── Preferred drop-off callout ───────────────────────── */}
      <View style={styles.calloutCard}>
        <View style={styles.calloutAvatar}>
          <Ionicons name="person" size={16} color="#888" />
        </View>
        <View>
          <Text style={styles.calloutTitle}>Preferred drop-off</Text>
          <Text style={styles.calloutSub}>(88% of users)</Text>
        </View>
        <View style={styles.calloutPin} />
      </View>

      {/* ── Center pin ───────────────────────────────────────── */}
      <View style={styles.centerPinWrap} pointerEvents="none">
        <Ionicons name="location" size={40} color="#00B14F" />
      </View>

      {/* ── Bottom sheet ─────────────────────────────────────── */}
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Main destination heading */}
        <View style={styles.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainDestTitle}>
              {DESTINATIONS.find(d => d.id === selected)?.name ?? '–'}
            </Text>
            <Text style={styles.mainDestSub}>
              {DESTINATIONS.find(d => d.id === selected)?.sub ?? ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={18} color="#5A5A5A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color="#5A5A5A" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Destination options */}
        {DESTINATIONS.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.destRow}
            activeOpacity={0.75}
            onPress={() => setSelected(dest.id)}
          >
            <View style={[styles.destDot, selected === dest.id && styles.destDotActive]}>
              {selected === dest.id
                ? <View style={styles.destDotInner} />
                : <Ionicons name="location-outline" size={14} color="#AAAAAA" />
              }
            </View>
            <View style={styles.destInfo}>
              <Text style={[styles.destName, selected === dest.id && styles.destNameActive]}>
                {dest.name}
              </Text>
              <Text style={styles.destDist}>{dest.dist}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-vertical" size={16} color="#C0C0C0" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* CTA button */}
        <TouchableOpacity style={styles.chooseBtn} activeOpacity={0.88} onPress={handleChoose}>
          <Text style={styles.chooseBtnText}>Choose This Destination</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Top bar
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 4,
  },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },

  // Callout
  calloutCard: {
    position: 'absolute', top: '28%', left: '30%',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
    zIndex: 15,
  },
  calloutAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEEEEE',
    alignItems: 'center', justifyContent: 'center',
  },
  calloutTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  calloutSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  calloutPin: {
    position: 'absolute', bottom: -8, left: '50%',
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // Center pin
  centerPinWrap: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },

  // Bottom sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 12,
    zIndex: 30,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0',
    alignSelf: 'center', marginBottom: 16,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 14 },
  mainDestTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  mainDestSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 8 },

  // Destination rows
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  destDot: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  destDotActive: { backgroundColor: '#E0F5EA' },
  destDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  destInfo: { flex: 1 },
  destName: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  destNameActive: { color: '#1A1A1A', fontFamily: 'Inter_600SemiBold' },
  destDist: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#AAAAAA', marginTop: 2 },
  iconBtn: { padding: 4 },

  // CTA
  chooseBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center', marginTop: 16,
  },
  chooseBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
