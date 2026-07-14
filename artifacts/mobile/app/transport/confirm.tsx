import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

// UGX prices
const VEHICLES = [
  {
    id: 'moto',
    name: 'Motorcycle',
    seats: '1 seat',
    luggage: 'Small bag only',
    priceUGX: 13000,
    baseDistM: 2400,   // trip distance in metres
    fast: true,
    image: require('../../assets/images/vehicle-moto.png'),
  },
  {
    id: 'tuktuk',
    name: 'Tuk Tuk',
    seats: '3 seats',
    luggage: '2 large bags',
    priceUGX: 19000,
    baseDistM: 2400,
    fast: false,
    image: require('../../assets/images/vehicle-tuktuk.png'),
  },
];

/** Format metres → "450 m" or "1.2 km" */
function fmtDist(m: number) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

/** Format UGX with comma separator */
function fmtUGX(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const [selected, setSelected] = useState('moto');

  // Live rider distance (metres) — rider is approaching, starts ~1.8 km away
  const [riderDistM, setRiderDistM] = useState(1820);
  // Minutes away derived from distance (rough: 250 m/min on motorcycle)
  const etaMin = Math.max(1, Math.round(riderDistM / 250));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRiderDistM(prev => Math.max(0, prev - 18));
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const vehicle = VEHICLES.find(v => v.id === selected)!;

  return (
    <View style={styles.root}>
      <MapBackground showRoute />

      {/* ── Back button ───────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.backBtn, { top: topPad + 8 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* ── Drop-off card ─────────────────────────────────────── */}
      <View style={[styles.dropoffCard, { top: topPad + 8 }]}>
        <View style={styles.dropoffRow}>
          <View style={styles.dropoffDotGreen} />
          <View style={styles.dropoffLine} />
          <View style={styles.dropoffDotBlue} />
        </View>
        <View style={styles.dropoffTexts}>
          <Text style={styles.dropoffFrom}>Your Location</Text>
          <Text style={styles.dropoffTo}>Central Market, Town Square</Text>
        </View>
        <View style={styles.distBadge}>
          <Text style={styles.distText}>{fmtDist(vehicle.baseDistM)}</Text>
        </View>
      </View>

      {/* ── Bottom sheet ──────────────────────────────────────── */}
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
        <View style={styles.handle} />

        {/* Live route summary */}
        <View style={styles.routeSummary}>
          <View style={styles.routeItem}>
            <Ionicons name="time-outline" size={16} color="#6B6B6B" />
            <Text style={styles.routeText}>{etaMin} min away</Text>
          </View>
          <View style={styles.routeDividerV} />
          <View style={styles.routeItem}>
            <Ionicons name="navigate-outline" size={16} color="#6B6B6B" />
            {/* Live rider distance */}
            <Text style={[styles.routeText, { color: riderDistM < 200 ? '#00B14F' : '#5A5A5A' }]}>
              {fmtDist(riderDistM)}
            </Text>
          </View>
          <View style={styles.routeDividerV} />
          <View style={styles.routeItem}>
            <Ionicons name="cash-outline" size={16} color="#6B6B6B" />
            <Text style={styles.routeText}>{fmtUGX(vehicle.priceUGX)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Vehicle options */}
        {VEHICLES.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.vehicleRow, v.id === selected && styles.vehicleRowActive]}
            activeOpacity={0.8}
            onPress={() => setSelected(v.id)}
          >
            <Image source={v.image} style={styles.vehicleImg} resizeMode="contain" />
            <View style={styles.vehicleInfo}>
              <View style={styles.vehicleNameRow}>
                <Text style={styles.vehicleName}>{v.name}</Text>
                {v.fast && (
                  <View style={styles.fastBadge}>
                    <Ionicons name="flash" size={10} color="#FF8C00" />
                    <Text style={styles.fastText}>Fast</Text>
                  </View>
                )}
              </View>
              <Text style={styles.vehicleSub}>{v.seats} · {v.luggage}</Text>
            </View>
            <View style={styles.vehiclePriceCol}>
              <Text style={styles.vehiclePrice}>{fmtUGX(v.priceUGX)}</Text>
              <Text style={styles.vehicleEta}>
                {v.id === selected ? `${etaMin} min` : (v.id === 'moto' ? `${etaMin} min` : `${etaMin + 4} min`)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <TouchableOpacity style={styles.offersRow} activeOpacity={0.8}>
          <Ionicons name="pricetag-outline" size={18} color="#6B6B6B" />
          <Text style={styles.offersText}>Offers</Text>
          <Ionicons name="chevron-forward" size={16} color="#C0C0C0" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/transport/searching')}
        >
          <Text style={styles.bookBtnText}>Request {vehicle.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  backBtn: {
    position: 'absolute', left: 16, zIndex: 20,
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },

  dropoffCard: {
    position: 'absolute', left: 68, right: 16, zIndex: 20,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, elevation: 6,
  },
  dropoffRow: { alignItems: 'center', gap: 2 },
  dropoffDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  dropoffLine: { width: 2, height: 14, backgroundColor: '#E0E0E0' },
  dropoffDotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A73E8' },
  dropoffTexts: { flex: 1 },
  dropoffFrom: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  dropoffTo: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', marginTop: 4 },
  distBadge: { backgroundColor: '#F0F0F0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  distText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#5A5A5A' },

  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, elevation: 14,
    zIndex: 30,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0',
    alignSelf: 'center', marginBottom: 14,
  },

  routeSummary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 16, marginBottom: 14,
  },
  routeItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  routeText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  routeDividerV: { width: 1, height: 16, backgroundColor: '#E0E0E0' },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  vehicleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 10,
    borderRadius: 14, marginBottom: 4,
  },
  vehicleRowActive: { backgroundColor: '#F0FCF5', borderWidth: 1.5, borderColor: '#00B14F' },
  vehicleImg: { width: 72, height: 48 },
  vehicleInfo: { flex: 1 },
  vehicleNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  fastBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: '#FFF3E0', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  fastText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#FF8C00' },
  vehicleSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },
  vehiclePriceCol: { alignItems: 'flex-end' },
  vehiclePrice: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  vehicleEta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },

  offersRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  offersText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },

  bookBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  bookBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
