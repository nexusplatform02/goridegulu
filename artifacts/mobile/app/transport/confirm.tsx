import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Platform,
  Modal, TextInput, Pressable, Animated, KeyboardAvoidingView, ScrollView,
} from 'react-native';

const MTN_LOGO    = require('../../assets/images/mtn-momo-real.png');
const AIRTEL_LOGO = require('../../assets/images/airtel-money_2.png');
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

const VEHICLES = [
  {
    id: 'moto',
    name: 'Motorcycle',
    seats: '1 seat',
    luggage: 'Small bag only',
    priceUGX: 13000,
    baseDistM: 2400,
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

const PAYMENT_METHODS = [
  { id: 'cash',    label: 'Cash',         icon: 'cash-outline'             },
  { id: 'momo',    label: 'Mobile Money', icon: 'phone-portrait-outline'   },
  { id: 'rewards', label: 'Rewards',      icon: 'gift-outline'             },
];

function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function fmtUGX(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

type PayStep = 'idle' | 'processing' | 'done';

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  const [selected, setSelected] = useState('moto');
  const [payment, setPayment]   = useState('cash');

  // Mobile Money modal
  const [momoVisible, setMomoVisible] = useState(false);
  const [phone, setPhone]             = useState('');
  const [payStep, setPayStep]         = useState<PayStep>('idle');
  const spinAnim                      = useRef(new Animated.Value(0)).current;

  // Live rider distance
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
      setMomoVisible(true);
    } else {
      router.push('/transport/searching');
    }
  }

  function handlePay() {
    if (phone.length < 9) return;
    setPayStep('processing');

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 900, useNativeDriver: true })
    ).start();

    setTimeout(() => {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
      setPayStep('done');
      setTimeout(() => {
        setMomoVisible(false);
        router.push('/transport/searching');
      }, 1200);
    }, 2500);
  }

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const mainBtnLabel = payment === 'momo'
    ? `Pay ${fmtUGX(vehicle.priceUGX)}`
    : `Request ${vehicle.name}`;

  return (
    <View style={styles.root}>
      <MapBackground showRoute />

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
          <Text style={styles.dropoffTo}>Central Market, Town Square</Text>
        </View>
        <View style={styles.distBadge}>
          <Text style={styles.distText}>{fmtDist(vehicle.baseDistM)}</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
        <View style={styles.handle} />

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
                <Ionicons
                  name={m.icon as any}
                  size={14}
                  color={payment === m.id ? '#FFFFFF' : '#5A5A5A'}
                />
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
      </View>

      {/* ── Mobile Money Modal ─────────────────────────────────── */}
      <Modal visible={momoVisible} transparent animationType="slide" onRequestClose={() => setMomoVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.modalOverlay} onPress={() => payStep === 'idle' && setMomoVisible(false)} />

          <View style={[styles.momoSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Handle */}
            <View style={styles.momoHandle} />

            {/* Header */}
            <View style={styles.momoHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.momoTitle}>Mobile Money</Text>
                <Text style={styles.momoSub}>Enter your number to pay</Text>
              </View>
              <TouchableOpacity onPress={() => payStep === 'idle' && setMomoVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#D0D0D0" />
              </TouchableOpacity>
            </View>

            {/* Network logos — MTN first */}
            <View style={styles.networkLogos}>
              <View style={styles.networkLogoCard}>
                <Image source={MTN_LOGO} style={styles.networkLogoImg} resizeMode="contain" />
              </View>
              <View style={styles.networkLogoCard}>
                <Image source={AIRTEL_LOGO} style={styles.networkLogoImg} resizeMode="contain" />
              </View>
            </View>

            {/* Amount */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{fmtUGX(vehicle.priceUGX)}</Text>
            </View>

            {/* Phone input */}
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

            {/* Pay button */}
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
              {payStep === 'done' && (
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              )}
              <Text style={styles.payBtnText}>
                {payStep === 'processing' ? 'Processing…'
                  : payStep === 'done' ? 'Payment Confirmed!'
                  : `Pay ${fmtUGX(vehicle.priceUGX)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  dropoffRow:      { alignItems: 'center', gap: 2 },
  dropoffDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  dropoffLine:     { width: 2, height: 14, backgroundColor: '#E0E0E0' },
  dropoffDotBlue:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A73E8' },
  dropoffTexts:    { flex: 1 },
  dropoffFrom:     { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  dropoffTo:       { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', marginTop: 4 },
  distBadge:       { backgroundColor: '#F0F0F0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  distText:        { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#5A5A5A' },

  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, elevation: 14,
    zIndex: 30,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 14 },

  routeSummary:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 },
  routeItem:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  routeText:     { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  routeDividerV: { width: 1, height: 16, backgroundColor: '#E0E0E0' },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  vehicleRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 14, marginBottom: 4 },
  vehicleRowActive: { backgroundColor: '#F0FCF5', borderWidth: 1.5, borderColor: '#00B14F' },
  vehicleImg:       { width: 72, height: 48 },
  vehicleInfo:      { flex: 1 },
  vehicleNameRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleName:      { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  fastBadge:        { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#FFF3E0', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  fastText:         { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#FF8C00' },
  vehicleSub:       { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },
  vehiclePriceCol:  { alignItems: 'flex-end' },
  vehiclePrice:     { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  vehicleEta:       { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },

  // Payment — two-row layout so all chips fit
  paymentSection:  { paddingVertical: 10 },
  paymentLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  paymentTitle:    { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#6B6B6B' },
  paymentChips:    { flexDirection: 'row', gap: 8 },
  paymentChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderRadius: 20, paddingVertical: 9,
    backgroundColor: '#F2F2F2',
  },
  paymentChipActive:     { backgroundColor: '#00B14F' },
  paymentChipText:       { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#5A5A5A' },
  paymentChipTextActive: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, marginTop: 8,
  },
  bookBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  // ── Mobile Money modal ────────────────────────────────────────
  modalWrap:    { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },

  momoSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 24, elevation: 20,
  },
  momoHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20 },

  momoHeader:  { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  momoTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  momoSub:   { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#8A8A8A', marginTop: 2 },

  networkLogos: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  networkLogoCard: {
    flex: 1, backgroundColor: '#F7F7F7', borderRadius: 12,
    paddingVertical: 4, paddingHorizontal: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  networkLogoImg: { width: '100%', height: 100 },

  amountRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F7FDF9', borderRadius: 14, padding: 16, marginBottom: 20 },
  amountLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B6B6B' },
  amountValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#00B14F' },

  inputLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#6B6B6B', marginBottom: 8 },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 14, overflow: 'hidden', marginBottom: 8 },
  countryCode: { backgroundColor: '#F5F5F5', paddingHorizontal: 14, paddingVertical: 14, borderRightWidth: 1, borderRightColor: '#E8E8E8' },
  countryCodeText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },
  phoneInput: { flex: 1, paddingHorizontal: 14, fontSize: 16, fontFamily: 'Inter_400Regular', color: '#1A1A1A', paddingVertical: 14 },

  networkHint: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#AAAAAA', marginBottom: 24 },

  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00B14F', borderRadius: 30, paddingVertical: 16,
  },
  payBtnDisabled: { backgroundColor: '#A8DFC0' },
  payBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
