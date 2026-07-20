import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_ITEMS = [
  { id: '1', image: require('../../assets/images/boba-tea.jpg'),   name: 'Fresh Milk 1L',     unit: 'per bottle', price: 3.50, qty: 2 },
  { id: '2', image: require('../../assets/images/bubble-tea.jpg'), name: 'Mixed Fruit Juice', unit: '500ml',      price: 2.80, qty: 1 },
  { id: '3', image: require('../../assets/images/snacks.jpg'),     name: 'Crispy Chips Pack', unit: '150g',       price: 1.90, qty: 3 },
];

export default function MartCartScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [items, setItems] = useState(INITIAL_ITEMS);

  function changeQty(id: string, delta: number) {
    setItems(prev =>
      prev.map(it => it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)
           .filter(it => it.qty > 0)
    );
  }

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = 2.50;
  const total = subtotal + delivery;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>{items.length} items</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Store strip */}
        <View style={styles.storeStrip}>
          <View style={styles.storeIconWrap}>
            <Ionicons name="storefront-outline" size={18} color="#00B14F" />
          </View>
          <Text style={styles.storeName}>FreshMart Express</Text>
          <View style={styles.deliveryPill}>
            <Ionicons name="flash" size={11} color="#00B14F" />
            <Text style={styles.deliveryPillText}>15 min</Text>
          </View>
        </View>

        {/* Items */}
        {items.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemUnit}>{item.unit}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.qtyCol}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                <Ionicons name="remove" size={14} color="#00B14F" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                <Ionicons name="add" size={14} color="#00B14F" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Promo code */}
        <TouchableOpacity style={styles.promoRow} activeOpacity={0.8}>
          <Ionicons name="pricetag-outline" size={18} color="#00B14F" />
          <Text style={styles.promoText}>Add promo code</Text>
          <Ionicons name="chevron-forward" size={16} color="#9A9A9A" />
        </TouchableOpacity>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</Text>
            <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Delivery fee</Text>
            <Text style={styles.summaryVal}>${delivery.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKeyBold}>Total</Text>
            <Text style={styles.summaryValBold}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/mart/checkout')}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  headerCount: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },

  scroll: { flex: 1 },
  storeStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 12, marginBottom: 12,
  },
  storeIconWrap: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  storeName: { flex: 1, fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  deliveryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E8F5EE', borderRadius: 22, paddingHorizontal: 8, paddingVertical: 4,
  },
  deliveryPillText: { fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#00B14F' },

  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  itemImage: { width: 64, height: 64, borderRadius: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', lineHeight: 18 },
  itemUnit: { fontSize: 11, color: '#9A9A9A', fontFamily: 'Aeonik-Regular', marginTop: 2 },
  itemPrice: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginTop: 4 },
  qtyCol: { alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 22,
    borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, marginBottom: 12,
  },
  promoText: { flex: 1, fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#00B14F' },

  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  summaryTitle: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryKey: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  summaryVal: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  summaryKeyBold: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  summaryValBold: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  totalLabel: { fontSize: 12, color: '#9A9A9A', fontFamily: 'Aeonik-Regular' },
  totalAmount: { fontSize: 20, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#00B14F', borderRadius: 22, paddingHorizontal: 22, paddingVertical: 14,
  },
  checkoutText: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
});
