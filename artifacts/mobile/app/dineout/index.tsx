import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Nearby', 'Fine Dining', 'Rooftop', 'Buffet'];

const RESTAURANTS = [
  {
    id: '1',
    image: require('../../assets/images/snacks.jpg'),
    name: 'The Royal Garden',
    badge: 'Popular',
    badgeColor: '#00B14F',
    time: '7:00 PM',
    rating: 4.8,
    cuisine: 'International',
    priceRange: '$$',
    tables: 3,
    distance: '0.4 km',
  },
  {
    id: '2',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Sakura Japanese Bistro',
    badge: '20% OFF',
    badgeColor: '#E53935',
    time: '7:30 PM',
    rating: 4.6,
    cuisine: 'Japanese',
    priceRange: '$$$',
    tables: 5,
    distance: '1.2 km',
  },
  {
    id: '3',
    image: require('../../assets/images/chicken-fries.jpg'),
    name: 'Mzinga Rooftop Bar',
    badge: 'New',
    badgeColor: '#1565C0',
    time: '8:00 PM',
    rating: 4.5,
    cuisine: 'African Fusion',
    priceRange: '$$',
    tables: 8,
    distance: '0.9 km',
  },
  {
    id: '4',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'La Bella Italia',
    badge: 'Top Rated',
    badgeColor: '#6A1B9A',
    time: '6:30 PM',
    rating: 4.9,
    cuisine: 'Italian',
    priceRange: '$$$',
    tables: 2,
    distance: '2.1 km',
  },
];

export default function DineOutListScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = activeFilter === 'All'
    ? RESTAURANTS
    : RESTAURANTS.filter(r =>
        activeFilter === 'Nearby'
          ? parseFloat(r.distance) < 1
          : r.cuisine.toLowerCase().includes(activeFilter.toLowerCase()) ||
            r.name.toLowerCase().includes(activeFilter.toLowerCase())
      );

  return (
    <View style={styles.root}>

      {/* ── Fixed top section ── */}
      <View style={[styles.topSection, { paddingTop: topPad + 8 }]}>

        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={15} color="#AAAAAA" />
            <TextInput
              style={styles.searchInput}
              placeholder="Find a place to dine..."
              placeholderTextColor="#BBBBBB"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Dine Out</Text>
          <Text style={styles.pageSubtitle}>Book a table at top restaurants</Text>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Scrollable restaurant list ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => router.push(`/dineout/${item.id}` as any)}
          >
            {/* Image */}
            <View style={styles.cardImageWrap}>
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
              <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={11} color="#FFC107" />
                <Text style={styles.ratingText}> {item.rating}</Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>

              <View style={styles.metaRow}>
                <Ionicons name="restaurant-outline" size={12} color="#8A8A8A" />
                <Text style={styles.metaText}>  {item.cuisine} · {item.priceRange}</Text>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.footerLeft}>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={12} color="#8A8A8A" />
                    <Text style={styles.metaText}>  {item.distance}</Text>
                  </View>
                  <View style={[styles.metaRow, { marginTop: 2 }]}>
                    <Ionicons name="time-outline" size={12} color="#8A8A8A" />
                    <Text style={styles.metaText}>  Next: {item.time}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.bookBtn}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/dineout/${item.id}` as any)}
                >
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },

  /* ── Fixed top section ── */
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 4,
  },

  headerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 22, paddingHorizontal: 14, height: 42,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1A1A1A', fontFamily: 'PlusJakartaSans_400Regular' },

  titleBlock: { paddingHorizontal: 16, marginBottom: 12 },
  pageTitle: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  pageSubtitle: { fontSize: 13, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },

  filterRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 28, backgroundColor: '#F2F2F2',
  },
  chipActive: { backgroundColor: '#00B14F' },
  chipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#5A5A5A' },
  chipTextActive: { color: '#FFFFFF', fontFamily: 'PlusJakartaSans_600SemiBold' },

  /* ── List ── */
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 22, marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },

  cardImageWrap: { position: 'relative' },
  cardImage: { width: '100%', height: 160 },

  badge: {
    position: 'absolute', top: 10, left: 10,
    borderRadius: 28, paddingHorizontal: 8, paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },

  ratingPill: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  ratingText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFA000' },

  cardBody: { padding: 14, gap: 6 },
  cardName: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },

  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular' },

  footerRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', marginTop: 4,
  },
  footerLeft: { gap: 4 },

  bookBtn: {
    backgroundColor: '#00B14F', borderRadius: 28,
    paddingHorizontal: 20, paddingVertical: 9,
  },
  bookBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },
});
