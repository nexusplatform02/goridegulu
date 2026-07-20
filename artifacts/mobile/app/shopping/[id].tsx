import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['#1A1A1A', '#E53935', '#1565C0', '#558B2F', '#F57F17'];

const RELATED = [
  { id: 'r1', image: require('../../assets/images/boba-tea.jpg'), name: 'Sport Hoodie', price: '24.99' },
  { id: 'r2', image: require('../../assets/images/bubble-tea.jpg'), name: 'Running Cap', price: '12.00' },
  { id: 'r3', image: require('../../assets/images/snacks.jpg'), name: 'Training Shorts', price: '18.50' },
];

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#1A1A1A');
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image source={require('../../assets/images/snacks.jpg')} style={styles.heroImage} resizeMode="cover" />
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
        {/* Discount badge */}
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>-44%</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          {/* Brand + name */}
          <Text style={styles.brand}>SWIFTSTEP</Text>
          <Text style={styles.productName}>Running Sneakers Pro</Text>

          {/* Rating + sold */}
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map(i => (
              <Ionicons key={i} name="star" size={14} color={i <= 4 ? '#FFC107' : '#E0E0E0'} />
            ))}
            <Text style={styles.ratingText}> 4.8 · 2,341 sold</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>$45.00</Text>
            <Text style={styles.originalPrice}>$80.00</Text>
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>Save $35.00</Text>
            </View>
          </View>

          {/* Color */}
          <Text style={styles.optionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorBtn, { backgroundColor: c }, selectedColor === c && styles.colorBtnActive]}
                onPress={() => setSelectedColor(c)}
                activeOpacity={0.8}
              >
                {selectedColor === c && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Size */}
          <Text style={styles.optionLabel}>Size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(s)}
                activeOpacity={0.8}
              >
                <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Qty */}
          <View style={styles.qtyRow}>
            <Text style={styles.optionLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))} activeOpacity={0.8}>
                <Ionicons name="remove" size={16} color="#00B14F" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)} activeOpacity={0.8}>
                <Ionicons name="add" size={16} color="#00B14F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.optionLabel}>About this Product</Text>
          <Text style={styles.description}>
            Engineered for speed and comfort. The SwiftStep Pro features a breathable mesh upper, responsive foam midsole, and durable rubber outsole. Perfect for road running, gym sessions, and everyday wear.
          </Text>

          {/* Delivery info */}
          <View style={styles.deliveryBox}>
            <Ionicons name="bicycle-outline" size={18} color="#00B14F" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Free Delivery</Text>
              <Text style={styles.deliverySub}>Estimated 2–4 business days</Text>
            </View>
            <Ionicons name="refresh-outline" size={18} color="#8A8A8A" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Free Returns</Text>
              <Text style={styles.deliverySub}>Within 30 days</Text>
            </View>
          </View>
        </View>

        {/* Related products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You May Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
            {RELATED.map(r => (
              <View key={r.id} style={styles.relatedCard}>
                <Image source={r.image} style={styles.relatedImage} resizeMode="cover" />
                <View style={styles.relatedBody}>
                  <Text style={styles.relatedName} numberOfLines={1}>{r.name}</Text>
                  <Text style={styles.relatedPrice}>${r.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Buy bar */}
      <View style={[styles.buyBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.wishlistBtn} activeOpacity={0.85} onPress={() => router.push('/shopping/cart')}>
          <Ionicons name="bag-add-outline" size={22} color="#00B14F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.88} onPress={() => router.push('/shopping/checkout')}>
          <Text style={styles.buyBtnText}>Buy Now · ${(45 * qty).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  heroWrap: { width: '100%', height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBtns: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroRight: { flexDirection: 'row', gap: 8 },
  heroBtnCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFFDD',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute', bottom: 14, left: 14,
    backgroundColor: '#E53935', borderRadius: 22, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroBadgeText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },

  scroll: { flex: 1 },

  infoCard: {
    backgroundColor: '#FFFFFF', padding: 18, gap: 12,
    marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  brand: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#8A8A8A', letterSpacing: 1.5 },
  productName: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  price: { fontSize: 26, fontFamily: 'PlusJakartaSans_700Bold', color: '#E53935' },
  originalPrice: { fontSize: 16, color: '#BBBBBB', textDecorationLine: 'line-through', fontFamily: 'PlusJakartaSans_400Regular' },
  discountPill: { backgroundColor: '#FFE8E8', borderRadius: 28, paddingHorizontal: 8, paddingVertical: 4 },
  discountText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E53935' },

  optionLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },

  colorRow: { flexDirection: 'row', gap: 10 },
  colorBtn: {
    width: 32, height: 32, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  colorBtnActive: {
    borderWidth: 2.5, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },

  sizeRow: { flexDirection: 'row', gap: 10 },
  sizeBtn: {
    width: 46, height: 46, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F2F2F2', borderWidth: 1.5, borderColor: 'transparent',
  },
  sizeBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#00B14F' },
  sizeText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#5A5A5A' },
  sizeTextActive: { color: '#00B14F' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  qtyBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },

  description: { fontSize: 13, color: '#5A5A5A', fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 20 },

  deliveryBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F8F8F8', borderRadius: 22, padding: 14,
  },
  deliveryText: { flex: 1 },
  deliveryTitle: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  deliverySub: { fontSize: 11, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular' },

  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', marginBottom: 12 },
  relatedRow: { gap: 12, paddingBottom: 4 },
  relatedCard: {
    width: 130, backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  relatedImage: { width: '100%', height: 100 },
  relatedBody: { padding: 8, gap: 3 },
  relatedName: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  relatedPrice: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#E53935' },

  buyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  wishlistBtn: {
    width: 50, height: 50, borderRadius: 22,
    borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  buyBtn: {
    flex: 1, backgroundColor: '#00B14F', borderRadius: 22,
    paddingVertical: 14, alignItems: 'center',
  },
  buyBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
});
