import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUGGESTIONS = [
  { id: '1', icon: 'time-outline' as const, name: 'Central Market',       addr: '12 Market St, City Center' },
  { id: '2', icon: 'time-outline' as const, name: 'City Bus Terminal',    addr: '5 Terminal Rd, Downtown' },
  { id: '3', icon: 'bookmark-outline' as const, name: 'Merlion Park',     addr: '1 Fullerton Rd, Waterfront' },
];

export default function TransportScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transport</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="map-outline" size={20} color="#1A1A1A" />
          <Text style={styles.mapLabel}>Map</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Hero card ──────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Green top */}
          <View style={styles.heroGreen}>
            <Image
              source={require('../../assets/images/vehicle-car.png')}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>

          {/* White bottom */}
          <View style={styles.heroWhite}>
            <Text style={styles.heroTitle}>Transport</Text>
            <Text style={styles.heroSubtitle}>
              Wherever you're going, let's get{'\n'}you there!
            </Text>

            {/* Where to? bar */}
            <TouchableOpacity
              style={styles.whereToBar}
              activeOpacity={0.85}
              onPress={() => router.push('/transport/location')}
            >
              <View style={styles.whereToLeft}>
                <Ionicons name="location-outline" size={18} color="#8A8A8A" />
                <Text style={styles.whereToText}>Where to?</Text>
              </View>
              <TouchableOpacity style={styles.nowBtn} activeOpacity={0.85}>
                <Text style={styles.nowText}>Now</Text>
                <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Pickup section ─────────────────────────────────────── */}
        <View style={styles.pickupSection}>
          <Text style={styles.pickupLabel}>Directions to pickup point</Text>

          <TouchableOpacity style={styles.pickupSelector} activeOpacity={0.8}>
            <Ionicons name="location" size={16} color="#1A1A1A" />
            <Text style={styles.pickupSelectorText}>Main Entrance, Ground Floor</Text>
            <Ionicons name="chevron-down" size={16} color="#1A1A1A" />
            <TouchableOpacity style={styles.navIcon}>
              <Ionicons name="navigate-outline" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Photo thumbnails */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            <View style={styles.photoCard}>
              <View style={[styles.photoPlaceholder, { backgroundColor: '#C8E6B8' }]}>
                <Ionicons name="storefront-outline" size={32} color="#6B9E6B" />
              </View>
              <View style={styles.photoStep}>
                <Text style={styles.photoStepNum}>1</Text>
              </View>
              <Text style={styles.photoCaption}>Exit through main{'\n'}entrance doors.</Text>
            </View>
            <View style={styles.photoCard}>
              <View style={[styles.photoPlaceholder, { backgroundColor: '#D4E8F8' }]}>
                <Ionicons name="walk-outline" size={32} color="#5B8BB0" />
              </View>
              <View style={styles.photoStep}>
                <Text style={styles.photoStepNum}>2</Text>
              </View>
              <Text style={styles.photoCaption}>Walk to the pickup{'\n'}zone on your right.</Text>
            </View>
          </ScrollView>
        </View>

        {/* ── Suggested places ───────────────────────────────────── */}
        <View style={styles.suggestSection}>
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.suggestRow}
              activeOpacity={0.75}
              onPress={() => router.push('/transport/location')}
            >
              <View style={styles.suggestIcon}>
                <Ionicons name={s.icon} size={18} color="#6B6B6B" />
              </View>
              <View style={styles.suggestInfo}>
                <Text style={styles.suggestName}>{s.name}</Text>
                <Text style={styles.suggestAddr}>{s.addr}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  mapLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },

  // Hero card
  heroCard: {
    margin: 16, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  heroGreen: {
    backgroundColor: '#00B14F', height: 180,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  carImage: { width: 260, height: 170, marginBottom: -10 },
  heroWhite: { backgroundColor: '#FFFFFF', padding: 18, paddingTop: 20 },
  heroTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 4 },
  heroSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B6B6B', marginBottom: 16, lineHeight: 20 },

  whereToBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 14, padding: 12, gap: 10,
    backgroundColor: '#F9F9F9',
  },
  whereToLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  whereToText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#AAAAAA' },
  nowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#00B14F', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  nowText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  // Pickup section
  pickupSection: { paddingHorizontal: 16, paddingTop: 4, backgroundColor: '#FFFFFF' },
  pickupLabel: { fontSize: 12, color: '#AAAAAA', fontFamily: 'Inter_400Regular', marginBottom: 8 },
  pickupSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, marginBottom: 14,
  },
  pickupSelectorText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },
  navIcon: { padding: 4 },

  photoScroll: { marginBottom: 8 },
  photoCard: { width: 160, marginRight: 12 },
  photoPlaceholder: {
    width: 160, height: 110, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  photoStep: {
    position: 'absolute', top: 8, left: 8,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
  },
  photoStepNum: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  photoCaption: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#5A5A5A', lineHeight: 17 },

  // Suggestions
  suggestSection: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  suggestRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F8F8F8',
  },
  suggestIcon: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  suggestInfo: { flex: 1 },
  suggestName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  suggestAddr: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },
});
