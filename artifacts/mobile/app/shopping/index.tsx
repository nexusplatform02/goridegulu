import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Sports'];

const FLASH_DEALS = [
  { id: 'd1', image: require('../../assets/images/boba-tea.jpg'), label: 'Up to 70% OFF', color: '#E53935' },
  { id: 'd2', image: require('../../assets/images/snacks.jpg'), label: 'Buy 2 Get 1', color: '#1565C0' },
];

const PRODUCTS = [
  {
    id: '1',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Wireless Earbuds Pro',
    brand: 'SoundMax',
    price: '29.99',
    original: '59.99',
    discount: '50%',
    rating: 4.7,
    sold: '1.2k',
  },
  {
    id: '2',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Cotton Tote Bag',
    brand: 'EcoStyle',
    price: '8.50',
    original: '14.00',
    discount: '39%',
    rating: 4.4,
    sold: '860',
  },
  {
    id: '3',
    image: require('../../assets/images/snacks.jpg'),
    name: 'Running Sneakers',
    brand: 'SwiftStep',
    price: '45.00',
    original: '80.00',
    discount: '44%',
    rating: 4.8,
    sold: '2.3k',
  },
  {
    id: '4',
    image: require('../../assets/images/chicken-fries.jpg'),
    name: 'Smart Watch Lite',
    brand: 'TechWear',
    price: '34.00',
    original: '60.00',
    discount: '43%',
    rating: 4.3,
    sold: '540',
  },
  {
    id: '5',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Linen Throw Pillow',
    brand: 'HomeHaven',
    price: '12.00',
    original: '18.00',
    discount: '33%',
    rating: 4.6,
    sold: '390',
  },
  {
    id: '6',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Vitamin C Serum',
    brand: 'GlowLab',
    price: '19.90',
    original: '35.00',
    discount: '43%',
    rating: 4.9,
    sold: '3.1k',
  },
];

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  function toggleWishlist(id: string) {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
            placeholder="Search products, brands..."
            placeholderTextColor="#BBBBBB"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Flash deals banner */}
        <View style={styles.flashBanner}>
          <View style={styles.flashHeader}>
            <Ionicons name="flash" size={18} color="#E53935" />
            <Text style={styles.flashTitle}>Flash Deals</Text>
            <View style={styles.countdown}>
              <Text style={styles.countdownText}>02:45:30</Text>
            </View>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {FLASH_DEALS.map(d => (
              <TouchableOpacity key={d.id} style={styles.dealCard} activeOpacity={0.88}>
                <Image source={d.image} style={styles.dealImage} resizeMode="cover" />
                <View style={[styles.dealBadge, { backgroundColor: d.color }]}>
                  <Text style={styles.dealBadgeText}>{d.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.catChip, activeCategory === c && styles.catChipActive]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(c)}
            >
              <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products grid */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Top Picks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {PRODUCTS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.productCard}
              activeOpacity={0.88}
              onPress={() => router.push(`/shopping/${p.id}` as any)}
            >
              <View style={styles.productImageWrap}>
                <Image source={p.image} style={styles.productImage} resizeMode="cover" />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{p.discount}</Text>
                </View>
                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={() => toggleWishlist(p.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={wishlist.has(p.id) ? 'heart' : 'heart-outline'}
                    size={16}
                    color={wishlist.has(p.id) ? '#E53935' : '#8A8A8A'}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.productBody}>
                <Text style={styles.productBrand}>{p.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={10} color="#FFC107" />
                  <Text style={styles.ratingText}> {p.rating} · {p.sold} sold</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${p.price}</Text>
                  <Text style={styles.originalPrice}>${p.original}</Text>
                </View>
                <TouchableOpacity style={styles.addCartBtn} activeOpacity={0.85} onPress={(e) => { e.stopPropagation?.(); router.push('/shopping/cart'); }}>
                  <Text style={styles.addCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
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
  filterBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  scroll: { flex: 1 },

  flashBanner: {
    backgroundColor: '#FFFFFF', padding: 16, marginBottom: 4, gap: 12,
  },
  flashHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flashTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  countdown: {
    backgroundColor: '#E53935', borderRadius: 28, paddingHorizontal: 8, paddingVertical: 3,
  },
  countdownText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  seeAll: { fontSize: 13, color: '#00B14F', fontFamily: 'PlusJakartaSans_500Medium' },
  dealCard: {
    width: 150, height: 100, borderRadius: 22, overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  dealImage: { width: '100%', height: '100%' },
  dealBadge: {
    position: 'absolute', bottom: 8, left: 8,
    borderRadius: 28, paddingHorizontal: 8, paddingVertical: 4,
  },
  dealBadgeText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },

  catRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 28, backgroundColor: '#F2F2F2',
  },
  catChipActive: { backgroundColor: '#00B14F' },
  catText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#5A5A5A' },
  catTextActive: { color: '#FFFFFF' },

  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },

  productsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 16,
  },
  productCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  productImageWrap: { position: 'relative' },
  productImage: { width: '100%', height: 130 },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#E53935', borderRadius: 22, paddingHorizontal: 6, paddingVertical: 3,
  },
  discountText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 22, backgroundColor: '#FFFFFFDD',
    alignItems: 'center', justifyContent: 'center',
  },
  productBody: { padding: 10, gap: 3 },
  productBrand: { fontSize: 10, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular', textTransform: 'uppercase' },
  productName: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A', lineHeight: 17 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  price: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#E53935' },
  originalPrice: { fontSize: 10, color: '#BBBBBB', textDecorationLine: 'line-through', fontFamily: 'PlusJakartaSans_400Regular' },
  addCartBtn: {
    backgroundColor: '#00B14F', borderRadius: 22, paddingVertical: 7,
    alignItems: 'center', marginTop: 6,
  },
  addCartText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },
});
