import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SLOTS = ['ASAP (15 min)', '10:00–10:30 AM', '10:30–11:00 AM', '11:00–11:30 AM', '2:00–2:30 PM'];

export default function MartCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [selectedSlot, setSelectedSlot] = useState('ASAP (15 min)');
  const [summaryOpen, setSummaryOpen] = useState(false);

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

        {/* Delivery address */}
        <Text style={styles.sectionLabel}>Delivery Address</Text>
        <TouchableOpacity style={styles.addressCard} activeOpacity={0.8}>
          <View style={styles.addressIconWrap}>
            <Ionicons name="location" size={20} color="#00B14F" />
          </View>
          <View style={styles.addressText}>
            <Text style={styles.addressTitle}>Home</Text>
            <Text style={styles.addressSub} numberOfLines={2}>Jewel Level 2 Pick-up Pillar 7, 78 Airport Boulevard, Singapore 819666</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
        </TouchableOpacity>

        {/* Delivery time */}
        <Text style={styles.sectionLabel}>Delivery Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
          {SLOTS.map(slot => (
            <TouchableOpacity
              key={slot}
              style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedSlot(slot)}
            >
              {slot === 'ASAP (15 min)' && (
                <Ionicons name="flash" size={12} color={selectedSlot === slot ? '#FFFFFF' : '#9A9A9A'} />
              )}
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Delivery instructions */}
        <Text style={styles.sectionLabel}>Delivery Instructions</Text>
        <TouchableOpacity style={styles.instructCard} activeOpacity={0.8}>
          <Ionicons name="chatbubble-outline" size={18} color="#9A9A9A" />
          <Text style={styles.instructText}>Add note for rider (e.g. leave at door)</Text>
          <Ionicons name="add" size={18} color="#00B14F" />
        </TouchableOpacity>

        {/* Order summary */}
        <TouchableOpacity
          style={styles.summaryHeader}
          activeOpacity={0.8}
          onPress={() => setSummaryOpen(v => !v)}
        >
          <Text style={styles.sectionLabel}>Order Summary</Text>
          <View style={styles.summaryHeaderRight}>
            <Text style={styles.summaryCount}>6 items</Text>
            <Ionicons name={summaryOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#9A9A9A" />
          </View>
        </TouchableOpacity>

        {summaryOpen && (
          <View style={styles.summaryItems}>
            {[
              { name: 'Fresh Milk 1L', qty: 2, price: 7.00 },
              { name: 'Mixed Fruit Juice', qty: 1, price: 2.80 },
              { name: 'Crispy Chips Pack', qty: 3, price: 5.70 },
            ].map(it => (
              <View key={it.name} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>{it.name} ×{it.qty}</Text>
                <Text style={styles.summaryItemPrice}>${it.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billKey}>Subtotal</Text>
            <Text style={styles.billVal}>$15.50</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billKey}>Delivery fee</Text>
            <Text style={styles.billVal}>$2.50</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billKey}>Service fee</Text>
            <Text style={styles.billVal}>$0.80</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.billKeyBold}>Total</Text>
            <Text style={styles.billValBold}>$18.80</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.placeBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/mart/payment')}
        >
          <Text style={styles.placeBtnText}>Continue to Payment</Text>
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
  scroll: { flex: 1 },
  sectionLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 10, marginTop: 16 },

  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  addressIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  addressText: { flex: 1 },
  addressTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  addressSub: { fontSize: 12, color: '#9A9A9A', fontFamily: 'Inter_400Regular', marginTop: 2, lineHeight: 17 },

  slotChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E8E8E8',
  },
  slotChipActive: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  slotText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  slotTextActive: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },

  instructCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  instructText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },

  summaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 6 },
  summaryHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryCount: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },

  summaryItems: {
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    gap: 8, marginBottom: 8,
  },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItemName: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: '#5A5A5A' },
  summaryItemPrice: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },

  billCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billKey: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  billVal: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },
  billKeyBold: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  billValBold: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  placeBtn: {
    backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 16,
  },
  placeBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
