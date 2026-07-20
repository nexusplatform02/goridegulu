import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIME_SLOTS = ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];
const GUEST_COUNTS = [1, 2, 3, 4, 5, 6];

const MENU_ITEMS = [
  {
    id: '1',
    image: require('../../assets/images/boba-tea.jpg'),
    name: 'Signature Laksa',
    desc: 'Rich coconut broth with prawns & noodles',
    price: '18.00',
  },
  {
    id: '2',
    image: require('../../assets/images/snacks.jpg'),
    name: 'Grilled Chicken Platter',
    desc: 'Herb-marinated, served with seasonal veg',
    price: '24.00',
  },
  {
    id: '3',
    image: require('../../assets/images/bubble-tea.jpg'),
    name: 'Wagyu Beef Slider',
    desc: 'Premium wagyu, truffle aioli, brioche bun',
    price: '32.00',
  },
];

export default function DineOutDetailScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [guests, setGuests] = useState(2);
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image source={require('../../assets/images/chicken-fries.jpg')} style={styles.heroImage} resizeMode="cover" />
        <View style={[styles.heroBtns, { top: topPad + 8 }]}>
          <TouchableOpacity style={styles.heroBtnCircle} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.heroRight}>
            <TouchableOpacity style={styles.heroBtnCircle} onPress={() => setLiked(v => !v)} activeOpacity={0.8}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#E53935' : '#1A1A1A'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnCircle} activeOpacity={0.8}>
              <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.restaurantHeader}>
            <Image source={require('../../assets/images/icon-dineout.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.titles}>
              <Text style={styles.restaurantName}>The Royal Garden</Text>
              <Text style={styles.tagline}>Fine dining in the heart of the city</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color="#8A8A8A" />
            <Text style={styles.metaText}>Central Business District · 0.4 km</Text>
            <Ionicons name="star" size={13} color="#FFC107" style={{ marginLeft: 8 }} />
            <Text style={styles.ratingText}>4.8 · International</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$$</Text>
              <Text style={styles.statLabel}>Price Range</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0.4 km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Open</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>

        {/* Book a table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book a Table</Text>

          <Text style={styles.subLabel}>Number of Guests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.guestRow}>
            {GUEST_COUNTS.map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.guestBtn, guests === n && styles.guestBtnActive]}
                onPress={() => setGuests(n)}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={13} color={guests === n ? '#FFFFFF' : '#8A8A8A'} />
                <Text style={[styles.guestText, guests === n && styles.guestTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.subLabel, { marginTop: 14 }]}>Available Time Slots</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.timeBtn, selectedTime === t && styles.timeBtnActive]}
                onPress={() => setSelectedTime(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu preview */}
        <View style={[styles.section, { marginTop: 4 }]}>
          <Text style={styles.sectionTitle}>Menu Highlights</Text>
          {MENU_ITEMS.map(item => (
            <View key={item.id} style={styles.menuCard}>
              <Image source={item.image} style={styles.menuImage} resizeMode="cover" />
              <View style={styles.menuBody}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc} numberOfLines={2}>{item.desc}</Text>
                <Text style={styles.menuPrice}>${item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Book CTA */}
      <View style={[styles.bookBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.bookSummary}>{guests} guests · {selectedTime}</Text>
          <Text style={styles.bookLabel}>The Royal Garden</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.88}>
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  heroWrap: { width: '100%', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  heroBtns: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroRight: { flexDirection: 'row', gap: 8 },
  heroBtnCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFFDD',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { flex: 1 },

  infoCard: {
    backgroundColor: '#FFFFFF', padding: 18, gap: 12,
    marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  restaurantHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 52, height: 52, borderRadius: 22, backgroundColor: '#F5F5F5' },
  titles: { flex: 1 },
  restaurantName: { fontSize: 20, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  tagline: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  ratingText: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular', marginLeft: 3 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 22, padding: 14 },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E8E8E8' },

  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 14 },
  subLabel: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#5A5A5A', marginBottom: 10 },

  guestRow: { gap: 10, paddingBottom: 4 },
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 28, backgroundColor: '#F2F2F2',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  guestBtnActive: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  guestText: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  guestTextActive: { color: '#FFFFFF' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 28, backgroundColor: '#F2F2F2',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  timeBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#00B14F' },
  timeText: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  timeTextActive: { color: '#00B14F', fontFamily: 'Aeonik-Medium' },

  menuCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden',
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  menuImage: { width: 90, height: 90 },
  menuBody: { flex: 1, padding: 12, gap: 3, justifyContent: 'center' },
  menuName: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  menuDesc: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular', lineHeight: 17 },
  menuPrice: { fontSize: 14, fontFamily: 'Aeonik-Bold', color: '#00B14F', marginTop: 2 },

  bookBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 10,
  },
  bookSummary: { fontSize: 12, color: '#8A8A8A', fontFamily: 'Aeonik-Regular' },
  bookLabel: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  bookBtn: { backgroundColor: '#00B14F', borderRadius: 22, paddingHorizontal: 22, paddingVertical: 14 },
  bookBtnText: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
});
