import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORDERS = [
  {
    id: '1',
    storeName: 'Boba House',
    items: 'Fresh Milk with Brown Sugar, x1',
    status: 'On the way',
    statusColor: '#00B14F',
    eta: '15 mins',
  },
  {
    id: '2',
    storeName: 'Tea Garden',
    items: 'Bubble Milk Tea x2',
    status: 'Preparing',
    statusColor: '#FF8C00',
    eta: '25 mins',
  },
  {
    id: '3',
    storeName: 'Snack Corner',
    items: 'Crispy Snack Platter x1, Fries x1',
    status: 'Delivered',
    statusColor: '#8A8A8A',
    eta: null,
  },
];

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 + bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {ORDERS.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.storeIconWrap}>
                <Ionicons name="fast-food-outline" size={20} color="#00B14F" />
              </View>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{order.storeName}</Text>
                <Text style={styles.items} numberOfLines={1}>{order.items}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: order.statusColor + '18' }]}>
                <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
              </View>
            </View>

            {order.eta && (
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={14} color="#8A8A8A" />
                <Text style={styles.etaText}>Estimated arrival: {order.eta}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.reorderBtn} activeOpacity={0.8}>
              <Text style={styles.reorderText}>
                {order.status === 'Delivered' ? 'Reorder' : 'Track Order'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  content: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  storeIconWrap: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#E0F5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  storeInfo: { flex: 1, gap: 3 },
  storeName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  items: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  etaText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  reorderBtn: {
    backgroundColor: '#00B14F', borderRadius: 30, paddingVertical: 12, alignItems: 'center',
  },
  reorderText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
