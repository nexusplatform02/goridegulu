import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={{ width: 22 }} />
        <Text style={styles.headerTitle}>Order Confirmed</Text>
        <TouchableOpacity onPress={() => router.replace('/shopping')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ alignItems: 'center', padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success animation placeholder */}
        <View style={styles.successCircle}>
          <View style={styles.successInner}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successSub}>
          Your order has been received and{'\n'}is being processed.
        </Text>

        {/* Order info card */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderKey}>Order number</Text>
            <Text style={styles.orderVal}>#SHP-48291</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderKey}>Date</Text>
            <Text style={styles.orderVal}>18 Jul 2026</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderKey}>Payment</Text>
            <Text style={styles.orderVal}>Credit / Debit Card</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderKey}>Delivery</Text>
            <Text style={styles.orderVal}>Standard (3–5 days)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderKeyBold}>Total Paid</Text>
            <Text style={styles.orderValBold}>$86.49</Text>
          </View>
        </View>

        {/* What's next */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>What happens next?</Text>
          {[
            { icon: 'mail-outline' as const,      text: "You'll receive a confirmation email shortly." },
            { icon: 'cube-outline' as const,       text: 'We\'ll pack and dispatch your order within 24 hours.' },
            { icon: 'bicycle-outline' as const,    text: 'Track your delivery in the Activity tab.' },
            { icon: 'home-outline' as const,       text: 'Delivery in 3–5 business days.' },
          ].map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepIconWrap}>
                <Ionicons name={s.icon} size={18} color="#00B14F" />
              </View>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.88}
          onPress={() => router.replace('/shopping')}
        >
          <Text style={styles.primaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
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

  successCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center',
    marginTop: 16, marginBottom: 24,
  },
  successInner: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#00B14F',
    alignItems: 'center', justifyContent: 'center',
  },

  successTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 10 },
  successSub: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#9A9A9A', textAlign: 'center', lineHeight: 21, marginBottom: 28 },

  orderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    width: '100%', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  orderKey: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  orderVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  orderKeyBold: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  orderValBold: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#00B14F' },
  divider: { height: 1, backgroundColor: '#F0F0F0' },

  stepsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    width: '100%', gap: 14, marginBottom: 28,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  stepsTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepIconWrap: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: '#5A5A5A', lineHeight: 19, paddingTop: 7 },

  primaryBtn: {
    backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 16, width: '100%', marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  secondaryBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', paddingVertical: 15, width: '100%',
  },
  secondaryBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#5A5A5A' },
});
