import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS = [
  { icon: 'checkmark-circle-outline' as const, label: 'Order Placed' },
  { icon: 'storefront-outline' as const,       label: 'Packing' },
  { icon: 'bicycle-outline' as const,          label: 'On the Way' },
  { icon: 'home-outline' as const,             label: 'Delivered' },
];
const CURRENT = 1; // "Packing"

export default function MartTrackingScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <TouchableOpacity>
          <Text style={styles.helpLink}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Confirmed banner */}
        <View style={styles.confirmedBanner}>
          <View style={styles.confirmedIcon}>
            <Ionicons name="checkmark" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.confirmedText}>
            <Text style={styles.confirmedTitle}>Order Confirmed!</Text>
            <Text style={styles.confirmedSub}>Order #MRT-28471</Text>
          </View>
        </View>

        {/* ETA card */}
        <View style={styles.etaCard}>
          <View style={styles.etaTop}>
            <View>
              <Text style={styles.etaTime}>25–35 min</Text>
              <View style={styles.etaStatusRow}>
                <View style={styles.onTimeDot} />
                <Text style={styles.etaStatus}>On its way · Rider assigned</Text>
              </View>
            </View>
            <View style={styles.riderAvatar}>
              <Ionicons name="bicycle" size={22} color="#00B14F" />
            </View>
          </View>

          {/* Progress */}
          <View style={styles.tracker}>
            {STEPS.map((step, i) => {
              const done = i <= CURRENT;
              const isLast = i === STEPS.length - 1;
              return (
                <React.Fragment key={i}>
                  <View style={styles.stepNode}>
                    <View style={[styles.stepCircle, done && styles.stepCircleActive]}>
                      <Ionicons name={step.icon} size={15} color={done ? '#FFFFFF' : '#CCCCCC'} />
                    </View>
                    <Text style={[styles.stepLabel, done && styles.stepLabelActive]} numberOfLines={1}>{step.label}</Text>
                  </View>
                  {!isLast && <View style={[styles.trackerLine, i < CURRENT && styles.trackerLineDone]} />}
                </React.Fragment>
              );
            })}
          </View>
          <Text style={styles.trackerNote}>Your order is being packed at FreshMart Express.</Text>
        </View>

        {/* Rider card */}
        <View style={styles.riderCard}>
          <View style={styles.riderAvatarLarge}>
            <Ionicons name="person" size={26} color="#9A9A9A" />
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>James Okello</Text>
            <View style={styles.riderRating}>
              <Ionicons name="star" size={12} color="#FFC107" />
              <Text style={styles.riderRatingText}> 4.9 · 1,234 deliveries</Text>
            </View>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={styles.riderActionBtn}>
              <Ionicons name="call-outline" size={20} color="#00B14F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.riderActionBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#00B14F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {[
            { name: 'Fresh Milk 1L ×2', price: '$7.00' },
            { name: 'Mixed Fruit Juice ×1', price: '$2.80' },
            { name: 'Crispy Chips Pack ×3', price: '$5.70' },
          ].map(it => (
            <View key={it.name} style={styles.summaryRow}>
              <Text style={styles.summaryKey}>{it.name}</Text>
              <Text style={styles.summaryVal}>{it.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKeyBold}>Total Paid</Text>
            <Text style={styles.summaryValBold}>$18.80</Text>
          </View>
        </View>

        {/* Back to mart */}
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.88}
          onPress={() => router.replace('/mart')}
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
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
  headerTitle: { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  helpLink: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#00B14F' },
  scroll: { flex: 1 },

  confirmedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#00B14F', borderRadius: 28, padding: 16, marginBottom: 12,
  },
  confirmedIcon: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFFFFF30',
    alignItems: 'center', justifyContent: 'center',
  },
  confirmedText: {},
  confirmedTitle: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  confirmedSub: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#CCFFDD', marginTop: 2 },

  etaCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  etaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  etaTime: { fontSize: 24, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  etaStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  onTimeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00B14F' },
  etaStatus: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  riderAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#00B14F',
  },

  tracker: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepNode: { alignItems: 'center', width: 60 },
  stepCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#EEEEEE',
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: '#00B14F' },
  stepLabel: { fontSize: 10, fontFamily: 'Aeonik-Regular', color: '#BBBBBB', marginTop: 4, textAlign: 'center' },
  stepLabelActive: { color: '#00B14F', fontFamily: 'Aeonik-Medium' },
  trackerLine: { flex: 1, height: 3, backgroundColor: '#E0E0E0', marginTop: 16, marginHorizontal: 2 },
  trackerLineDone: { backgroundColor: '#00B14F' },
  trackerNote: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },

  riderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  riderAvatarLarge: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  riderRating: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  riderRatingText: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  riderActions: { flexDirection: 'row', gap: 8 },
  riderActionBtn: {
    width: 40, height: 40, borderRadius: 28,
    backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  summaryTitle: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryKey: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  summaryVal: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },
  summaryKeyBold: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  summaryValBold: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  continueBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1.5, borderColor: '#00B14F',
    alignItems: 'center', paddingVertical: 15,
  },
  continueBtnText: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#00B14F' },
});
