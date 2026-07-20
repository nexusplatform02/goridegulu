import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CARD_TYPES = ['Visa', 'Mastercard', 'Amex'];

export default function AddCardScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;

  const [selectedType, setSelectedType] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function handleSave() {
    if (!cardName || cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5 || cvv.length < 3) {
      Alert.alert('Incomplete', 'Please fill in all card details.');
      return;
    }
    Alert.alert('Card Added', 'Your card has been saved successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  const isComplete = cardName.length > 0
    && cardNumber.replace(/\s/g, '').length === 16
    && expiry.length === 5
    && cvv.length >= 3;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewTop}>
            <Ionicons name="wifi-outline" size={22} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
            <Text style={styles.cardPreviewType}>{selectedType}</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>
            {cardNumber
              ? cardNumber.padEnd(19, ' ').replace(/(.{4})/g, (g, i) => g.trim().padEnd(4, '•') + ' ').trim()
              : '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewMeta}>CARDHOLDER</Text>
              <Text style={styles.cardPreviewValue}>{cardName || '—'}</Text>
            </View>
            <View>
              <Text style={styles.cardPreviewMeta}>EXPIRES</Text>
              <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        {/* Card type picker */}
        <Text style={styles.fieldLabel}>Card Type</Text>
        <View style={styles.typeRow}>
          {CARD_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, selectedType === t && styles.typeChipActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.typeChipText, selectedType === t && styles.typeChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cardholder name */}
        <Text style={styles.fieldLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name as on card"
          placeholderTextColor="#BBBBBB"
          value={cardName}
          onChangeText={setCardName}
          autoCapitalize="words"
        />

        {/* Card number */}
        <Text style={styles.fieldLabel}>Card Number</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#BBBBBB"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={v => setCardNumber(formatCardNumber(v))}
            maxLength={19}
          />
          <View style={styles.inputIcon}>
            <Ionicons name="card-outline" size={20} color="#AAAAAA" />
          </View>
        </View>

        {/* Expiry + CVV */}
        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#BBBBBB"
              keyboardType="number-pad"
              value={expiry}
              onChangeText={v => setExpiry(formatExpiry(v))}
              maxLength={5}
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="•••"
                placeholderTextColor="#BBBBBB"
                keyboardType="number-pad"
                secureTextEntry
                value={cvv}
                onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
              />
              <View style={styles.inputIcon}>
                <Ionicons name="help-circle-outline" size={18} color="#AAAAAA" />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.secureNote}>
          <Ionicons name="lock-closed-outline" size={12} color="#AAAAAA" /> Your card info is encrypted and stored securely.
        </Text>
      </ScrollView>

      {/* Save button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={[styles.saveBtn, !isComplete && styles.saveBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Card</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1A1A1A' },

  scroll: { flex: 1, paddingHorizontal: 16 },

  cardPreview: {
    backgroundColor: '#00B14F',
    borderRadius: 28,
    padding: 22,
    marginTop: 20,
    marginBottom: 24,
    minHeight: 170,
    justifyContent: 'space-between',
    shadowColor: '#00B14F',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardPreviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPreviewType: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  cardPreviewNumber: { fontSize: 18, fontFamily: 'PlusJakartaSans_400Regular', color: '#FFFFFF', letterSpacing: 2, marginVertical: 18 },
  cardPreviewBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardPreviewMeta: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.8 },
  cardPreviewValue: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF', marginTop: 2 },

  fieldLabel: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9A9A9A',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeChip: {
    paddingHorizontal: 18, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#EBEBEB',
  },
  typeChipActive: { borderColor: '#00B14F', backgroundColor: '#E8F5EE' },
  typeChipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9A9A9A' },
  typeChipTextActive: { color: '#00B14F' },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#1A1A1A',
    marginBottom: 18,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  inputIcon: {
    position: 'absolute', right: 14, bottom: 18 + 4,
  },

  fieldRow: { flexDirection: 'row', marginBottom: 0 },

  secureNote: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#AAAAAA',
    textAlign: 'center', marginTop: 4,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 10,
  },
  saveBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    alignItems: 'center', paddingVertical: 16,
  },
  saveBtnDisabled: { backgroundColor: '#B8DDCA' },
  saveBtnText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
});
