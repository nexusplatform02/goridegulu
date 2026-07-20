import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const POPULAR_ITEMS = [
  {
    id: '1',
    name: 'Chicken Chashu Collagen Ramen',
    image: require('../../assets/images/boba-tea.jpg'),
    price: '18.50',
  },
  {
    id: '2',
    name: 'Chicken Chasu Collagen Udon',
    image: require('../../assets/images/bubble-tea.jpg'),
    price: '18.50',
  },
];

export default function RestaurantDetailScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [mode, setMode] = useState<'delivery' | 'pickup'>('pickup');
  const [liked, setLiked] = useState(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const [mainQty, setMainQty] = useState(0);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0) + mainQty;
  const totalPrice = (totalItems * 18.5).toFixed(2);

  function addToCart(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  return (
    <View style={styles.root}>
      {/* Hero image */}
      <View style={styles.heroWrap}>
        <Image
          source={require('../../assets/images/snacks.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Overlay buttons */}
        <View style={[styles.heroBtns, { top: topPad + 8 }]}>
          <TouchableOpacity style={styles.heroBtnCircle} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.heroRight}>
            <TouchableOpacity style={styles.heroBtnCircle} onPress={() => setLiked(v => !v)} activeOpacity={0.8}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#E53935' : '#1A1A1A'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnCircle} activeOpacity={0.8}>
              <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant card */}
        <View style={styles.infoCard}>
          {/* Logo + name */}
          <View style={styles.restaurantHeader}>
            <Image
              source={require('../../assets/images/icon-food.png')}
              style={styles.restaurantLogo}
              resizeMode="contain"
            />
            <View style={styles.restaurantTitles}>
              <Text style={styles.restaurantName}>Woke Ramen</Text>
              <Text style={styles.restaurantTagline}>Woke Ramen serves bold flavors</Text>
            </View>
          </View>

          {/* Location + rating */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#8A8A8A" />
            <Text style={styles.locationText}>Changi Airport Terminal 1</Text>
            <Ionicons name="star" size={13} color="#FFC107" style={{ marginLeft: 8 }} />
            <Text style={styles.ratingText}>4.2 Chinese</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$18.50</Text>
              <Text style={styles.statLabel}>Price</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0.7 km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$18.50</Text>
              <Text style={styles.statLabel}>Delivery Time</Text>
            </View>
          </View>

          {/* Main product qty control */}
          <View style={styles.qtyRow}>
            <View style={styles.qtyLeft}>
              <Text style={styles.qtyItemName}>Chicken Chashu Collagen Ramen</Text>
              <Text style={styles.qtyItemPrice}>$18.50</Text>
            </View>
            <View style={styles.qtyControl}>
              {mainQty > 0 ? (
                <>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    activeOpacity={0.8}
                    onPress={() => setMainQty(q => Math.max(0, q - 1))}
                  >
                    <Ionicons name="remove" size={16} color="#00B14F" />
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{mainQty}</Text>
                </>
              ) : null}
              <TouchableOpacity
                style={styles.qtyBtnAdd}
                activeOpacity={0.8}
                onPress={() => setMainQty(q => q + 1)}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery / Pickup toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'delivery' && styles.toggleBtnActive]}
              activeOpacity={0.85}
              onPress={() => setMode('delivery')}
            >
              <Ionicons
                name="bicycle-outline"
                size={16}
                color={mode === 'delivery' ? '#FFFFFF' : '#5A5A5A'}
              />
              <Text style={[styles.toggleText, mode === 'delivery' && styles.toggleTextActive]}>
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'pickup' && styles.toggleBtnActive]}
              activeOpacity={0.85}
              onPress={() => setMode('pickup')}
            >
              <Ionicons
                name="bag-handle-outline"
                size={16}
                color={mode === 'pickup' ? '#FFFFFF' : '#5A5A5A'}
              />
              <Text style={[styles.toggleText, mode === 'pickup' && styles.toggleTextActive]}>
                Pickup
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Most popular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most popular</Text>
          <View style={styles.popularGrid}>
            {POPULAR_ITEMS.map(item => (
              <View key={item.id} style={styles.popularCard}>
                <Image source={item.image} style={styles.popularImage} resizeMode="cover" />
                <View style={styles.popularBody}>
                  <Text style={styles.popularName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.popularPrice}>${item.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.popularAddBtn}
                  activeOpacity={0.85}
                  onPress={() => addToCart(item.id)}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom order bar */}
      {totalItems > 0 && (
        <View style={[styles.orderBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View>
            <Text style={styles.orderTotal}>${totalPrice}</Text>
            <Text style={styles.orderCount}>Total {totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity style={styles.orderBtn} activeOpacity={0.88} onPress={() => router.push('/food/checkout')}>
            <Text style={styles.orderBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // Hero
  heroWrap: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBtns: {
    position: 'absolute', left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  heroRight: { flexDirection: 'row', gap: 8 },
  heroBtnCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFFDD',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { flex: 1 },

  // Info card
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    marginHorizontal: 0, padding: 18, gap: 14,
    marginTop: -20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  restaurantHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  restaurantLogo: { width: 52, height: 52, borderRadius: 22, backgroundColor: '#F5F5F5' },
  restaurantTitles: { flex: 1 },
  restaurantName: { fontSize: 20, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  restaurantTagline: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular', marginTop: 2 },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  ratingText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular', marginLeft: 3 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8', borderRadius: 22, padding: 14,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E8E8E8' },

  // Main qty
  qtyRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F8F8F8', borderRadius: 22, padding: 12,
  },
  qtyLeft: { flex: 1, marginRight: 12 },
  qtyItemName: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', lineHeight: 18 },
  qtyItemPrice: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginTop: 3 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 28,
    borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyNum: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
  qtyBtnAdd: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },

  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 22, paddingVertical: 12,
  },
  toggleBtnActive: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  toggleText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  toggleTextActive: { color: '#FFFFFF' },

  // Most popular
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 14 },
  popularGrid: { flexDirection: 'row', gap: 12 },
  popularCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  popularImage: { width: '100%', height: 110 },
  popularBody: { padding: 10, gap: 4 },
  popularName: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', lineHeight: 18 },
  popularPrice: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  popularAddBtn: {
    position: 'absolute', bottom: 10, right: 10,
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },

  // Order bar
  orderBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  orderTotal: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  orderCount: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  orderBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  orderBtnText: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
});
