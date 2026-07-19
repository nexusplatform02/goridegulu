import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const METHODS = [
  { id: 'card',  label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex',  icon: 'card-outline' as const },
  { id: 'momo',  label: 'Mobile Money',         sub: 'MTN MoMo · Airtel Money', icon: 'phone-portrait-outline' as const },
  { id: 'grab',  label: 'GrabPay Wallet',       sub: 'Balance: UGX 12,000',     icon: 'wallet-outline' as const },
  { id: 'cod',   label: 'Cash on Delivery',     sub: 'Pay when order arrives',  icon: 'cash-outline' as const },
];

export default function ShoppingPaymentScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [selected, setSelected] = useState('card');

  const total = 86.49;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>3 items  ·  Standard delivery</Text>
            <Text style={styles.summarySub}>Est. 3–5 business days</Text>
          </View>
          <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionLabel}>Payment Method</Text>

        {METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, selected === m.id && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelected(m.id)}
          >
            <View style={[styles.methodIconWrap, selected === m.id && styles.methodIconActive]}>
              <Ionicons name={m.icon} size={20} color={selected === m.id ? '#FFFFFF' : '#555555'} />
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <View style={[styles.radio, selected === m.id && styles.radioActive]}>
              {selected === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Order Breakdown</Text>
          {[['Subtotal', '$83.49'], ['Delivery fee', '$3.00']].map(([k, v]) => (
            <View key={k} style={styles.billRow}>
              <Text style={styles.billKey}>{k}</Text>
              <Text style={styles.billVal}>{v}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.billKeyBold}>Total</Text>
            <Text style={styles.billValBold}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.secureRow}>
          <Ionicons name="lock-closed-outline" size={14} color="#9A9A9A" />
          <Text style={styles.secureText}>Your payment info is encrypted and secure.</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.88}
          onPress={() => router.replace('/shopping/confirmation')}
        >
          <Text style={styles.payBtnText}>
            {selected === 'cod' ? 'Place Order' : `Pay $${total.toFixed(2)}`}
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
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  scroll: { flex: 1 },

  summaryStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  summaryLeft: { flex: 1 },
  summaryTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  summarySub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 2 },
  summaryTotal: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },

  sectionLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#9A9A9A', marginTop: 18, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  methodCardActive: { borderColor: '#00B14F' },
  methodIconWrap: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  methodIconActive: { backgroundColor: '#00B14F' },
  methodText: { flex: 1 },
  methodLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  methodSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#CCCCCC',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#00B14F' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },

  billCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2,
  },
  billTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 12 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billKey: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  billVal: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },
  billKeyBold: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  billValBold: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },

  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 },
  secureText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  payBtn: {
    backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 16,
  },
  payBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
