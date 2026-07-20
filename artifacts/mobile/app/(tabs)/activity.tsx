import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Text as SvgText, Line, Circle, Path, G } from 'react-native-svg';

// ─── GXS logo ────────────────────────────────────────────────────────────────
function GXSLogo({ size = 36 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <LinearGradient colors={['#7B2FF7', '#00C6A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: size * 0.3, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 }}>GXS</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Bar chart for statistics ─────────────────────────────────────────────────
const WEEKLY = [
  { day: 'Mon', amount: 12 },
  { day: 'Tue', amount: 45 },
  { day: 'Wed', amount: 28 },
  { day: 'Thu', amount: 65 },
  { day: 'Fri', amount: 38 },
  { day: 'Sat', amount: 82 },
  { day: 'Sun', amount: 20 },
];
const MAX_VAL = 100;

function BarChart() {
  const W = 320;
  const H = 160;
  const barW = 28;
  const gap = (W - WEEKLY.length * barW) / (WEEKLY.length + 1);
  const maxBarH = 100;
  const baseY = H - 28;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = baseY - (v / MAX_VAL) * maxBarH;
        return (
          <Line key={v} x1={0} y1={y} x2={W} y2={y}
            stroke="#F0F0F0" strokeWidth={1} />
        );
      })}

      {WEEKLY.map((item, i) => {
        const x = gap + i * (barW + gap);
        const barH = (item.amount / MAX_VAL) * maxBarH;
        const y = baseY - barH;
        const isHighest = item.amount === Math.max(...WEEKLY.map(w => w.amount));

        return (
          <G key={item.day}>
            {/* Bar */}
            <Rect
              x={x} y={y} width={barW} height={barH}
              rx={8}
              fill={isHighest ? '#00B14F' : '#E8F8EF'}
            />
            {/* Day label */}
            <SvgText
              x={x + barW / 2} y={baseY + 18}
              fontSize={10} fill={isHighest ? '#00B14F' : '#AAAAAA'}
              textAnchor="middle" fontWeight={isHighest ? '700' : '400'}
            >{item.day}</SvgText>
            {/* Amount above bar for highest */}
            {isHighest && (
              <SvgText
                x={x + barW / 2} y={y - 6}
                fontSize={10} fill="#00B14F"
                textAnchor="middle" fontWeight="700"
              >${item.amount}</SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

// ─── Spend category row ───────────────────────────────────────────────────────
function CategoryBar({ label, amount, total, color, icon }: {
  label: string; amount: number; total: number; color: string; icon: string;
}) {
  const pct = amount / total;
  return (
    <View style={catStyles.row}>
      <View style={[catStyles.iconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={catStyles.info}>
        <View style={catStyles.labelRow}>
          <Text style={catStyles.label}>{label}</Text>
          <Text style={catStyles.amount}>${amount.toFixed(2)}</Text>
        </View>
        <View style={catStyles.track}>
          <View style={[catStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}
const catStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info: { flex: 1, gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },
  amount: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  track: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 4 },
});

// ─── Dashboard view ───────────────────────────────────────────────────────────
function DashboardView({ bottomPad }: { bottomPad: number }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.dashContent, { paddingBottom: 120 + bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Payment methods row */}
      <View style={styles.paymentRow}>
        {/* GXS card */}
        <LinearGradient
          colors={['#1B4332', '#2D6A4F', '#40916C']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.gxsCard}
        >
          <GXSLogo size={36} />
          <Text style={styles.gxsTitle}>GXS Savings Account</Text>
          <Text style={styles.gxsSub}>Set up now</Text>
        </LinearGradient>

        {/* Add payment method */}
        <TouchableOpacity style={styles.addPayCard} activeOpacity={0.75}>
          <View style={styles.addPayIcon}>
            <Ionicons name="add" size={24} color="#8A8A8A" />
          </View>
          <Text style={styles.addPayText}>Add payment method</Text>
        </TouchableOpacity>
      </View>

      {/* Business Centre */}
      <TouchableOpacity style={styles.bizRow} activeOpacity={0.75}>
        <Text style={styles.bizLabel}>Business Centre</Text>
        <Ionicons name="briefcase-outline" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* My Account */}
      <Text style={styles.sectionHead}>My Account</Text>
      <View style={styles.accountCard}>
        {[
          { label: 'Rewards Member', right: '0 points', chevron: true },
          { label: 'Favourites', right: null, chevron: true },
          { label: 'Payment Methods', right: null, chevron: true },
          { label: 'Scheduled Rides', right: null, chevron: true },
          { label: 'Saved Places', right: null, chevron: true },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.accountRow} activeOpacity={0.75}>
              <Text style={styles.accountLabel}>{item.label}</Text>
              <View style={styles.accountRight}>
                {item.right && (
                  <Text style={styles.accountValue}>{item.right}</Text>
                )}
                <Ionicons name="chevron-forward" size={16} color="#C0C0C0" />
              </View>
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.accountDivider} />}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Activity / Statistics view ───────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Transport', amount: 48.50, total: 200, color: '#00B14F', icon: 'car-sport-outline' },
  { label: 'Food & Drink', amount: 82.20, total: 200, color: '#FF6B2B', icon: 'fast-food-outline' },
  { label: 'Groceries', amount: 35.40, total: 200, color: '#2D7DD2', icon: 'basket-outline' },
  { label: 'Shopping', amount: 24.99, total: 200, color: '#E07800', icon: 'bag-handle-outline' },
];

const RECENT_TX = [
  { id: '1', title: 'GrabCar ride', sub: 'Completed · 2.4 km', amount: -8.50, icon: 'car-sport-outline', color: '#00B14F', bg: '#E0F5EA', date: 'Today, 10:22 AM' },
  { id: '2', title: 'Bubble Milk Tea', sub: 'GrabFood · Boba House', amount: -14.80, icon: 'fast-food-outline', color: '#FF6B2B', bg: '#FFF0E8', date: 'Today, 08:15 AM' },
  { id: '3', title: 'Fresh Milk 1L × 2', sub: 'GrabMart', amount: -7.00, icon: 'basket-outline', color: '#2D7DD2', bg: '#E3F0FF', date: 'Yesterday' },
  { id: '4', title: 'Top Up', sub: 'Grab Wallet', amount: +50.00, icon: 'wallet-outline', color: '#00B14F', bg: '#E0F5EA', date: 'Yesterday' },
  { id: '5', title: 'Running Sneakers', sub: 'GrabShop', amount: -45.00, icon: 'bag-handle-outline', color: '#E07800', bg: '#FFF4E0', date: '2 days ago' },
];

function ActivityView({ bottomPad }: { bottomPad: number }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.actContent, { paddingBottom: 120 + bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary card */}
      <LinearGradient
        colors={['#00C853', '#00B14F', '#009A3E']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryPeriod}>This Month · July 2026</Text>
        <Text style={styles.summaryAmount}>$191.09</Text>
        <Text style={styles.summarySub}>Total spent across all services</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemVal}>24</Text>
            <Text style={styles.summaryItemLbl}>Trips</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemVal}>12</Text>
            <Text style={styles.summaryItemLbl}>Orders</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemVal}>$82</Text>
            <Text style={styles.summaryItemLbl}>Saved</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weekly chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weekly Spending</Text>
          <Text style={styles.chartSub}>Jul 14 – 20</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <BarChart />
        </View>
      </View>

      {/* Spend by category */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spend by Category</Text>
      </View>
      <View style={styles.catCard}>
        {CATEGORIES.map((c) => (
          <CategoryBar key={c.label} {...c} />
        ))}
      </View>

      {/* Recent transactions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      <View style={styles.txCard}>
        {RECENT_TX.map((tx, i) => (
          <React.Fragment key={tx.id}>
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: tx.bg }]}>
                <Ionicons name={tx.icon as any} size={18} color={tx.color} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txSub}>{tx.sub}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#00B14F' : '#1A1A1A' }]}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
            {i < RECENT_TX.length - 1 && <View style={styles.txDivider} />}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [tab, setTab] = useState<'dashboard' | 'activity'>('dashboard');

  return (
    <View style={styles.root}>
      {/* Header spacer */}
      <View style={{ height: topPad, backgroundColor: '#FFFFFF' }} />

      {/* User row */}
      <View style={styles.userRow}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JC</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Jason Carter</Text>
          <Text style={styles.userEmail}>jcarter92@emailusa.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
      </View>

      {/* Dashboard / Activity toggle */}
      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'dashboard' && styles.tabBtnActive]}
            onPress={() => setTab('dashboard')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'dashboard' && styles.tabTextActive]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'activity' && styles.tabBtnActive]}
            onPress={() => setTab('activity')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'activity' && styles.tabTextActive]}>Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'dashboard'
        ? <DashboardView bottomPad={bottomPad} />
        : <ActivityView bottomPad={bottomPad} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7' },

  userRow: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#00B14F' },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  userEmail: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },

  tabWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 26,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#00B14F' },
  tabText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#8A8A8A' },
  tabTextActive: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },

  // ── Dashboard ──
  dashContent: { padding: 16, gap: 0 },

  paymentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gxsCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  gxsTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  gxsSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },

  addPayCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  addPayIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  addPayText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#8A8A8A', textAlign: 'center', paddingHorizontal: 8 },

  bizRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  bizLabel: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },

  sectionHead: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  accountLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#1A1A1A' },
  accountRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  accountValue: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  accountDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 18 },

  // ── Activity / Stats ──
  actContent: { padding: 16, gap: 0 },

  summaryCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
  },
  summaryPeriod: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  summarySub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)', marginBottom: 18 },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingVertical: 12,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryItemVal: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  summaryItemLbl: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chartTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  chartSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#AAAAAA' },

  sectionHeader: { marginBottom: 10, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },

  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },

  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  txIcon: {
    width: 40, height: 40, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  txInfo: { flex: 1, gap: 2 },
  txTitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#1A1A1A' },
  txSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  txDate: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#BBBBBB' },
  txAmount: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  txDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 68 },
});
