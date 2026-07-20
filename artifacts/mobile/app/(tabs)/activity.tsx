import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Modal, Pressable, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Text as SvgText, Line, Circle, G } from 'react-native-svg';

// ─── GXS logo ────────────────────────────────────────────────────────────────
function GXSLogo({ size = 36 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <LinearGradient colors={['#7B2FF7', '#00C6A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: size * 0.3, fontFamily: 'Aeonik-Bold', letterSpacing: -0.5 }}>GXS</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
const WEEKS: Record<string, { day: string; amount: number }[]> = {
  'Jul 14–20': [
    { day: 'Mon', amount: 12 }, { day: 'Tue', amount: 45 }, { day: 'Wed', amount: 28 },
    { day: 'Thu', amount: 65 }, { day: 'Fri', amount: 38 }, { day: 'Sat', amount: 82 }, { day: 'Sun', amount: 20 },
  ],
  'Jul 7–13': [
    { day: 'Mon', amount: 30 }, { day: 'Tue', amount: 18 }, { day: 'Wed', amount: 55 },
    { day: 'Thu', amount: 22 }, { day: 'Fri', amount: 70 }, { day: 'Sat', amount: 44 }, { day: 'Sun', amount: 10 },
  ],
};
const WEEK_KEYS = Object.keys(WEEKS);

function BarChart({ data }: { data: { day: string; amount: number }[] }) {
  const W = 320; const H = 160; const barW = 28;
  const gap = (W - data.length * barW) / (data.length + 1);
  const maxBarH = 100; const baseY = H - 28;
  const maxVal = Math.max(...data.map(d => d.amount));
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0, 25, 50, 75, 100].map((v) => (
        <Line key={v} x1={0} y1={baseY - (v / 100) * maxBarH} x2={W} y2={baseY - (v / 100) * maxBarH}
          stroke="#F0F0F0" strokeWidth={1} />
      ))}
      {data.map((item, i) => {
        const x = gap + i * (barW + gap);
        const barH = (item.amount / 100) * maxBarH;
        const y = baseY - barH;
        const isHighest = item.amount === maxVal;
        return (
          <G key={item.day}>
            <Rect x={x} y={y} width={barW} height={barH} rx={8} fill={isHighest ? '#00B14F' : '#E8F8EF'} />
            <SvgText x={x + barW / 2} y={baseY + 18} fontSize={10}
              fill={isHighest ? '#00B14F' : '#AAAAAA'} textAnchor="middle" fontWeight={isHighest ? '700' : '400'}>
              {item.day}
            </SvgText>
            {isHighest && (
              <SvgText x={x + barW / 2} y={y - 6} fontSize={10} fill="#00B14F" textAnchor="middle" fontWeight="700">
                ${item.amount}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

// ─── Category bar ─────────────────────────────────────────────────────────────
function CategoryBar({ label, amount, total, color, icon }: { label: string; amount: number; total: number; color: string; icon: string }) {
  return (
    <View style={cat.row}>
      <View style={[cat.iconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={cat.info}>
        <View style={cat.labelRow}>
          <Text style={cat.label}>{label}</Text>
          <Text style={cat.amount}>${amount.toFixed(2)}</Text>
        </View>
        <View style={cat.track}>
          <View style={[cat.fill, { width: `${(amount / total) * 100}%` as any, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}
const cat = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info: { flex: 1, gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  amount: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  track: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 4 },
});

// ─── Bottom sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sh.overlay} onPress={onClose} />
      <View style={sh.sheet}>
        <View style={sh.handle} />
        <View style={sh.sheetHeader}>
          <Text style={sh.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </Modal>
  );
}
const sh = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  sheetTitle: { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Transport', amount: 48.50, total: 200, color: '#00B14F', icon: 'car-sport-outline' },
  { label: 'Food & Drink', amount: 82.20, total: 200, color: '#FF6B2B', icon: 'fast-food-outline' },
  { label: 'Groceries', amount: 35.40, total: 200, color: '#2D7DD2', icon: 'basket-outline' },
  { label: 'Shopping', amount: 24.99, total: 200, color: '#E07800', icon: 'bag-handle-outline' },
];

const ALL_TX = [
  { id: '1', title: 'GrabCar ride', sub: 'Completed · 2.4 km', amount: -8.50, icon: 'car-sport-outline', color: '#00B14F', bg: '#E0F5EA', date: 'Today, 10:22 AM', cat: 'Transport' },
  { id: '2', title: 'Bubble Milk Tea', sub: 'GrabFood · Boba House', amount: -14.80, icon: 'fast-food-outline', color: '#FF6B2B', bg: '#FFF0E8', date: 'Today, 08:15 AM', cat: 'Food' },
  { id: '3', title: 'Fresh Milk 1L × 2', sub: 'GrabMart', amount: -7.00, icon: 'basket-outline', color: '#2D7DD2', bg: '#E3F0FF', date: 'Yesterday', cat: 'Groceries' },
  { id: '4', title: 'Top Up', sub: 'Grab Wallet', amount: +50.00, icon: 'wallet-outline', color: '#00B14F', bg: '#E0F5EA', date: 'Yesterday', cat: 'Wallet' },
  { id: '5', title: 'Running Sneakers', sub: 'GrabShop', amount: -45.00, icon: 'bag-handle-outline', color: '#E07800', bg: '#FFF4E0', date: '2 days ago', cat: 'Shopping' },
  { id: '6', title: 'GrabCar ride', sub: 'Completed · 5.1 km', amount: -12.30, icon: 'car-sport-outline', color: '#00B14F', bg: '#E0F5EA', date: '2 days ago', cat: 'Transport' },
  { id: '7', title: 'Chicken Fried Rice', sub: 'GrabFood · Warung Pak Ali', amount: -9.50, icon: 'fast-food-outline', color: '#FF6B2B', bg: '#FFF0E8', date: '3 days ago', cat: 'Food' },
  { id: '8', title: 'Grab Rewards', sub: '150 pts redeemed', amount: -0.00, icon: 'gift-outline', color: '#9B59B6', bg: '#F5EEF8', date: '4 days ago', cat: 'Rewards' },
];

const ACCOUNT_ITEMS = [
  { label: 'Rewards Member', right: '0 points', icon: 'gift-outline', sheet: 'rewards' },
  { label: 'Favourites', right: null, icon: 'heart-outline', sheet: 'favourites' },
  { label: 'Payment Methods', right: null, icon: 'card-outline', sheet: 'payment' },
  { label: 'Scheduled Rides', right: null, icon: 'time-outline', sheet: 'rides' },
  { label: 'Saved Places', right: null, icon: 'location-outline', sheet: 'places' },
  { label: 'Help & Support', right: null, icon: 'help-circle-outline', sheet: 'help' },
  { label: 'Privacy Settings', right: null, icon: 'shield-outline', sheet: 'privacy' },
];

// ─── Sheet contents ───────────────────────────────────────────────────────────
function RewardsSheet() {
  return (
    <View style={{ paddingBottom: 8 }}>
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Ionicons name="trophy-outline" size={36} color="#00B14F" />
        </View>
        <Text style={{ fontSize: 28, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' }}>0</Text>
        <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginTop: 4 }}>GrabRewards Points</Text>
      </View>
      {[
        { tier: 'Member', pts: '0–999 pts', active: true },
        { tier: 'Silver', pts: '1,000–4,999 pts', active: false },
        { tier: 'Gold', pts: '5,000–19,999 pts', active: false },
        { tier: 'Platinum', pts: '20,000+ pts', active: false },
      ].map(t => (
        <View key={t.tier} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.active ? '#00B14F' : '#E0E0E0' }} />
          <Text style={{ flex: 1, fontSize: 14, fontFamily: t.active ? 'Aeonik-Bold' : 'Aeonik-Regular', color: t.active ? '#1A1A1A' : '#8A8A8A' }}>{t.tier}</Text>
          <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#AAAAAA' }}>{t.pts}</Text>
        </View>
      ))}
    </View>
  );
}

function FavouritesSheet() {
  const favs = [
    { name: 'Boba House', sub: 'GrabFood · 4.8 ★', icon: 'fast-food-outline', color: '#FF6B2B' },
    { name: 'Home', sub: 'Saved place · 1.2 km', icon: 'home-outline', color: '#2D7DD2' },
    { name: 'Office', sub: 'Saved place · 4.5 km', icon: 'business-outline', color: '#00B14F' },
  ];
  return (
    <View>
      {favs.map((f, i) => (
        <View key={f.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: i < favs.length - 1 ? 1 : 0, borderBottomColor: '#F5F5F5' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: f.color + '18', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={f.icon as any} size={20} color={f.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' }}>{f.name}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' }}>{f.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#C0C0C0" />
        </View>
      ))}
    </View>
  );
}

function ScheduledRidesSheet() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 32, gap: 12 }}>
      <Ionicons name="time-outline" size={52} color="#D0D0D0" />
      <Text style={{ fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' }}>No Scheduled Rides</Text>
      <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', textAlign: 'center' }}>
        Schedule a ride in advance and it will appear here.
      </Text>
    </View>
  );
}

function SavedPlacesSheet() {
  const places = [
    { label: 'Home', addr: '12 Acacia Ave, Block 3', icon: 'home-outline' },
    { label: 'Office', addr: '88 Marina Boulevard, #12-01', icon: 'business-outline' },
    { label: 'Gym', addr: 'ActiveFit Mall Level 2', icon: 'barbell-outline' },
  ];
  return (
    <View>
      {places.map((p, i) => (
        <View key={p.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: i < places.length - 1 ? 1 : 0, borderBottomColor: '#F5F5F5' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={p.icon as any} size={20} color="#00B14F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' }}>{p.label}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' }}>{p.addr}</Text>
          </View>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="create-outline" size={18} color="#AAAAAA" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 }} activeOpacity={0.75}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="add" size={22} color="#8A8A8A" />
        </View>
        <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#00B14F' }}>Add a new place</Text>
      </TouchableOpacity>
    </View>
  );
}

function HelpSheet() {
  const topics = [
    { q: 'My driver hasn\'t arrived', icon: 'car-outline' },
    { q: 'I was overcharged', icon: 'card-outline' },
    { q: 'My order is wrong / missing items', icon: 'fast-food-outline' },
    { q: 'Report a safety issue', icon: 'warning-outline' },
    { q: 'Account & login help', icon: 'person-outline' },
  ];
  return (
    <View>
      <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginBottom: 14 }}>What can we help you with?</Text>
      {topics.map((t, i) => (
        <TouchableOpacity key={t.q} activeOpacity={0.75} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: i < topics.length - 1 ? 1 : 0, borderBottomColor: '#F5F5F5' }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={t.icon as any} size={18} color="#555" />
          </View>
          <Text style={{ flex: 1, fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' }}>{t.q}</Text>
          <Ionicons name="chevron-forward" size={16} color="#C0C0C0" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PrivacySheet() {
  const [prefs, setPrefs] = useState({ location: true, analytics: false, marketing: false });
  return (
    <View>
      {([
        { key: 'location', label: 'Location sharing', sub: 'Used for ride & delivery tracking' },
        { key: 'analytics', label: 'Analytics', sub: 'Help improve Grabby' },
        { key: 'marketing', label: 'Marketing emails', sub: 'Offers and promotions' },
      ] as const).map((item, i) => (
        <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: '#F5F5F5' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' }}>{item.label}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginTop: 2 }}>{item.sub}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
            style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: prefs[item.key] ? '#00B14F' : '#E0E0E0', justifyContent: 'center', paddingHorizontal: 3 }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', alignSelf: prefs[item.key] ? 'flex-end' : 'flex-start' }} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function PaymentMethodsSheet() {
  const methods = [
    { name: 'GrabPay Wallet', sub: 'Balance: UGX 12,000', icon: 'wallet-outline', color: '#00B14F' },
    { name: 'MTN MoMo', sub: 'Mobile Money', icon: 'phone-portrait-outline', color: '#FFCC00' },
  ];
  return (
    <View>
      {methods.map((m, i) => (
        <View key={m.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: m.color + '20', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={m.icon as any} size={20} color={m.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' }}>{m.name}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' }}>{m.sub}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#00B14F" />
        </View>
      ))}
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }} activeOpacity={0.75}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="add" size={22} color="#8A8A8A" />
        </View>
        <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#00B14F' }}>Add payment method</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Profile edit sheet ───────────────────────────────────────────────────────
function ProfileSheet({ onClose }: { onClose: () => void }) {
  const fields = [
    { label: 'Full Name', value: 'Jason Carter' },
    { label: 'Email', value: 'jcarter92@emailusa.com' },
    { label: 'Phone', value: '+1 (555) 012-3456' },
    { label: 'Date of Birth', value: '12 Mar 1992' },
  ];
  return (
    <View>
      <View style={{ alignItems: 'center', paddingBottom: 20 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Aeonik-Bold', color: '#00B14F' }}>JC</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: '#F0F0F0', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#555' }}>Change Photo</Text>
        </TouchableOpacity>
      </View>
      {fields.map((f, i) => (
        <View key={f.label} style={{ paddingVertical: 14, borderBottomWidth: i < fields.length - 1 ? 1 : 0, borderBottomColor: '#F5F5F5' }}>
          <Text style={{ fontSize: 11, fontFamily: 'Aeonik-Medium', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{f.label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' }}>{f.value}</Text>
            <Ionicons name="create-outline" size={18} color="#AAAAAA" />
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={{ backgroundColor: '#00B14F', borderRadius: 14, alignItems: 'center', paddingVertical: 15, marginTop: 20 }}
        activeOpacity={0.85} onPress={onClose}>
        <Text style={{ fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' }}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Dashboard view ───────────────────────────────────────────────────────────
function DashboardView({ bottomPad, onOpenSheet }: { bottomPad: number; onOpenSheet: (s: string) => void }) {
  return (
    <ScrollView contentContainerStyle={[styles.dashContent, { paddingBottom: 120 + bottomPad }]} showsVerticalScrollIndicator={false}>
      <View style={styles.paymentRow}>
        <LinearGradient colors={['#1B4332', '#2D6A4F', '#40916C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gxsCard}>
          <GXSLogo size={36} />
          <Text style={styles.gxsTitle}>GXS Savings Account</Text>
          <TouchableOpacity onPress={() => Alert.alert('GXS Bank', 'Redirecting to GXS savings account setup…')} activeOpacity={0.85}>
            <Text style={[styles.gxsSub, { color: '#A8F5C8' }]}>Set up now →</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity style={styles.addPayCard} activeOpacity={0.75} onPress={() => onOpenSheet('payment')}>
          <View style={styles.addPayIcon}><Ionicons name="add" size={24} color="#8A8A8A" /></View>
          <Text style={styles.addPayText}>Add payment{'\n'}method</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bizRow} activeOpacity={0.75} onPress={() => Alert.alert('Business Centre', 'Business tools and invoices coming soon.')}>
        <Text style={styles.bizLabel}>Business Centre</Text>
        <Ionicons name="briefcase-outline" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      <Text style={styles.sectionHead}>My Account</Text>
      <View style={styles.accountCard}>
        {ACCOUNT_ITEMS.map((item, i) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.accountRow} activeOpacity={0.75} onPress={() => onOpenSheet(item.sheet)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon as any} size={17} color="#555" />
                </View>
                <Text style={styles.accountLabel}>{item.label}</Text>
              </View>
              <View style={styles.accountRight}>
                {item.right && <Text style={styles.accountValue}>{item.right}</Text>}
                <Ionicons name="chevron-forward" size={16} color="#C0C0C0" />
              </View>
            </TouchableOpacity>
            {i < ACCOUNT_ITEMS.length - 1 && <View style={styles.accountDivider} />}
          </React.Fragment>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.bizRow, { marginTop: 16, borderWidth: 1.5, borderColor: '#FFE0E0' }]}
        activeOpacity={0.75}
        onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => {} },
        ])}
      >
        <Text style={[styles.bizLabel, { color: '#E53E3E' }]}>Sign Out</Text>
        <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Activity view ────────────────────────────────────────────────────────────
function ActivityView({ bottomPad }: { bottomPad: number }) {
  const [weekIdx, setWeekIdx] = useState(0);
  const [filter, setFilter] = useState<'All' | 'Transport' | 'Food' | 'Groceries' | 'Shopping'>('All');
  const weekKey = WEEK_KEYS[weekIdx];
  const filtered = filter === 'All' ? ALL_TX : ALL_TX.filter(t => t.cat === filter);

  return (
    <ScrollView contentContainerStyle={[styles.actContent, { paddingBottom: 120 + bottomPad }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C853', '#00B14F', '#009A3E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
        <Text style={styles.summaryPeriod}>This Month · July 2026</Text>
        <Text style={styles.summaryAmount}>$191.09</Text>
        <Text style={styles.summarySub}>Total spent across all services</Text>
        <View style={styles.summaryRow}>
          {[{ val: '24', lbl: 'Trips' }, { val: '12', lbl: 'Orders' }, { val: '$82', lbl: 'Saved' }].map((s, i) => (
            <React.Fragment key={s.lbl}>
              {i > 0 && <View style={styles.summaryDivider} />}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemVal}>{s.val}</Text>
                <Text style={styles.summaryItemLbl}>{s.lbl}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weekly Spending</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity onPress={() => setWeekIdx(i => Math.min(i + 1, WEEK_KEYS.length - 1))} disabled={weekIdx === WEEK_KEYS.length - 1}>
              <Ionicons name="chevron-back" size={18} color={weekIdx === WEEK_KEYS.length - 1 ? '#D0D0D0' : '#555'} />
            </TouchableOpacity>
            <Text style={styles.chartSub}>{weekKey}</Text>
            <TouchableOpacity onPress={() => setWeekIdx(i => Math.max(i - 1, 0))} disabled={weekIdx === 0}>
              <Ionicons name="chevron-forward" size={18} color={weekIdx === 0 ? '#D0D0D0' : '#555'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <BarChart data={WEEKS[weekKey]} />
        </View>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Spend by Category</Text></View>
      <View style={styles.catCard}>
        {CATEGORIES.map(c => <CategoryBar key={c.label} {...c} />)}
      </View>

      <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.sectionTitle}>Transactions</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 0 }}>
          {(['All', 'Transport', 'Food', 'Groceries', 'Shopping'] as const).map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.8}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f ? '#00B14F' : '#F0F0F0' }}>
              <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Medium', color: filter === f ? '#FFF' : '#555' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.txCard}>
        {filtered.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#AAAAAA' }}>No transactions in this category</Text>
          </View>
        ) : filtered.map((tx, i) => (
          <React.Fragment key={tx.id}>
            <TouchableOpacity style={styles.txRow} activeOpacity={0.75}
              onPress={() => Alert.alert(tx.title, `${tx.sub}\n${tx.date}\n\nAmount: ${tx.amount > 0 ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}`)}>
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
            </TouchableOpacity>
            {i < filtered.length - 1 && <View style={styles.txDivider} />}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [tab, setTab] = useState<'dashboard' | 'activity'>('dashboard');
  const [sheet, setSheet] = useState<string | null>(null);

  const sheetTitle = (s: string | null) => {
    switch (s) {
      case 'profile': return 'Edit Profile';
      case 'rewards': return 'GrabRewards';
      case 'favourites': return 'Favourites';
      case 'payment': return 'Payment Methods';
      case 'rides': return 'Scheduled Rides';
      case 'places': return 'Saved Places';
      case 'help': return 'Help & Support';
      case 'privacy': return 'Privacy Settings';
      default: return '';
    }
  };

  const renderSheetContent = (s: string | null) => {
    switch (s) {
      case 'profile': return <ProfileSheet onClose={() => setSheet(null)} />;
      case 'rewards': return <RewardsSheet />;
      case 'favourites': return <FavouritesSheet />;
      case 'payment': return <PaymentMethodsSheet />;
      case 'rides': return <ScheduledRidesSheet />;
      case 'places': return <SavedPlacesSheet />;
      case 'help': return <HelpSheet />;
      case 'privacy': return <PrivacySheet />;
      default: return null;
    }
  };

  return (
    <View style={styles.root}>
      <View style={{ height: topPad, backgroundColor: '#FFFFFF' }} />
      <TouchableOpacity style={styles.userRow} activeOpacity={0.75} onPress={() => setSheet('profile')}>
        <View style={styles.avatar}><Text style={styles.avatarText}>JC</Text></View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Jason Carter</Text>
          <Text style={styles.userEmail}>jcarter92@emailusa.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
      </TouchableOpacity>

      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          {(['dashboard', 'activity'] as const).map(t => (
            <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)} activeOpacity={0.8}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'dashboard' ? 'Dashboard' : 'Activity'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tab === 'dashboard'
        ? <DashboardView bottomPad={bottomPad} onOpenSheet={setSheet} />
        : <ActivityView bottomPad={bottomPad} />}

      {sheet !== null && (
        <BottomSheet visible={true} title={sheetTitle(sheet)} onClose={() => setSheet(null)}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {renderSheetContent(sheet)}
          </ScrollView>
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7' },
  userRow: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  avatar: { width: 48, height: 48, borderRadius: 28, backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#00B14F' },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 16, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  userEmail: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  tabWrap: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabBar: { flexDirection: 'row', backgroundColor: '#F2F2F2', borderRadius: 30, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 26, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#00B14F' },
  tabText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#8A8A8A' },
  tabTextActive: { color: '#FFFFFF', fontFamily: 'Aeonik-Medium' },
  dashContent: { padding: 16 },
  paymentRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  gxsCard: { flex: 1, borderRadius: 22, padding: 16, gap: 8, minHeight: 120, justifyContent: 'space-between' },
  gxsTitle: { fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },
  gxsSub: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.7)' },
  addPayCard: { flex: 1, borderRadius: 22, borderWidth: 1.5, borderColor: '#E8E8E8', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 8, backgroundColor: '#FFFFFF' },
  addPayIcon: { width: 40, height: 40, borderRadius: 28, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  addPayText: { fontSize: 11, fontFamily: 'Aeonik-Medium', color: '#8A8A8A', textAlign: 'center', paddingHorizontal: 8 },
  bizRow: { backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  bizLabel: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  sectionHead: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', marginBottom: 10 },
  accountCard: { backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  accountLabel: { fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },
  accountRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  accountValue: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  accountDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 66 },
  actContent: { padding: 16 },
  summaryCard: { borderRadius: 28, padding: 22, marginBottom: 16 },
  summaryPeriod: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  summarySub: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.75)', marginBottom: 18 },
  summaryRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 22, paddingVertical: 12 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryItemVal: { fontSize: 16, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  summaryItemLbl: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.7)' },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chartTitle: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  chartSub: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#AAAAAA' },
  sectionHeader: { marginBottom: 10, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  catCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  txCard: { backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1, gap: 2 },
  txTitle: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  txSub: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  txDate: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#BBBBBB' },
  txAmount: { fontSize: 14, fontFamily: 'Aeonik-Medium' },
  txDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 68 },
});
