import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVITIES = [
  { id: '1', icon: 'car-sport', color: '#00B14F', bg: '#E0F5EA', title: 'GrabCar ride', subtitle: 'Completed · 2 km', time: '10 mins ago', amount: '$8.50' },
  { id: '2', icon: 'fast-food', color: '#FF6B2B', bg: '#FFF0E8', title: 'GrabFood order', subtitle: 'Delivered · Bubble Milk Tea', time: 'Yesterday', amount: '$500' },
  { id: '3', icon: 'basket', color: '#00B14F', bg: '#E0F5EA', title: 'GrabMart', subtitle: 'Delivered · Grocery items', time: '2 days ago', amount: '$23.40' },
  { id: '4', icon: 'bag-handle', color: '#E07800', bg: '#FFF4E0', title: 'GrabExpress', subtitle: 'Package delivered', time: '3 days ago', amount: '$5.00' },
  { id: '5', icon: 'car-sport', color: '#00B14F', bg: '#E0F5EA', title: 'GrabCar ride', subtitle: 'Completed · 5.2 km', time: '4 days ago', amount: '$15.20' },
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.root]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 + bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {ACTIVITIES.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.amount}>{item.amount}</Text>
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
  content: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  iconWrap: {
    width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  time: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#BBBBBB' },
  amount: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
});
