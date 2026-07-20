import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');

const SUGGESTIONS = [
  {
    id: '1',
    icon: 'time-outline' as const,
    name: 'L1 Lobby (Near Pezzo Pizza), Tampines 1',
    addr: '10 Tampines Central 1, Singapore, 529536',
  },
  {
    id: '2',
    icon: 'location-outline' as const,
    name: 'Gardens by the Bay',
    addr: '18 Marina Gardens Dr, Singapore, 018953',
  },
  {
    id: '3',
    icon: 'location-outline' as const,
    name: 'Merlion Park - One Fullerton',
    addr: '21 Esplanade Dr, One Fullerton, Singapore, 038805',
  },
];

// Step-photo placeholders (two side-by-side cards that look like location photos)
function PhotoCard({
  step,
  caption,
  colors,
}: {
  step: string;
  caption: string;
  colors: [string, string];
}) {
  return (
    <View style={[photoStyles.card, { width: (SW - 48) / 2 }]}>
      {/* Simulated interior photo */}
      <View style={[photoStyles.photo, { backgroundColor: colors[0] }]}>
        <View style={[photoStyles.photoInner, { backgroundColor: colors[1] }]} />
        <View style={photoStyles.photoPerson} />
        <View style={photoStyles.stepBadge}>
          <Text style={photoStyles.stepNum}>{step}</Text>
        </View>
      </View>
      <Text style={photoStyles.caption}>{caption}</Text>
    </View>
  );
}

const photoStyles = StyleSheet.create({
  card: { marginRight: 12 },
  photo: {
    height: 130, borderRadius: 22, overflow: 'hidden',
    justifyContent: 'flex-end', marginBottom: 8, position: 'relative',
  },
  photoInner: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
    opacity: 0.6,
  },
  photoPerson: {
    position: 'absolute', bottom: 12, left: '40%',
    width: 18, height: 36, backgroundColor: 'rgba(100,70,40,0.7)',
    borderRadius: 4,
  },
  stepBadge: {
    position: 'absolute', bottom: 8, left: 8,
    width: 24, height: 24, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { fontSize: 13, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  caption: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#4A4A4A', lineHeight: 17 },
});

export default function TransportScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 50 : insets.top;

  return (
    <View style={styles.root}>
      {/* ── Fixed green hero area (behind everything) ───────────── */}
      <View style={[styles.greenBg, { paddingTop: topPad }]}>

        {/* Header row */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Transport</Text>

          <TouchableOpacity style={styles.mapBtn}>
            <Ionicons name="map-outline" size={17} color="#1A1A1A" />
            <Text style={styles.mapLabel}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Car image centered on green background */}
        <View style={styles.carWrap}>
          <Image
            source={require('../../assets/images/vehicle-car.png')}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ── Scrollable content that overlaps the green hero ──────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer to position white card at right depth */}
        <View style={styles.greenSpacer} />

        {/* ── White info card ───────────────────────────────────── */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Transport</Text>
          <Text style={styles.cardSubtitle}>
            Wherever you're going, let's get  you there!
          </Text>

          {/* Where to? bar */}
          <TouchableOpacity
            style={styles.whereBar}
            activeOpacity={0.85}
            onPress={() => router.push('/transport/location')}
          >
            <Ionicons name="location-outline" size={19} color="#8A8A8A" style={{ marginLeft: 4 }} />
            <Text style={styles.whereText}>Where to?</Text>
            <TouchableOpacity style={styles.nowBtn} activeOpacity={0.85}>
              <Text style={styles.nowText}>Now</Text>
              <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* ── Pickup section ──────────────────────────────────────── */}
        <View style={styles.pickupSection}>
          <View style={styles.pickupRow}>
            <Text style={styles.pickupLabel}>Directions to pickup point</Text>
            <TouchableOpacity style={styles.navCircle}>
              <Ionicons name="navigate-outline" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.pickupLocRow} activeOpacity={0.8}>
            <Text style={styles.pickupLocText}>T1, Door 8, Basement 1</Text>
            <Ionicons name="chevron-down" size={18} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Step photos */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
            contentContainerStyle={{ paddingRight: 4 }}
          >
            <PhotoCard
              step="1"
              caption={'Exit from the transit area and\nhead  towards the travelator.'}
              colors={['#C4997A', '#8B5E3C']}
            />
            <PhotoCard
              step="2"
              caption={'Take the down riding travelator.'}
              colors={['#8FA8C0', '#5F7890']}
            />
          </ScrollView>
        </View>

        {/* ── Suggested places ─────────────────────────────────────── */}
        <View style={styles.suggestSection}>
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.suggestRow}
              activeOpacity={0.75}
              onPress={() => router.push('/transport/location')}
            >
              <View style={styles.suggestIconWrap}>
                <Ionicons name={s.icon} size={18} color="#6B6B6B" />
              </View>
              <View style={styles.suggestInfo}>
                <Text style={styles.suggestName} numberOfLines={1}>{s.name}</Text>
                <Text style={styles.suggestAddr} numberOfLines={1}>{s.addr}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const GREEN_BG_HEIGHT = 300; // total height of the green section
const CARD_OVERLAP = 80;     // how many px the white card overlaps into the green

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Green hero ─────────────────────────────────────────────────
  greenBg: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: GREEN_BG_HEIGHT,
    backgroundColor: '#C8E8C5',
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  circleBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, elevation: 3,
  },
  headerTitle: {
    fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A',
  },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingHorizontal: 14, paddingVertical: 9,
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, elevation: 3,
  },
  mapLabel: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },

  carWrap: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: CARD_OVERLAP - 20 },
  carImage: { width: SW * 0.75, height: 160 },

  // ── Scroll layer ────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {},

  // Spacer pushes white card down so green shows above
  greenSpacer: { height: GREEN_BG_HEIGHT - CARD_OVERLAP },

  // ── White info card ─────────────────────────────────────────────
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22,
  },
  cardTitle: { fontSize: 22, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', marginBottom: 5 },
  cardSubtitle: {
    fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#7A7A7A',
    lineHeight: 20, marginBottom: 18,
  },
  whereBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#E5E5E5', borderRadius: 30,
    paddingLeft: 12, paddingRight: 6, paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  whereText: { flex: 1, fontSize: 15, fontFamily: 'Aeonik-Regular', color: '#B0B0B0' },
  nowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  nowText: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },

  // ── Pickup section ──────────────────────────────────────────────
  pickupSection: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 22, paddingTop: 20, paddingBottom: 12,
  },
  pickupRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 4,
  },
  pickupLabel: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#9A9A9A' },
  navCircle: {
    width: 36, height: 36, borderRadius: 22,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  pickupLocRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 18,
  },
  pickupLocText: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },

  photoScroll: { marginBottom: 4 },

  // ── Suggestions ─────────────────────────────────────────────────
  suggestSection: { backgroundColor: '#FFFFFF', marginTop: 8 },
  suggestRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 22, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  suggestIconWrap: {
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  suggestInfo: { flex: 1 },
  suggestName: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  suggestAddr: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#9A9A9A', marginTop: 2 },
});
