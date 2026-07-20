import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = ['Nearby', 'Popular', 'Cuisines'];

const RESTAURANTS = [
  {
    id: '1',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Woke Ramen - Chan...',
    discount: '10% OFF',
    time: 50,
    rating: 4.5,
    cuisine: 'Chinese',
    price: '2.10',
    original: '5.10',
  },
  {
    id: '2',
    image: require('../../assets/images/chicken-fries.jpg'),
    name: 'Good Taste Mala H...',
    discount: '50% OFF',
    time: 35,
    rating: 4.2,
    cuisine: 'Local & Malaysian',
    price: '5.80',
    original: '8.80',
  },
  {
    id: '3',
    image: require('../../assets/images/snacks.jpg'),
    name: 'Singa Cafe - UE Biz...',
    discount: '10% OFF',
    time: 40,
    rating: 4.2,
    cuisine: 'Western',
    price: '4.00',
    original: '7.00',
  },
  {
    id: '4',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Toko Burgers at Al M...',
    discount: '10% OFF',
    time: 40,
    rating: 4.5,
    cuisine: 'Western',
    price: '5.30',
    original: '8.30',
  },
];

export default function FoodListScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={15} color="#AAAAAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Would you like to eat something?"
            placeholderTextColor="#BBBBBB"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveFilter(f)}
          >
            {f === 'Nearby' && (
              <Image source={require('../../assets/images/icon-transport.png')} style={styles.chipIcon} />
            )}
            {f === 'Popular' && (
              <Image source={require('../../assets/images/icon-food.png')} style={styles.chipIcon} />
            )}
            {f === 'Cuisines' && (
              <Image source={require('../../assets/images/icon-dineout.png')} style={styles.chipIcon} />
            )}
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
        {/* Avatar */}
        <View style={styles.avatarChip}>
          <Ionicons name="person" size={16} color="#999" />
        </View>
      </View>

      {/* Restaurant list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {RESTAURANTS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push(`/food/${item.id}` as any)}
          >
            {/* Food image */}
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />

            {/* Discount badge */}
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>

            {/* Info */}
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={12} color="#8A8A8A" />
                    <Text style={styles.metaText}> {item.time} mins</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text style={styles.metaText}> {item.rating} {item.cuisine}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${item.price} </Text>
                    <Text style={styles.originalPrice}>${item.original}</Text>
                  </View>
                </View>

                {/* Add button */}
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.addText}>Add</Text>
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
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF',
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

  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 28, backgroundColor: '#F2F2F2',
  },
  chipActive: { backgroundColor: '#00B14F' },
  chipIcon: { width: 16, height: 16 },
  chipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#5A5A5A' },
  chipTextActive: { color: '#FFFFFF' },
  avatarChip: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center', marginLeft: 'auto',
  },

  scroll: { flex: 1, marginTop: 4 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 28, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    flexDirection: 'row',
  },
  cardImage: { width: 100, height: 100 },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#E8F5E9', borderRadius: 22, paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#00B14F' },

  cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardInfo: { flex: 1, gap: 3 },
  cardName: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  price: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  originalPrice: { fontSize: 12, color: '#BBBBBB', textDecorationLine: 'line-through', fontFamily: 'PlusJakartaSans_400Regular' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#00B14F', borderRadius: 28,
    paddingHorizontal: 12, paddingVertical: 7,
    marginLeft: 8,
  },
  addText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },
});
