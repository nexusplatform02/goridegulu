import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SERVICES = [
  { id: '1', label: 'Transport', icon: 'car-sport-outline', lib: 'Ionicons', color: '#00B14F', bg: '#E0F5EA' },
  { id: '2', label: 'Food', icon: 'hamburger', lib: 'MCI', color: '#FF6B2B', bg: '#FFF0E8' },
  { id: '3', label: 'Dine Out', icon: 'silverware-fork-knife', lib: 'MCI', color: '#009966', bg: '#DFF5EC' },
  { id: '4', label: 'Mart', icon: 'basket-outline', lib: 'MCI', color: '#00B14F', bg: '#E0F5EA' },
  { id: '5', label: 'Shopping', icon: 'bag-handle-outline', lib: 'Ionicons', color: '#E07800', bg: '#FFF4E0' },
  { id: '6', label: 'All', icon: 'grid-outline', lib: 'Ionicons', color: '#00B14F', bg: '#E0F5EA' },
];

const FOOD_CARDS = [
  {
    id: '1',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Fresh Milk with Brown Su...',
    rating: 4.5,
    reviews: '212+',
    price: '7.50',
    original: '8.50',
    time: 80,
  },
  {
    id: '2',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Bubble Milk Tea',
    rating: 4.5,
    reviews: '317+',
    price: '500',
    original: '700',
    time: 40,
  },
];

const SNACK_CARDS = [
  {
    id: '3',
    image: require('../../assets/images/snacks.jpg'),
    name: 'Crispy Snack Platter',
    rating: 4.3,
    reviews: '98+',
    price: '12.50',
    original: '15.00',
    time: 25,
  },
  {
    id: '4',
    image: require('../../assets/images/chicken-fries.jpg'),
    name: 'Chicken & Fries',
    rating: 4.6,
    reviews: '189+',
    price: '18.00',
    original: '21.00',
    time: 35,
  },
];

function ServiceIcon({ lib, icon, color }: { lib: string; icon: string; color: string }) {
  if (lib === 'MCI') {
    return <MaterialCommunityIcons name={icon as any} size={28} color={color} />;
  }
  return <Ionicons name={icon as any} size={28} color={color} />;
}

function FoodCard({ item }: { item: (typeof FOOD_CARDS)[0] }) {
  return (
    <View style={styles.foodCard}>
      <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
      <View style={styles.foodBody}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color="#FFC107" />
          <Text style={styles.ratingText}> {item.rating} ({item.reviews} review)</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price} </Text>
          <Text style={styles.originalPrice}>${item.original}</Text>
          <Text style={styles.timeText}>  {item.time} mins</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: 110 + (Platform.OS === 'web' ? 34 : 0),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#999" />
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#AAAAAA" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#BBBBBB"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.qrBtn} activeOpacity={0.7}>
            <Ionicons name="scan-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesCard}>
          {SERVICES.map((svc) => (
            <TouchableOpacity key={svc.id} style={styles.serviceItem} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: svc.bg }]}>
                <ServiceIcon lib={svc.lib} icon={svc.icon} color={svc.color} />
              </View>
              <Text style={styles.serviceLabel}>{svc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment & Rewards */}
        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoTitle}>Payment</Text>
              <Text style={styles.infoValue}>Add a Card</Text>
            </View>
            <Ionicons name="card-outline" size={22} color="#00B14F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoTitle}>Grab Rewards</Text>
              <Text style={styles.infoValue}>0</Text>
            </View>
            <Ionicons name="gift-outline" size={22} color="#00B14F" />
          </TouchableOpacity>
        </View>

        {/* Food For You */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Food For You</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {FOOD_CARDS.map((item) => <FoodCard key={item.id} item={item} />)}
        </ScrollView>

        {/* Order Snacks From */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Order Snacks From</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {SNACK_CARDS.map((item) => <FoodCard key={item.id} item={item} />)}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  avatar: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#E8E8E8',
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 14, height: 44,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: '#1A1A1A', fontFamily: 'Inter_400Regular',
  },
  qrBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },

  // Services
  servicesCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8,
    flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12,
  },
  serviceItem: { width: '33.33%', alignItems: 'center', paddingVertical: 14, gap: 8 },
  iconCircle: {
    width: 58, height: 58, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },

  // Info row
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  infoCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  infoTextBlock: { gap: 2 },
  infoTitle: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },

  // Section
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  seeAll: { fontSize: 13, color: '#00B14F', fontFamily: 'Inter_500Medium' },
  hList: { paddingRight: 16, marginBottom: 20, gap: 12 },

  // Food card
  foodCard: {
    width: 165, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  foodImage: { width: '100%', height: 112, backgroundColor: '#F0F0F0' },
  foodBody: { padding: 10, gap: 4 },
  foodName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Inter_400Regular' },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  price: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  originalPrice: {
    fontSize: 11, color: '#BBBBBB', fontFamily: 'Inter_400Regular',
    textDecorationLine: 'line-through',
  },
  timeText: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Inter_400Regular' },
});
