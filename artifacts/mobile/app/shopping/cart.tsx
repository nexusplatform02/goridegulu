import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_ITEMS = [
  { id: '1', image: require('../../assets/images/snacks.jpg'),     name: 'Running Sneakers Pro', brand: 'SwiftStep', size: 'M',  color: '#1A1A1A', price: 45.00, qty: 1 },
  { id: '2', image: require('../../assets/images/boba-tea.jpg'),   name: 'Wireless Earbuds Pro', brand: 'SoundMax',  size: '-',  color: '#1565C0', price: 29.99, qty: 1 },
  { id: '3', image: require('../../assets/images/bubble-tea.jpg'), name: 'Cotton Tote Bag',      brand: 'EcoStyle',  size: 'One Size', color: '#558B2F', price: 8.50, qty: 2 },
];

export default function ShoppingCartScreen() {
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
  const delivery = 3.00;
  const total = subtotal + delivery;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerCount}>{items.reduce((s, i) => s + i.qty, 0)} items</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.itemMeta}>
                {item.size !== '-' && (
                  <View style={styles.metaPill}><Text style={styles.metaPillText}>Size: {item.size}</Text></View>
                )}
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.qtyCol}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => changeQty(item.id, -99)}
              >
                <Ionicons name="trash-outline" size={16} color="#E53935" />
              </TouchableOpacity>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                  <Ionicons name="remove" size={14} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                  <Ionicons name="add" size={14} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Promo */}
        <TouchableOpacity style={styles.promoRow} activeOpacity={0.8}>
          <Ionicons name="pricetag-outline" size={18} color="#E53935" />
          <Text style={styles.promoText}>Apply promo / voucher code</Text>
          <Ionicons name="chevron-forward" size={16} color="#9A9A9A" />
        </TouchableOpacity>

        {/* Summary */}
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

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/shopping/checkout')}
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
  headerTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  headerCount: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  scroll: { flex: 1 },

  itemCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  itemInfo: { flex: 1, gap: 3 },
  itemBrand: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: 1 },
  itemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', lineHeight: 18 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaPill: { backgroundColor: '#F2F2F2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  metaPillText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  colorDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#E0E0E0' },
  itemPrice: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#E53935' },

  qtyCol: { alignItems: 'center', justifyContent: 'space-between' },
  removeBtn: { padding: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 4 },
  qtyBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A', minWidth: 18, textAlign: 'center' },

  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 12,
  },
  promoText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#E53935' },

  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  summaryTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryKey: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  summaryVal: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },
  summaryKeyBold: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  summaryValBold: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  totalLabel: { fontSize: 12, color: '#9A9A9A', fontFamily: 'Inter_400Regular' },
  totalAmount: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#00B14F', borderRadius: 14, paddingHorizontal: 22, paddingVertical: 14,
  },
  checkoutText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
