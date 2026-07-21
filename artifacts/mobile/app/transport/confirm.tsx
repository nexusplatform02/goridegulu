import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Platform,
  Modal, TextInput, Pressable, Animated, KeyboardAvoidingView,
  PanResponder, useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleMap } from '@/components/GoogleMap';
import { useLocation } from '@/hooks/useLocation';

const MTN_LOGO    = require('../../assets/images/mtn-momo-real.png');
const AIRTEL_LOGO = require('../../assets/images/airtel-money_2.png');

const VEHICLES = [
  {
    id: 'moto',
    name: 'Motorcycle',
    seats: '1 seat',
    luggage: 'Small bag only',
    priceUGX: 13000,
    fast: true,
    image: require('../../assets/images/vehicle-moto.png'),
  },
  {
    id: 'tuktuk',
    name: 'Tuk Tuk',
    seats: '3 seats',
    luggage: '2 large bags',
    priceUGX: 19000,
    fast: false,
    image: require('../../assets/images/vehicle-tuktuk.png'),
  },
];

const PAYMENT_METHODS = [
  { id: 'cash',    label: 'Cash',         icon: 'cash-outline'           },
  { id: 'momo',    label: 'Mobile Money', icon: 'phone-portrait-outline' },
  { id: 'rewards', label: 'Rewards',      icon: 'gift-outline'           },
];

const REWARDS_BALANCE = 4000;

function fmtUGX(n: number) { return `UGX ${n.toLocaleString()}`; }

/** Haversine distance in metres between two lat/lng pairs */
function haversineM(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

type PayStep = 'idle' | 'processing' | 'done';

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  // Params from location screen
  const params = useLocalSearchParams<{
    destLat?: string; destLng?: string; destName?: string;
    originLat?: string; originLng?: string;
  }>();

  // Real GPS fallback
  const { coords: gps } = useLocation();

  const originLat = params.originLat ? parseFloat(params.originLat) : gps.lat;
  const originLng = params.originLng ? parseFloat(params.originLng) : gps.lng;
  const destLat   = params.destLat   ? parseFloat(params.destLat)   : gps.lat + 0.02;
  const destLng   = params.destLng   ? parseFloat(params.destLng)   : gps.lng + 0.02;
  const destName  = params.destName  ?? 'Your Destination';

  const distM = haversineM(originLat, originLng, destLat, destLng);

  const { height: SCREEN_H } = useWindowDimensions();

  const [selected, setSelected]     = useState('moto');
  const [payment, setPayment]       = useState('cash');
  const [sheetCollapsed, setSheetCollapsed] = useState(false);

  // Animated sheet Y (0 = expanded, PEEK_OFFSET = collapsed)
  const sheetAnim  = useRef(new Animated.Value(0)).current;
  const PEEK_OFFSET = SCREEN_H * 0.48; // how far to slide down when collapsed

  function expandSheet() {
    Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 12 }).start();
    setSheetCollapsed(false);
  }
  function collapseSheet() {
    Animated.spring(sheetAnim, { toValue: PEEK_OFFSET, useNativeDriver: true, tension: 70, friction: 12 }).start();
    setSheetCollapsed(true);
  }

  // Pan on the booking sheet handle
  const sheetPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        const base = sheetCollapsed ? PEEK_OFFSET : 0;
        const next = Math.max(0, Math.min(PEEK_OFFSET, base + g.dy));
        sheetAnim.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const base = sheetCollapsed ? PEEK_OFFSET : 0;
        const projected = base + g.dy;
        if (projected > PEEK_OFFSET * 0.5) collapseSheet();
        else expandSheet();
      },
    })
  ).current;

  // Mobile Money modal
  const [momoVisible, setMomoVisible] = useState(false);
  const [phone, setPhone]             = useState('');
  const [payStep, setPayStep]         = useState<PayStep>('idle');
  const spinAnim = useRef(new Animated.Value(0)).current;
  const sheetY   = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => { if (g.dy > 0) sheetY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.5) {
          Animated.timing(sheetY, { toValue: 600, duration: 250, useNativeDriver: true }).start(() => {
            sheetY.setValue(0);
            setMomoVisible(false);
          });
        } else {
          Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // Simulated rider approach distance (starts at 1820m, counts down)
  const [riderDistM, setRiderDistM] = useState(1820);
  const etaMin = Math.max(1, Math.round(riderDistM / 250));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRiderDistM(prev => Math.max(0, prev - 18));
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const vehicle = VEHICLES.find(v => v.id === selected)!;

  function handleMainButton() {
    if (payment === 'momo') {
      setPayStep('idle');
      setPhone('');
      sheetY.setValue(0);
      setMomoVisible(true);
    } else {
      router.push({
        pathname: '/transport/searching',
        params: {
          destLat: String(destLat), destLng: String(destLng),
          destName, originLat: String(originLat), originLng: String(originLng),
        },
      });
    }
  }

  function handlePay() {
    if (phone.length < 9) return;
    setPayStep('processing');
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 900, useNativeDriver: true })
    ).start();
    setTimeout(() => {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
      setPayStep('done');
      setTimeout(() => {
        setMomoVisible(false);
        router.push({
          pathname: '/transport/searching',
          params: {
            destLat: String(destLat), destLng: String(destLng),
            destName, originLat: String(originLat), originLng: String(originLng),
          },
        });
      }, 1200);
    }, 2500);
  }

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const mainBtnLabel = payment === 'momo'
    ? `Pay ${fmtUGX(vehicle.priceUGX)}`
    : payment === 'rewards'
    ? `Use ${REWARDS_BALANCE.toLocaleString()} Points`
    : `Request ${vehicle.name}`;

  return (
    <View style={styles.root}>
      {/* Real Google Maps showing the route */}
      <GoogleMap
        lat={originLat} lng={originLng}
        destLat={destLat} destLng={destLng}
        style={StyleSheet.absoluteFill}
      />

      {/* Back */}
      <TouchableOpacity style={[styles.backBtn, { top: topPad + 8 }]} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Drop-off card */}
      <View style={[styles.dropoffCard, { top: topPad + 8 }]}>
        <View style={styles.dropoffRow}>
          <View style={styles.dropoffDotGreen} />
          <View style={styles.dropoffLine} />
          <View style={styles.dropoffDotBlue} />
        </View>
        <View style={styles.dropoffTexts}>
          <Text style={styles.dropoffFrom}>Your Location</Text>
          <Text style={styles.dropoffTo} numberOfLines={1}>{destName}</Text>
        </View>
        <View style={styles.distBadge}>
          <Text style={styles.distText}>{fmtDist(distM)}</Text>
        </View>
      </View>

      {/* Bottom sheet — slides down to reveal map */}
      <Animated.View
        style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 8 }, { transform: [{ translateY: sheetAnim }] }]}
      >
        {/* Draggable handle — tap or drag to collapse/expand */}
        <TouchableOpacity
          style={styles.handleWrap}
          activeOpacity={0.7}
          onPress={sheetCollapsed ? expandSheet : collapseSheet}
          hitSlop={{ top: 10, bottom: 10, left: 80, right: 80 }}
          {...sheetPan.panHandlers}
        >
          <View style={styles.handle} />
          <Ionicons
            name={sheetCollapsed ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#C0C0C0"
            style={{ marginTop: 2 }}
          />
        </TouchableOpacity>

        {/* Route summary */}
        <View style={styles.routeSummary}>
          <View style={styles.routeItem}>
            <Ionicons name="time-outline" size={16} color="#6B6B6B" />
            <Text style={styles.routeText}>{etaMin} min away</Text>
          </View>
          <View style={styles.routeDividerV} />
          <View style={styles.routeItem}>
            <Ionicons name="navigate-outline" size={16} color="#6B6B6B" />
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

        {/* Vehicle options — tap only, no drag */}
        <View>
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
                  {v.id === selected ? `${etaMin} min` : `${etaMin + 4} min`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Payment method */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentLabelRow}>
            <Ionicons name="wallet-outline" size={16} color="#6B6B6B" />
            <Text style={styles.paymentTitle}>Payment</Text>
          </View>
          <View style={styles.paymentChips}>
            {PAYMENT_METHODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.paymentChip, payment === m.id && styles.paymentChipActive]}
                activeOpacity={0.8}
                onPress={() => setPayment(m.id)}
              >
                <Ionicons name={m.icon as any} size={14} color={payment === m.id ? '#FFFFFF' : '#5A5A5A'} />
                <Text style={[styles.paymentChipText, payment === m.id && styles.paymentChipTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.88} onPress={handleMainButton}>
          {payment === 'momo' && (
            <Ionicons name="phone-portrait-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.bookBtnText}>{mainBtnLabel}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Mobile Money Modal */}
      <Modal visible={momoVisible} transparent animationType="slide" onRequestClose={() => setMomoVisible(false)}>
        <KeyboardAvoidingView style={styles.modalWrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalOverlay} onPress={() => payStep === 'idle' && setMomoVisible(false)} />
          <Animated.View style={[styles.momoSheet, { paddingBottom: Math.max(insets.bottom, 24) }, { transform: [{ translateY: sheetY }] }]}>
            <View style={{ alignItems: 'center' }} {...panResponder.panHandlers}>
              <View style={styles.momoHandle} />
            </View>
            <View style={styles.momoHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.momoTitle}>Mobile Money</Text>
                <Text style={styles.momoSub}>Enter your number to pay</Text>
              </View>
            </View>
            <View style={styles.networkLogos}>
              <View style={styles.networkLogoCard}>
                <Image source={MTN_LOGO} style={styles.networkLogoImg} resizeMode="contain" />
              </View>
              <View style={styles.networkLogoCard}>
                <Image source={AIRTEL_LOGO} style={styles.networkLogoImg} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{fmtUGX(vehicle.priceUGX)}</Text>
            </View>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrap}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇺🇬 +256</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="7XX XXX XXX"
                placeholderTextColor="#CCCCCC"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={12}
                editable={payStep === 'idle'}
              />
            </View>
            <Text style={styles.networkHint}>MTN · Airtel · Africel supported</Text>
            <TouchableOpacity
              style={[styles.payBtn, (phone.length < 9 || payStep !== 'idle') && styles.payBtnDisabled]}
              activeOpacity={0.85}
              onPress={handlePay}
              disabled={phone.length < 9 || payStep !== 'idle'}
            >
              {payStep === 'processing' && (
                <Animated.View style={{ transform: [{ rotate: spin }], marginRight: 8 }}>
                  <Ionicons name="reload-outline" size={18} color="#FFFFFF" />
                </Animated.View>
              )}
              {payStep === 'done' && <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />}
              <Text style={styles.payBtnText}>
                {payStep === 'processing' ? 'Processing…' : payStep === 'done' ? 'Payment Confirmed!' : `Pay ${fmtUGX(vehicle.priceUGX)}`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    position: 'absolute', left: 16, zIndex: 20,
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 4,
  },
  dropoffCard: {
    position: 'absolute', left: 68, right: 16, zIndex: 20,
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10, elevation: 6,
  },
  dropoffRow:      { alignItems: 'center', gap: 2 },
  dropoffDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  dropoffLine:     { width: 2, height: 14, backgroundColor: '#E0E0E0' },
  dropoffDotBlue:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A73E8' },
  dropoffTexts:    { flex: 1 },
  dropoffFrom:     { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  dropoffTo:       { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', marginTop: 4 },
  distBadge:       { backgroundColor: '#F0F0F0', borderRadius: 28, paddingHorizontal: 8, paddingVertical: 4 },
  distText:        { fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, elevation: 14,
    zIndex: 30,
  },
  handleWrap: { alignItems: 'center', paddingBottom: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 2 },
  routeSummary:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 },
  routeItem:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  routeText:     { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  routeDividerV: { width: 1, height: 16, backgroundColor: '#E0E0E0' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  vehicleRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 22, marginBottom: 4 },
  vehicleRowActive: { backgroundColor: '#F0FCF5', borderWidth: 1.5, borderColor: '#00B14F' },
  vehicleImg:       { width: 72, height: 48 },
  vehicleInfo:      { flex: 1 },
  vehicleNameRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleName:      { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  fastBadge:        { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#FFF3E0', borderRadius: 22, paddingHorizontal: 5, paddingVertical: 2 },
  fastText:         { fontSize: 10, fontFamily: 'Aeonik-Medium', color: '#FF8C00' },
  vehicleSub:       { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginTop: 2 },
  vehiclePriceCol:  { alignItems: 'flex-end' },
  vehiclePrice:     { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  vehicleEta:       { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginTop: 2 },
  paymentSection:   { paddingVertical: 10 },
  paymentLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  paymentTitle:     { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#6B6B6B' },
  paymentChips:     { flexDirection: 'row', gap: 8 },
  paymentChip:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 28, paddingVertical: 9, backgroundColor: '#F2F2F2' },
  paymentChipActive:     { backgroundColor: '#00B14F' },
  paymentChipText:       { fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#5A5A5A' },
  paymentChipTextActive: { color: '#FFFFFF' },
  bookBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B14F', borderRadius: 30, paddingVertical: 15, marginTop: 8 },
  bookBtnText:  { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },
  modalWrap:    { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  momoSheet:    { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 24, elevation: 20 },
  momoHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20 },
  momoHeader:   { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  momoTitle:    { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  momoSub:      { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginTop: 2 },
  networkLogos: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  networkLogoCard: { flex: 1, backgroundColor: '#F7F7F7', borderRadius: 22, paddingVertical: 0, paddingHorizontal: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  networkLogoImg:  { width: '100%', height: 100 },
  amountRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F7FDF9', borderRadius: 22, padding: 16, marginBottom: 20 },
  amountLabel:  { fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#6B6B6B' },
  amountValue:  { fontSize: 22, fontFamily: 'Aeonik-Bold', color: '#00B14F' },
  inputLabel:   { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#6B6B6B', marginBottom: 8 },
  inputWrap:    { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 22, overflow: 'hidden', marginBottom: 8 },
  countryCode:  { backgroundColor: '#F5F5F5', paddingHorizontal: 14, paddingVertical: 14, borderRightWidth: 1, borderRightColor: '#E8E8E8' },
  countryCodeText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  phoneInput:   { flex: 1, paddingHorizontal: 14, fontSize: 16, fontFamily: 'Aeonik-Regular', color: '#1A1A1A', paddingVertical: 14 },
  networkHint:  { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#AAAAAA', marginBottom: 24 },
  payBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B14F', borderRadius: 30, paddingVertical: 16 },
  payBtnDisabled: { backgroundColor: '#A8DFC0' },
  payBtnText:   { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
});
