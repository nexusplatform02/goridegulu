import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const METHODS = [
  { id: 'card',   label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, Amex',   icon: 'card-outline' as const },
  { id: 'momo',   label: 'Mobile Money',          sub: 'MTN MoMo · Airtel Money',  icon: 'phone-portrait-outline' as const },
  { id: 'grab',   label: 'GrabPay Wallet',        sub: 'Balance: UGX 12,000',       icon: 'wallet-outline' as const },
  { id: 'cash',   label: 'Cash on Delivery',      sub: 'Pay when order arrives',   icon: 'cash-outline' as const },
];

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [selected, setSelected] = useState('cash');

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryRestaurant}>Woke Ramen – Changi Airport Ter.</Text>
            <Text style={styles.summaryItems}>2 items  ·  Delivery</Text>
          </View>
          <Text style={styles.summaryTotal}>$26.40</Text>
        </View>

        {/* Section label */}
        <Text style={styles.sectionLabel}>Choose payment method</Text>

        {/* Payment options */}
        {METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, selected === m.id && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelected(m.id)}
          >
            <View style={[styles.methodIconWrap, selected === m.id && styles.methodIconWrapActive]}>
              <Ionicons name={m.icon} size={20} color={selected === m.id ? '#FFFFFF' : '#555555'} />
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <View style={[styles.radioOuter, selected === m.id && styles.radioOuterActive]}>
              {selected === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Order breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownKey}>Subtotal</Text>
            <Text style={styles.breakdownVal}>$18.10</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownKey}>Delivery fee</Text>
            <Text style={styles.breakdownVal}>$5.80</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownKey}>Service fee</Text>
            <Text style={styles.breakdownVal}>$2.50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownKeyBold}>Total</Text>
            <Text style={styles.breakdownValBold}>$26.40</Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.88}
          onPress={() => router.replace('/food/tracking')}
        >
          <Text style={styles.payBtnText}>
            {selected === 'cash' ? 'Confirm Order' : `Pay $26.40`}
          </Text>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  scroll: { flex: 1 },

  summaryStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 14,
    borderRadius: 28, paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  summaryLeft: { flex: 1 },
  summaryRestaurant: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  summaryItems: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A', marginTop: 2 },
  summaryTotal: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  sectionLabel: {
    fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#9A9A9A',
    marginHorizontal: 16, marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 28,
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  methodCardActive: { borderColor: '#00B14F' },
  methodIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  methodIconWrapActive: { backgroundColor: '#00B14F' },
  methodText: { flex: 1 },
  methodLabel: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  methodSub: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A', marginTop: 2 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 22,
    borderWidth: 2, borderColor: '#CCCCCC',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#00B14F' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },

  breakdownCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, marginHorizontal: 16, marginTop: 10,
    paddingHorizontal: 16, paddingVertical: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  breakdownTitle: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  breakdownKey: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  breakdownVal: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  breakdownKeyBold: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  breakdownValBold: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 10,
  },
  payBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    alignItems: 'center', paddingVertical: 16,
  },
  payBtnText: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
});
