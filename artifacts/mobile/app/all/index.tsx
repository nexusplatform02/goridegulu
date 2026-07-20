import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SERVICES = [
  {
    id: 'transport',
    label: 'Transport',
    description: 'Rides, deliveries & more',
    icon: require('../../assets/images/icon-transport.png'),
    bg: '#E6F9EE',
    accent: '#00B14F',
    route: '/transport',
  },
  {
    id: 'food',
    label: 'Food',
    description: 'Order from top restaurants',
    icon: require('../../assets/images/icon-food.png'),
    bg: '#FFF0E8',
    accent: '#FF6D00',
    route: '/food',
  },
  {
    id: 'dineout',
    label: 'Dine Out',
    description: 'Book a table & enjoy',
    icon: require('../../assets/images/icon-dineout.png'),
    bg: '#E8F5E9',
    accent: '#2E7D32',
    route: '/dineout',
  },
  {
    id: 'mart',
    label: 'Mart',
    description: 'Groceries in 15–30 min',
    icon: require('../../assets/images/icon-mart.png'),
    bg: '#E3F2FD',
    accent: '#1565C0',
    route: '/mart',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    description: 'Fashion, electronics & more',
    icon: require('../../assets/images/icon-shopping.png'),
    bg: '#FFF8E1',
    accent: '#F57F17',
    route: '/shopping',
  },
];

const PROMOTIONS = [
  {
    id: 'p1',
    title: 'Free Delivery',
    subtitle: 'On your first 3 food orders',
    bg: '#00B14F',
    icon: 'bicycle-outline' as const,
  },
  {
    id: 'p2',
    title: '50% Off Rides',
    subtitle: 'Use code GRAB50 today',
    bg: '#1565C0',
    icon: 'car-sport-outline' as const,
  },
  {
    id: 'p3',
    title: 'Earn Rewards',
    subtitle: 'Double points this weekend',
    bg: '#E53935',
    icon: 'gift-outline' as const,
  },
];

export default function AllServicesScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotions */}
        <Text style={styles.sectionTitle}>Today's Offers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRow}>
          {PROMOTIONS.map(p => (
            <TouchableOpacity key={p.id} style={[styles.promoCard, { backgroundColor: p.bg }]} activeOpacity={0.88}>
              <Ionicons name={p.icon} size={26} color="#FFFFFF" />
              <Text style={styles.promoTitle}>{p.title}</Text>
              <Text style={styles.promoSub}>{p.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All services list */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Services</Text>
        <View style={styles.servicesList}>
          {SERVICES.map(svc => (
            <TouchableOpacity
              key={svc.id}
              style={styles.serviceRow}
              activeOpacity={0.85}
              onPress={() => router.push(svc.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: svc.bg }]}>
                <Image source={svc.icon} style={styles.serviceIcon} resizeMode="contain" />
              </View>
              <View style={styles.serviceText}>
                <Text style={styles.serviceLabel}>{svc.label}</Text>
                <Text style={styles.serviceDesc}>{svc.description}</Text>
              </View>
              <View style={[styles.arrowBox, { backgroundColor: svc.bg }]}>
                <Ionicons name="arrow-forward" size={16} color={svc.accent} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick stats */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Orders', value: '24', icon: 'receipt-outline' },
            { label: 'Saved', value: '$12.40', icon: 'wallet-outline' },
            { label: 'Reward Pts', value: '4,000', icon: 'gift-outline' },
            { label: 'Rides Taken', value: '8', icon: 'car-outline' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name={s.icon as any} size={20} color="#00B14F" />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 22, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },

  scroll: { flex: 1 },

  sectionTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A', marginBottom: 12 },

  promoRow: { gap: 12, paddingBottom: 4 },
  promoCard: {
    width: 160, borderRadius: 22, padding: 16, gap: 6,
  },
  promoTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  promoSub: { fontSize: 12, color: '#FFFFFFCC', fontFamily: 'PlusJakartaSans_400Regular' },

  servicesList: { gap: 10 },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceIcon: { width: 30, height: 30 },
  serviceText: { flex: 1 },
  serviceLabel: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  serviceDesc: { fontSize: 12, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  arrowBox: {
    width: 34, height: 34, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 28, padding: 16,
    alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0FFF6',
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },
  statLabel: { fontSize: 12, color: '#8A8A8A', fontFamily: 'PlusJakartaSans_400Regular', textAlign: 'center' },
});
