import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, PanResponder, TextInput, Platform, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = 420;

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;

  const [selectedDelivery, setSelectedDelivery] = useState<'priority' | 'standard'>('standard');
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [addressNote, setAddressNote] = useState('');
  const [driverNote, setDriverNote] = useState('');
  const [saveToFav, setSaveToFav] = useState(false);

  // Bottom sheet animation
  const sheetY = useRef(new Animated.Value(SHEET_H)).current;

  function openSheet() {
    setShowSaveSheet(true);
    Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
  }

  function closeSheet() {
    Animated.timing(sheetY, { toValue: SHEET_H, duration: 240, useNativeDriver: true }).start(() =>
      setShowSaveSheet(false)
    );
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) closeSheet();
        else Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const priorityFee = 8.30;
  const standardFee = 5.80;
  const subtotal = 18.10;
  const deliveryFee = selectedDelivery === 'priority' ? priorityFee : standardFee;
  const total = (subtotal + deliveryFee).toFixed(2);

  function handlePlaceOrder() {
    openSheet();
  }

  function handleSkip() {
    closeSheet();
    setTimeout(() => router.push('/food/tracking'), 280);
  }

  function handleSave() {
    closeSheet();
    setTimeout(() => router.push('/food/tracking'), 280);
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Woke Ramen - Changi Airport Ter..</Text>
          <Text style={styles.headerSub}>Distance from you: 8.2 km</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery row */}
        <View style={styles.card}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryAvatarWrap}>
              <Ionicons name="bicycle" size={20} color="#00B14F" />
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>Delivery</Text>
              <Text style={styles.deliverySubLabel}>Deliver now</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flexibility banner */}
        <View style={styles.flexCard}>
          <View style={styles.flexText}>
            <Text style={styles.flexTitle}>Want more flexibility?</Text>
            <Text style={styles.flexSub}>
              Order for later to pick the best delivery{'\n'}time slot and fees for you.
            </Text>
          </View>
          <Ionicons name="calendar-outline" size={24} color="#9A9A9A" />
        </View>

        {/* Address row */}
        <View style={styles.card}>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={18} color="#9A9A9A" />
            <View style={styles.addressText}>
              <Text style={styles.addressMain} numberOfLines={1}>Jewel Level 2 Pick-up Pillar 7, Jewel Ch...</Text>
              <Text style={styles.addressSub}>78 Airport Boulevard, Singapore, 819666</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
          </View>
          <View style={styles.divider} />
          <View style={styles.addInstructRow}>
            <Text style={styles.addInstructText}>Add address details and delivery instructions</Text>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Options */}
        <View style={styles.card}>
          <View style={styles.deliveryOptHeader}>
            <View style={styles.deliveryAvatarWrap}>
              <Ionicons name="bicycle" size={20} color="#00B14F" />
            </View>
            <Text style={styles.deliveryOptTitle}>Delivery Options</Text>
          </View>

          {/* Priority */}
          <TouchableOpacity
            style={[styles.optionRow, selectedDelivery === 'priority' && styles.optionRowSelected]}
            activeOpacity={0.85}
            onPress={() => setSelectedDelivery('priority')}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionLabelRow}>
                <Text style={styles.optionName}>Priority</Text>
                <Text style={styles.optionTime}>  &lt; 15 mins</Text>
                <Ionicons name="information-circle-outline" size={14} color="#9A9A9A" style={{ marginLeft: 3 }} />
                <View style={{ flex: 1 }} />
                <Text style={styles.optionPrice}>{priorityFee.toFixed(2)}</Text>
              </View>
              <Text style={styles.optionDesc}>
                We'll prioritise finding you a driver. You'll get a{'\n'}voucher if no driver is available.
              </Text>
            </View>
            <View style={[styles.radioOuter, selectedDelivery === 'priority' && styles.radioOuterActive]}>
              {selectedDelivery === 'priority' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Standard */}
          <TouchableOpacity
            style={[styles.optionRow, selectedDelivery === 'standard' && styles.optionRowSelected]}
            activeOpacity={0.85}
            onPress={() => setSelectedDelivery('standard')}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionLabelRow}>
                <Text style={styles.optionName}>Standard</Text>
                <Text style={styles.optionTime}>  15 mins</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.optionPrice}>{standardFee.toFixed(2)}</Text>
              </View>
            </View>
            <View style={[styles.radioOuter, selectedDelivery === 'standard' && styles.radioOuterActive]}>
              {selectedDelivery === 'standard' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Total row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
      </ScrollView>

      {/* Place Order bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.88} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Save location bottom sheet */}
      {showSaveSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSheet} activeOpacity={1} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
            {/* Drag handle */}
            <View {...panResponder.panHandlers} style={styles.sheetHandle}>
              <View style={styles.handleBar} />
            </View>

            <Text style={styles.sheetTitle}>Do you want to save this location?</Text>

            <Text style={styles.sheetInputLabel}>Address details</Text>
            <TextInput
              style={styles.sheetInput}
              placeholder="e.g. Floor, unit number"
              placeholderTextColor="#BBBBBB"
              value={addressNote}
              onChangeText={setAddressNote}
            />

            <Text style={styles.sheetInputLabel}>Note to driver</Text>
            <TextInput
              style={styles.sheetInput}
              placeholder="e.g. Meet me at the lobby"
              placeholderTextColor="#BBBBBB"
              value={driverNote}
              onChangeText={setDriverNote}
            />

            <View style={styles.saveToFavRow}>
              <View>
                <Text style={styles.saveToFavTitle}>Add to Saved Places</Text>
                <Text style={styles.saveToFavSub}>Save this place for future orders.</Text>
              </View>
              <TouchableOpacity onPress={() => setSaveToFav(v => !v)}>
                <Ionicons
                  name={saveToFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={saveToFav ? '#E53935' : '#9A9A9A'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetButtons}>
              <TouchableOpacity style={styles.skipBtn} activeOpacity={0.88} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  headerSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 1 },

  scroll: { flex: 1 },

  // Cards
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 16, marginTop: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  // Delivery row
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deliveryAvatarWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  deliveryInfo: { flex: 1 },
  deliveryLabel: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  deliverySubLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 1 },
  changeLink: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#00B14F' },

  // Flexibility banner
  flexCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 16, marginTop: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  flexText: { flex: 1 },
  flexTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  flexSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 3, lineHeight: 16 },

  // Address
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addressText: { flex: 1 },
  addressMain: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  addressSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  addInstructRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addInstructText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },

  // Delivery Options
  deliveryOptHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  deliveryOptTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },

  optionRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, gap: 10 },
  optionRowSelected: {},
  optionLeft: { flex: 1 },
  optionLabelRow: { flexDirection: 'row', alignItems: 'center' },
  optionName: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  optionTime: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9A9A9A' },
  optionPrice: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  optionDesc: {
    fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A',
    marginTop: 4, lineHeight: 17,
  },

  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#CCCCCC',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  radioOuterActive: { borderColor: '#00B14F' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },

  // Total
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 16, paddingVertical: 4,
  },
  totalLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },
  totalAmount: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 10,
  },
  placeOrderBtn: {
    backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 16,
  },
  placeOrderText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },

  // Save location sheet
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36,
    minHeight: SHEET_H,
  },
  sheetHandle: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  sheetTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 20 },
  sheetInputLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#9A9A9A', marginBottom: 6 },
  sheetInput: {
    borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: 'Inter_400Regular', color: '#1A1A1A',
    marginBottom: 16, backgroundColor: '#FAFAFA',
  },
  saveToFavRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 6, marginBottom: 24,
  },
  saveToFavTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  saveToFavSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 2 },
  sheetButtons: { flexDirection: 'row', gap: 12 },
  skipBtn: {
    flex: 1, backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 15,
  },
  skipText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  saveBtn: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', paddingVertical: 15,
  },
  saveBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
});
