import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: 3.00, icon: 'bicycle-outline' as const },
  { id: 'express',  label: 'Express Delivery',  sub: '1–2 business days', price: 8.00, icon: 'flash-outline' as const },
];

export default function ShoppingCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [selectedDelivery, setSelectedDelivery] = useState('standard');

  const deliveryFee = DELIVERY_OPTIONS.find(o => o.id === selectedDelivery)?.price ?? 3.00;
  const subtotal = 83.49;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Shipping address */}
        <Text style={styles.sectionLabel}>Shipping Address</Text>
        <TouchableOpacity style={styles.addressCard} activeOpacity={0.8}>
          <View style={styles.addressIconWrap}>
            <Ionicons name="location" size={20} color="#00B14F" />
          </View>
          <View style={styles.addressBody}>
            <View style={styles.addressTitleRow}>
              <Text style={styles.addressTitle}>Home</Text>
              <View style={styles.defaultPill}><Text style={styles.defaultText}>Default</Text></View>
            </View>
            <Text style={styles.addressSub}>Jewel Level 2 Pick-up Pillar 7</Text>
            <Text style={styles.addressSub}>78 Airport Blvd, Singapore 819666</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addAddressRow} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={18} color="#00B14F" />
          <Text style={styles.addAddressText}>Add new address</Text>
        </TouchableOpacity>

        {/* Delivery method */}
        <Text style={styles.sectionLabel}>Delivery Method</Text>
        {DELIVERY_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.deliveryCard, selectedDelivery === opt.id && styles.deliveryCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedDelivery(opt.id)}
          >
            <View style={[styles.deliveryIconWrap, selectedDelivery === opt.id && styles.deliveryIconActive]}>
              <Ionicons name={opt.icon} size={20} color={selectedDelivery === opt.id ? '#FFFFFF' : '#5A5A5A'} />
            </View>
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryLabel}>{opt.label}</Text>
              <Text style={styles.deliverySub}>{opt.sub}</Text>
            </View>
            <Text style={styles.deliveryPrice}>${opt.price.toFixed(2)}</Text>
            <View style={[styles.radio, selectedDelivery === opt.id && styles.radioActive]}>
              {selectedDelivery === opt.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Order items summary */}
        <Text style={styles.sectionLabel}>Items (3)</Text>
        <View style={styles.itemsSummary}>
          {[
            { name: 'Running Sneakers Pro ×1', price: '$45.00' },
            { name: 'Wireless Earbuds Pro ×1', price: '$29.99' },
            { name: 'Cotton Tote Bag ×2', price: '$17.00' },
          ].map(it => (
            <View key={it.name} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{it.name}</Text>
              <Text style={styles.itemPrice}>{it.price}</Text>
            </View>
          ))}
        </View>

        {/* Bill */}
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billKey}>Subtotal</Text>
            <Text style={styles.billVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billKey}>Delivery fee</Text>
            <Text style={styles.billVal}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.billKeyBold}>Total</Text>
            <Text style={styles.billValBold}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/shopping/payment')}
        >
          <Text style={styles.continueBtnText}>Continue to Payment</Text>
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
  headerTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  scroll: { flex: 1 },
  sectionLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', marginBottom: 10, marginTop: 16 },

  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  addressIconWrap: {
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  addressBody: { flex: 1 },
  addressTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  addressTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  defaultPill: { backgroundColor: '#E8F5EE', borderRadius: 22, paddingHorizontal: 6, paddingVertical: 2 },
  defaultText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#00B14F' },
  addressSub: { fontSize: 12, color: '#9A9A9A', fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 18 },
  addAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 4 },
  addAddressText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#00B14F' },

  deliveryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  deliveryCardActive: { borderColor: '#00B14F' },
  deliveryIconWrap: {
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  deliveryIconActive: { backgroundColor: '#00B14F' },
  deliveryText: { flex: 1 },
  deliveryLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  deliverySub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A', marginTop: 2 },
  deliveryPrice: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', marginRight: 8 },
  radio: {
    width: 20, height: 20, borderRadius: 22,
    borderWidth: 2, borderColor: '#CCCCCC',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#00B14F' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },

  itemsSummary: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#5A5A5A' },
  itemPrice: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },

  billCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginTop: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billKey: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A' },
  billVal: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#1A1A1A' },
  billKeyBold: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  billValBold: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  continueBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    alignItems: 'center', paddingVertical: 16,
  },
  continueBtnText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
});
