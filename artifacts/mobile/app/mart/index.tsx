import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'fruits', label: 'Fruits', icon: 'nutrition-outline' },
  { id: 'dairy', label: 'Dairy', icon: 'cafe-outline' },
  { id: 'snacks', label: 'Snacks', icon: 'fast-food-outline' },
  { id: 'drinks', label: 'Drinks', icon: 'beer-outline' },
];

const FEATURED = [
  {
    id: 'f1',
    image: require('../../assets/images/boba-tea.jpg'),
    store: 'FreshMart Express',
    time: '15 min',
    minOrder: '5.00',
    badge: 'Fast Delivery',
  },
  {
    id: 'f2',
    image: require('../../assets/images/snacks.jpg'),
    store: 'GreenLeaf Organic',
    time: '25 min',
    minOrder: '8.00',
    badge: 'Organic',
  },
];

const PRODUCTS = [
  {
    id: '1',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Fresh Milk 1L',
    unit: 'per bottle',
    price: '3.50',
    original: '4.20',
    inStock: true,
  },
  {
    id: '2',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Mixed Fruit Juice',
    unit: '500ml',
    price: '2.80',
    original: '3.50',
    inStock: true,
  },
  {
    id: '3',
    image: require('../../assets/images/snacks.jpg'),
    name: 'Crispy Chips Pack',
    unit: '150g',
    price: '1.90',
    original: '2.50',
    inStock: true,
  },
  {
    id: '4',
    image: require('../../assets/images/chicken-fries.jpg'),
    name: 'Chicken Nuggets',
    unit: '500g pack',
    price: '6.50',
    original: '8.00',
    inStock: false,
  },
  {
    id: '5',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Greek Yogurt',
    unit: '200g cup',
    price: '2.20',
    original: '2.80',
    inStock: true,
  },
  {
    id: '6',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Sparkling Water 6pk',
    unit: '330ml each',
    price: '4.90',
    original: '6.00',
    inStock: true,
  },
];

export default function MartScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  function addToCart(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }
  function removeFromCart(id: string) {
    setCart(prev => {
      const next = { ...prev };
      if ((next[id] || 0) > 1) next[id]--;
      else delete next[id];
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
            placeholder="Search groceries & essentials..."
            placeholderTextColor="#BBBBBB"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.cartBtn} activeOpacity={0.8}>
          <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Mart Delivery</Text>
            <Text style={styles.bannerSub}>Groceries delivered in 15–30 min</Text>
            <View style={styles.deliveryPill}>
              <Ionicons name="flash" size={12} color="#FFFFFF" />
              <Text style={styles.deliveryPillText}>Free delivery on first order</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/icon-mart.png')} style={styles.bannerIcon} resizeMode="contain" />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.catItem, activeCategory === c.id && styles.catItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(c.id)}
            >
              <Ionicons name={c.icon as any} size={18} color={activeCategory === c.id ? '#00B14F' : '#8A8A8A'} />
              <Text style={[styles.catLabel, activeCategory === c.id && styles.catLabelActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured stores */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Featured Stores</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {FEATURED.map(f => (
            <TouchableOpacity key={f.id} style={styles.storeCard} activeOpacity={0.88}>
              <Image source={f.image} style={styles.storeImage} resizeMode="cover" />
              <View style={styles.storeBadge}>
                <Text style={styles.storeBadgeText}>{f.badge}</Text>
              </View>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={1}>{f.store}</Text>
                <View style={styles.storeMetaRow}>
                  <Ionicons name="time-outline" size={11} color="#8A8A8A" />
                  <Text style={styles.storeMeta}> {f.time} · Min ${f.minOrder}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products grid */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Products</Text>
        </View>
        <View style={styles.productsGrid}>
          {PRODUCTS.map(p => (
            <View key={p.id} style={styles.productCard}>
              <Image source={p.image} style={styles.productImage} resizeMode="cover" />
              {!p.inStock && (
                <View style={styles.outOfStock}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
              <View style={styles.productBody}>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.productUnit}>{p.unit}</Text>
                <View style={styles.productFooter}>
                  <View>
                    <Text style={styles.productPrice}>${p.price}</Text>
                    <Text style={styles.productOriginal}>${p.original}</Text>
                  </View>
                  {p.inStock ? (
                    cart[p.id] ? (
                      <View style={styles.qtyRow}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(p.id)}>
                          <Ionicons name="remove" size={14} color="#00B14F" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{cart[p.id]}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(p.id)}>
                          <Ionicons name="add" size={14} color="#00B14F" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(p.id)} activeOpacity={0.85}>
                        <Ionicons name="add" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    )
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart bar */}
      {totalItems > 0 && (
        <View style={[styles.cartBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBarBadge}>
              <Text style={styles.cartBarBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartBarLabel}>items in cart</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.88}>
            <Text style={styles.checkoutText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
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
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 22, paddingHorizontal: 14, height: 42,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1A1A1A', fontFamily: 'Inter_400Regular' },
  cartBtn: { position: 'relative', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  cartBadge: {
    position: 'absolute', top: -2, right: -4,
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#E53935',
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },

  scroll: { flex: 1 },

  banner: {
    margin: 16, backgroundColor: '#00B14F', borderRadius: 20,
    padding: 20, flexDirection: 'row', alignItems: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  bannerSub: { fontSize: 13, color: '#CCFFD8', fontFamily: 'Inter_400Regular', marginTop: 4 },
  deliveryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFFFF20', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginTop: 10,
  },
  deliveryPillText: { fontSize: 11, color: '#FFFFFF', fontFamily: 'Inter_500Medium' },
  bannerIcon: { width: 72, height: 72 },

  catRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catItem: {
    alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#F0F0F0',
  },
  catItemActive: { borderColor: '#00B14F', backgroundColor: '#F0FFF6' },
  catLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#8A8A8A' },
  catLabelActive: { color: '#00B14F' },

  sectionRow: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },

  hList: { paddingHorizontal: 16, paddingBottom: 4, gap: 12 },
  storeCard: {
    width: 170, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  storeImage: { width: '100%', height: 100 },
  storeBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#00B14F', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  storeBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  storeInfo: { padding: 10, gap: 4 },
  storeName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  storeMetaRow: { flexDirection: 'row', alignItems: 'center' },
  storeMeta: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Inter_400Regular' },

  productsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  productCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  productImage: { width: '100%', height: 120 },
  outOfStock: {
    ...StyleSheet.absoluteFillObject, backgroundColor: '#00000055',
    alignItems: 'center', justifyContent: 'center', height: 120,
  },
  outOfStockText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  productBody: { padding: 10, gap: 3 },
  productName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', lineHeight: 18 },
  productUnit: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Inter_400Regular' },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  productPrice: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  productOriginal: { fontSize: 11, color: '#BBBBBB', textDecorationLine: 'line-through', fontFamily: 'Inter_400Regular' },
  addBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#1A1A1A', minWidth: 14, textAlign: 'center' },

  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartBarBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  cartBarBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  cartBarLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  checkoutBtn: {
    backgroundColor: '#00B14F', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  checkoutText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
