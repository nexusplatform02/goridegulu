import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRODUCTS: Record<string, {
  image: any; name: string; unit: string; price: string;
  original: string; inStock: boolean; category: string; description: string;
}> = {
  '1': { image: require('../../assets/images/boba-tea.jpg'),    name: 'Fresh Milk 1L',        unit: 'per bottle', price: '3.50', original: '4.20', inStock: true,  category: 'Dairy',  description: 'Farm-fresh full-cream milk sourced locally. Rich in calcium, protein and vitamins. Chilled for your freshness.' },
  '2': { image: require('../../assets/images/bubble-tea.jpg'),  name: 'Mixed Fruit Juice',    unit: '500ml',      price: '2.80', original: '3.50', inStock: true,  category: 'Drinks', description: 'A refreshing blend of real tropical fruits — mango, pineapple and passion fruit. No added sugar.' },
  '3': { image: require('../../assets/images/snacks.jpg'),      name: 'Crispy Chips Pack',    unit: '150g',       price: '1.90', original: '2.50', inStock: true,  category: 'Snacks', description: 'Light, crunchy and perfectly salted. Great for snacking on the go or sharing at home.' },
  '4': { image: require('../../assets/images/chicken-fries.jpg'), name: 'Chicken Nuggets',   unit: '500g pack',  price: '6.50', original: '8.00', inStock: false, category: 'Frozen', description: 'Juicy chicken nuggets in a crispy golden coating. Ready in minutes. Currently out of stock.' },
  '5': { image: require('../../assets/images/boba-tea.jpg'),    name: 'Greek Yogurt',         unit: '200g cup',   price: '2.20', original: '2.80', inStock: true,  category: 'Dairy',  description: 'Thick, creamy Greek-style yogurt with live cultures. High in protein, perfect with fruit or granola.' },
  '6': { image: require('../../assets/images/bubble-tea.jpg'),  name: 'Sparkling Water 6pk',  unit: '330ml each', price: '4.90', original: '6.00', inStock: true,  category: 'Drinks', description: 'Crisp natural sparkling water in convenient 330ml cans. Zero calories, zero sweeteners.' },
};

export default function MartProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS[id ?? '1'] ?? PRODUCTS['1'];
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [qty, setQty] = useState(1);

  const total = (parseFloat(product.price) * qty).toFixed(2);

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image source={product.image} style={styles.heroImage} resizeMode="cover" />
        <View style={[styles.heroBtns, { top: topPad + 8 }]}>
          <TouchableOpacity style={styles.heroBtnCircle} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtnCircle} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            -{Math.round((1 - parseFloat(product.price) / parseFloat(product.original)) * 100)}%
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.unitText}>{product.unit}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.originalPrice}>${product.original}</Text>
            <View style={styles.savePill}>
              <Text style={styles.saveText}>Save ${(parseFloat(product.original) - parseFloat(product.price)).toFixed(2)}</Text>
            </View>
          </View>

          {/* Qty control */}
          <View style={styles.qtyBlock}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))} activeOpacity={0.8}>
                <Ionicons name="remove" size={18} color="#00B14F" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)} activeOpacity={0.8}>
                <Ionicons name="add" size={18} color="#00B14F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Delivery info */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="flash-outline" size={18} color="#00B14F" />
              </View>
              <Text style={styles.infoTitle}>Express</Text>
              <Text style={styles.infoSub}>15–30 min</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#00B14F" />
              </View>
              <Text style={styles.infoTitle}>Fresh</Text>
              <Text style={styles.infoSub}>Guaranteed</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="refresh-outline" size={18} color="#00B14F" />
              </View>
              <Text style={styles.infoTitle}>Returns</Text>
              <Text style={styles.infoSub}>Easy policy</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      {product.inStock ? (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.88}
            onPress={() => router.push('/mart/cart')}
          >
            <Ionicons name="bag-add-outline" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Text style={styles.outOfStockMsg}>This item is currently out of stock</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },
  heroWrap: { width: '100%', height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBtns: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  heroBtnCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFFDD',
    alignItems: 'center', justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute', bottom: 14, left: 14,
    backgroundColor: '#E53935', borderRadius: 22, paddingHorizontal: 10, paddingVertical: 5,
  },
  discountText: { fontSize: 13, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },

  scroll: { flex: 1 },
  infoCard: {
    backgroundColor: '#FFFFFF', padding: 20, gap: 12,
    marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  categoryPill: {
    alignSelf: 'flex-start', backgroundColor: '#E8F5EE', borderRadius: 28,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  categoryText: { fontSize: 11, fontFamily: 'Aeonik-Medium', color: '#00B14F' },
  productName: { fontSize: 22, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  unitText: { fontSize: 13, color: '#9A9A9A', fontFamily: 'Aeonik-Regular', marginTop: -6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  price: { fontSize: 26, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  originalPrice: { fontSize: 16, color: '#BBBBBB', textDecorationLine: 'line-through', fontFamily: 'Aeonik-Regular' },
  savePill: { backgroundColor: '#E8F5EE', borderRadius: 28, paddingHorizontal: 8, paddingVertical: 4 },
  saveText: { fontSize: 11, fontFamily: 'Aeonik-Bold', color: '#00B14F' },

  sectionLabel: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  qtyBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 22,
    borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', minWidth: 24, textAlign: 'center' },
  description: { fontSize: 13, color: '#5A5A5A', fontFamily: 'Aeonik-Regular', lineHeight: 20 },

  infoRow: { flexDirection: 'row', gap: 10 },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoIconWrap: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  infoTitle: { fontSize: 12, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  infoSub: { fontSize: 11, color: '#9A9A9A', fontFamily: 'Aeonik-Regular' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  totalWrap: {},
  totalLabel: { fontSize: 12, color: '#9A9A9A', fontFamily: 'Aeonik-Regular' },
  totalAmount: { fontSize: 20, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#00B14F', borderRadius: 22, paddingHorizontal: 24, paddingVertical: 14,
  },
  addBtnText: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  outOfStockMsg: { flex: 1, textAlign: 'center', fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#9A9A9A' },
});
