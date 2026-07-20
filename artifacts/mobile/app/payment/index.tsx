import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SAVED_METHODS = [
  { id: 'grab', label: 'GrabPay Wallet', sub: 'Balance: UGX 12,000', icon: 'wallet-outline' as const, color: '#00B14F' },
  { id: 'momo', label: 'Mobile Money', sub: 'MTN MoMo · Airtel Money', icon: 'phone-portrait-outline' as const, color: '#FFCC00' },
];

const CARD_TYPES = [
  { id: 'visa', label: 'Visa', icon: 'card-outline' as const },
  { id: 'mastercard', label: 'Mastercard', icon: 'card-outline' as const },
  { id: 'amex', label: 'Amex', icon: 'card-outline' as const },
];

export default function PaymentWalletScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [saved, setSaved] = useState(false);

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function handleSaveCard() {
    if (!cardNumber || !expiry || !cvv || !cardName) return;
    setSaved(true);
    setShowAddCard(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* GrabPay balance banner */}
        <View style={styles.balanceBanner}>
          <View>
            <Text style={styles.balanceLabel}>GrabPay Balance</Text>
            <Text style={styles.balanceAmount}>UGX 12,000</Text>
          </View>
          <View style={styles.balanceIconWrap}>
            <Ionicons name="wallet" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* Saved methods */}
        <Text style={styles.sectionLabel}>Your Payment Methods</Text>
        {SAVED_METHODS.map(m => (
          <View key={m.id} style={styles.methodCard}>
            <View style={[styles.methodIconWrap, { backgroundColor: m.color + '20' }]}>
              <Ionicons name={m.icon} size={20} color={m.color} />
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
          </View>
        ))}

        {/* Saved card (if user added one) */}
        {saved && (
          <View style={[styles.methodCard, styles.methodCardSaved]}>
            <View style={[styles.methodIconWrap, { backgroundColor: '#E8F5EE' }]}>
              <Ionicons name="card-outline" size={20} color="#00B14F" />
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodLabel}>Credit / Debit Card</Text>
              <Text style={styles.methodSub}>Card saved successfully</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#00B14F" />
          </View>
        )}

        {/* Add card CTA */}
        {!showAddCard && (
          <TouchableOpacity style={styles.addCardBtn} activeOpacity={0.8} onPress={() => setShowAddCard(true)}>
            <View style={styles.addCardIconWrap}>
              <Ionicons name="add" size={20} color="#00B14F" />
            </View>
            <Text style={styles.addCardText}>Add a Credit / Debit Card</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
          </TouchableOpacity>
        )}

        {/* Add card form */}
        {showAddCard && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Card</Text>

            <Text style={styles.fieldLabel}>Card Type</Text>
            <View style={styles.cardTypeRow}>
              {CARD_TYPES.map(ct => (
                <View key={ct.id} style={styles.cardTypeChip}>
                  <Ionicons name={ct.icon} size={14} color="#555" />
                  <Text style={styles.cardTypeLabel}>{ct.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name on card"
              placeholderTextColor="#AAAAAA"
              value={cardName}
              onChangeText={setCardName}
            />

            <Text style={styles.fieldLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#AAAAAA"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={v => setCardNumber(formatCardNumber(v))}
              maxLength={19}
            />

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Text style={styles.fieldLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={v => setExpiry(formatExpiry(v))}
                  maxLength={5}
                />
              </View>
              <View style={[styles.fieldHalf, { marginLeft: 12 }]}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="•••"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={cvv}
                  onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={() => setShowAddCard(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSaveCard}>
                <Text style={styles.saveBtnText}>Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },

  scroll: { flex: 1 },

  balanceBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#00B14F', marginHorizontal: 16, marginTop: 16,
    borderRadius: 18, paddingHorizontal: 20, paddingVertical: 20,
  },
  balanceLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginTop: 4 },
  balanceIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  sectionLabel: {
    fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#9A9A9A',
    marginHorizontal: 16, marginTop: 22, marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  methodCardSaved: { borderWidth: 1.5, borderColor: '#00B14F' },
  methodIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  methodText: { flex: 1 },
  methodLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  methodSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9A9A9A', marginTop: 2 },

  addCardBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1.5, borderColor: '#E8F5EE',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  addCardIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  addCardText: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#00B14F' },

  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    marginHorizontal: 16, marginTop: 4, marginBottom: 10,
    paddingHorizontal: 16, paddingVertical: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  formTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A1A1A', marginBottom: 16 },

  cardTypeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  cardTypeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F5F5F5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  cardTypeLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#555555' },

  fieldLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#9A9A9A', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: {
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: '#1A1A1A',
    marginBottom: 14,
  },
  fieldRow: { flexDirection: 'row' },
  fieldHalf: { flex: 1 },

  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', paddingVertical: 14,
  },
  cancelBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#9A9A9A' },
  saveBtn: {
    flex: 1, backgroundColor: '#00B14F', borderRadius: 14,
    alignItems: 'center', paddingVertical: 14,
  },
  saveBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
});
