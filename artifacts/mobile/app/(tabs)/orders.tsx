import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path, G, Defs, ClipPath } from 'react-native-svg';

// ─── GXS Logo ────────────────────────────────────────────────────────────────
function GXSLogo({ size = 38 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <LinearGradient colors={['#7B2FF7', '#00C6A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: size * 0.32, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 }}>GXS</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Web3 Logo ────────────────────────────────────────────────────────────────
function Web3Logo({ size = 38 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <LinearGradient colors={['#3B0087', '#7B2FF7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: size * 0.38, fontFamily: 'Inter_700Bold' }}>W3</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Mastercard ───────────────────────────────────────────────────────────────
function MastercardIcon({ size = 36 }: { size?: number }) {
  const r = size / 2;
  const offset = size * 0.28;
  return (
    <Svg width={size + offset} height={size} viewBox={`0 0 ${size + offset} ${size}`}>
      <Circle cx={r} cy={r} r={r} fill="#EB001B" opacity={0.95} />
      <Circle cx={r + offset} cy={r} r={r} fill="#F79E1B" opacity={0.95} />
    </Svg>
  );
}

// ─── Card wave decoration ─────────────────────────────────────────────────────
function CardWave() {
  return (
    <Svg width={200} height={140} style={{ position: 'absolute', right: 0, top: 0, opacity: 0.15 }}>
      <Path d="M200,0 Q140,70 200,140" stroke="#FFF" strokeWidth={60} fill="none" />
      <Path d="M170,0 Q110,70 170,140" stroke="#FFF" strokeWidth={40} fill="none" />
    </Svg>
  );
}

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.75}>
          <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* My Card section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>My Card</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.75}>
            <Ionicons name="add" size={16} color="#1A1A1A" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet card */}
        <LinearGradient
          colors={['#00C853', '#00B14F', '#009A3E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletCard}
        >
          <CardWave />
          <View style={styles.cardTop}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <MastercardIcon size={28} />
          </View>
          <Text style={styles.walletAmount}>$0.00</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.grabCardText}>Grab Card</Text>
            <Text style={styles.cardExpiry}>05/29</Text>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <View style={styles.actionIcon}>
              <Ionicons name="wallet-outline" size={22} color="#1A1A1A" />
            </View>
            <Text style={styles.actionLabel}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <View style={styles.actionIcon}>
              <Ionicons name="scan-outline" size={22} color="#1A1A1A" />
            </View>
            <Text style={styles.actionLabel}>Scan to Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <View style={styles.actionIcon}>
              <Ionicons name="swap-horizontal-outline" size={22} color="#1A1A1A" />
            </View>
            <Text style={styles.actionLabel}>Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Financial services */}
        <Text style={styles.fsLabel}>Financial services</Text>
        <View style={styles.fsCard}>
          <TouchableOpacity style={styles.fsRow} activeOpacity={0.75}>
            <GXSLogo size={42} />
            <Text style={styles.fsName}>FlexiLoan</Text>
            <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
          </TouchableOpacity>
          <View style={styles.fsDivider} />
          <TouchableOpacity style={styles.fsRow} activeOpacity={0.75}>
            <Web3Logo size={42} />
            <Text style={styles.fsName}>Web3</Text>
            <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7' },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
  },
  settingsBtn: {
    position: 'absolute',
    right: 20,
    bottom: 14,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 20, gap: 0 },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
  },

  walletCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 148,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  walletAmount: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 6,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  grabCardText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  cardExpiry: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.85)',
  },

  actionsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    textAlign: 'center',
  },

  fsLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  fsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  fsName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
  },
  fsDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 70,
  },
});
