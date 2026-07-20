import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// The 4 progress steps
const STEPS = [
  { icon: 'restaurant-outline' as const, label: 'Order placed' },
  { icon: 'fast-food-outline' as const, label: 'In kitchen' },
  { icon: 'bag-handle-outline' as const, label: 'Picked up' },
  { icon: 'home-outline' as const, label: 'Delivered' },
];

const CURRENT_STEP = 0; // "Order placed"

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.push('/food')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity>
          <Text style={styles.helpLink}>Get help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ETA card */}
        <View style={styles.etaCard}>
          <View style={styles.etaTop}>
            <View>
              <Text style={styles.etaTime}>10:20 – 10:30 PM</Text>
              <View style={styles.etaStatusRow}>
                <View style={styles.onTimeDot} />
                <Text style={styles.etaStatus}>On time  •  We've got your order!</Text>
              </View>
            </View>
            {/* Rider avatar */}
            <View style={styles.riderAvatar}>
              <Ionicons name="bicycle" size={22} color="#00B14F" />
            </View>
          </View>

          {/* Progress tracker */}
          <View style={styles.tracker}>
            {STEPS.map((step, i) => {
              const done = i <= CURRENT_STEP;
              const isLast = i === STEPS.length - 1;
              return (
                <React.Fragment key={i}>
                  {/* Step node */}
                  <View style={styles.stepNode}>
                    <View style={[styles.stepCircle, done && styles.stepCircleActive]}>
                      {i === CURRENT_STEP ? (
                        <Text style={styles.stepInitial}>G</Text>
                      ) : (
                        <Ionicons
                          name={step.icon}
                          size={15}
                          color={done ? '#FFFFFF' : '#CCCCCC'}
                        />
                      )}
                    </View>
                  </View>
                  {/* Connector line */}
                  {!isLast && (
                    <View style={[styles.trackerLine, i < CURRENT_STEP && styles.trackerLineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          <Text style={styles.kitchenNote}>We'll let you know when it's in the kitchen.</Text>
        </View>

        {/* Promo banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIconWrap}>
            <View style={styles.promoIconCircle}>
              <Ionicons name="infinite-outline" size={18} color="#00B14F" />
            </View>
          </View>
          <Text style={styles.promoText} numberOfLines={2}>
            Save up to S$3.00 on delivery for your next order with Grab Unlimite...
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
        </View>

        {/* Restaurant card */}
        <View style={styles.restaurantCard}>
          {/* Logo */}
          <View style={styles.restaurantLogoWrap}>
            <View style={styles.restaurantLogo}>
              <Text style={styles.restaurantLogoText}>WOKE</Text>
            </View>
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Woke Ramen – Changi Airport Terminal 1</Text>
          </View>
        </View>

        {/* Save restaurant */}
        <View style={styles.saveFavCard}>
          <Text style={styles.saveFavText}>
            Save this restaurant to Favorites and find it quickly next time.
          </Text>
          <TouchableOpacity onPress={() => setSaved(v => !v)}>
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={24}
              color={saved ? '#E53935' : '#9A9A9A'}
            />
          </TouchableOpacity>
        </View>

        {/* Totals + summary */}
        <View style={styles.summaryCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>$26.40</Text>
          </View>
          <TouchableOpacity style={styles.viewSummaryRow} activeOpacity={0.75}>
            <Text style={styles.viewSummaryText}>View order summary</Text>
            <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Location items */}
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={15} color="#9A9A9A" />
            <Text style={styles.locationText} numberOfLines={1}>Eureka Popcorn – Jewel Changi Airport</Text>
          </View>
          <View style={[styles.locationItem, { marginTop: 8 }]}>
            <Ionicons name="location-outline" size={15} color="#9A9A9A" />
            <Text style={styles.locationText} numberOfLines={1}>
              Jewel Level 2 Pick-up Pillar 7, Jewel Changi Airp...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  helpLink: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#00B14F' },

  scroll: { flex: 1 },

  // ETA card
  etaCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, margin: 16,
    padding: 18,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  etaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  etaTime: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  etaStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  onTimeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00B14F' },
  etaStatus: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A' },
  riderAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#00B14F',
  },

  // Progress tracker
  tracker: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14,
  },
  stepNode: { alignItems: 'center' },
  stepCircle: {
    width: 36, height: 36, borderRadius: 22,
    backgroundColor: '#EEEEEE',
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: '#00B14F' },
  stepInitial: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  trackerLine: { flex: 1, height: 3, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  trackerLineDone: { backgroundColor: '#00B14F' },
  kitchenNote: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A' },

  // Promo
  promoBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 28, marginHorizontal: 16, marginTop: 0,
    paddingHorizontal: 14, paddingVertical: 14, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  promoIconWrap: {},
  promoIconCircle: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  promoText: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#1A1A1A', lineHeight: 18 },

  // Restaurant card
  restaurantCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 28, marginHorizontal: 16, marginTop: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  restaurantLogoWrap: {},
  restaurantLogo: {
    width: 48, height: 48, borderRadius: 28, backgroundColor: '#1A1A1A',
    alignItems: 'center', justifyContent: 'center',
  },
  restaurantLogoText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF', letterSpacing: 1 },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', lineHeight: 20 },

  // Save fav
  saveFavCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 0,
    paddingHorizontal: 14, paddingVertical: 14, gap: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    marginTop: -2,
  },
  saveFavText: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A', lineHeight: 18 },

  // Summary card
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, marginHorizontal: 16, marginTop: 10,
    paddingHorizontal: 16, paddingVertical: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#1A1A1A' },
  totalAmount: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  viewSummaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  viewSummaryText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  locationItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#9A9A9A' },
});
