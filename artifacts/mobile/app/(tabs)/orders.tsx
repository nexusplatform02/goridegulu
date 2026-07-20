import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Modal, Pressable, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

// ─── Mastercard icon ──────────────────────────────────────────────────────────
function MastercardIcon({ size = 36 }: { size?: number }) {
  const r = size / 2; const offset = size * 0.28;
  return (
    <Svg width={size + offset} height={size} viewBox={`0 0 ${size + offset} ${size}`}>
      <Circle cx={r} cy={r} r={r} fill="#EB001B" opacity={0.95} />
      <Circle cx={r + offset} cy={r} r={r} fill="#F79E1B" opacity={0.95} />
    </Svg>
  );
}

// ─── Card wave ────────────────────────────────────────────────────────────────
function CardWave() {
  return (
    <Svg width={200} height={140} style={{ position: 'absolute', right: 0, top: 0, opacity: 0.15 }}>
      <Path d="M200,0 Q140,70 200,140" stroke="#FFF" strokeWidth={60} fill="none" />
      <Path d="M170,0 Q110,70 170,140" stroke="#FFF" strokeWidth={40} fill="none" />
    </Svg>
  );
}

// ─── QR code ──────────────────────────────────────────────────────────────────
function QRCode({ size = 180 }: { size?: number }) {
  const cell = size / 21;
  const pattern = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,0,1,0],
    [1,0,1,1,0,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1],
    [0,1,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0],
    [1,0,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,0,1,0,0,1,0],
  ];
  return (
    <Svg width={size} height={size}>
      {pattern.map((row, ri) => row.map((cell_val, ci) =>
        cell_val ? <Rect key={`${ri}-${ci}`} x={ci * cell} y={ri * cell} width={cell} height={cell} fill="#1A1A1A" /> : null
      ))}
    </Svg>
  );
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sh.overlay} onPress={onClose} />
      <View style={sh.sheet}>
        <View style={sh.handle} />
        <View style={sh.header}>
          <Text style={sh.title}>{title}</Text>
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  title: { fontSize: 17, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
});

// ─── Top Up sheet ─────────────────────────────────────────────────────────────
function TopUpSheet({ onTopUp, onClose }: { onTopUp: (amount: number) => void; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const presets = [5000, 10000, 20000, 50000, 100000, 200000];
  const [custom, setCustom] = useState('');

  function handleConfirm() {
    const amount = selected ?? (custom ? parseInt(custom.replace(/\D/g, ''), 10) : 0);
    if (!amount || amount < 1000) { Alert.alert('Invalid Amount', 'Minimum top-up is UGX 1,000'); return; }
    onTopUp(amount);
    onClose();
    Alert.alert('Top Up Successful', `UGX ${amount.toLocaleString()} added to your wallet.`);
  }

  return (
    <View>
      <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginBottom: 16 }}>Select or enter an amount</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {presets.map(p => (
          <TouchableOpacity key={p} onPress={() => { setSelected(p); setCustom(''); }} activeOpacity={0.8}
            style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: selected === p ? '#00B14F' : '#EBEBEB', backgroundColor: selected === p ? '#E8F5EE' : '#FFFFFF', minWidth: 90, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Medium', color: selected === p ? '#00B14F' : '#1A1A1A' }}>UGX {p.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#AAAAAA', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Custom Amount</Text>
      <TextInput
        style={{ backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: 'Aeonik-Regular', color: '#1A1A1A', marginBottom: 20 }}
        placeholder="Enter amount (UGX)" placeholderTextColor="#BBBBBB" keyboardType="number-pad"
        value={custom} onChangeText={v => { setCustom(v); setSelected(null); }}
      />
      <TouchableOpacity style={{ backgroundColor: '#00B14F', borderRadius: 14, alignItems: 'center', paddingVertical: 15 }} activeOpacity={0.85} onPress={handleConfirm}>
        <Text style={{ fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' }}>Top Up Now</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Transfer sheet ───────────────────────────────────────────────────────────
function TransferSheet({ balance, onClose }: { balance: number; onClose: () => void }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const recents = [
    { name: 'Ahmad D.', phone: '+256 701 234 567', initials: 'AD' },
    { name: 'Sarah K.', phone: '+256 752 890 123', initials: 'SK' },
    { name: 'Musa J.', phone: '+256 784 456 789', initials: 'MJ' },
  ];
  function handleSend() {
    const amt = parseInt(amount.replace(/\D/g, ''), 10);
    if (!recipient) { Alert.alert('Missing Recipient', 'Enter a phone number or name.'); return; }
    if (!amt || amt < 500) { Alert.alert('Invalid Amount', 'Minimum transfer is UGX 500.'); return; }
    if (amt > balance) { Alert.alert('Insufficient Balance', `You only have UGX ${balance.toLocaleString()} in your wallet.`); return; }
    onClose();
    Alert.alert('Transfer Sent', `UGX ${amt.toLocaleString()} sent to ${recipient}.`);
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }} contentContainerStyle={{ paddingBottom: 8 }}>
      <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>Recent</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          {recents.map(r => (
            <TouchableOpacity key={r.name} onPress={() => setRecipient(r.phone)} activeOpacity={0.8} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#E0F5EA', alignItems: 'center', justifyContent: 'center', borderWidth: recipient === r.phone ? 2 : 0, borderColor: '#00B14F' }}>
                <Text style={{ fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#00B14F' }}>{r.initials}</Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#555' }}>{r.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {[
        { label: 'Phone or Name', value: recipient, setter: setRecipient, placeholder: '+256 700 000 000', keyboard: 'default' as const },
        { label: 'Amount (UGX)', value: amount, setter: setAmount, placeholder: '0', keyboard: 'number-pad' as const },
        { label: 'Note (optional)', value: note, setter: setNote, placeholder: 'What\'s this for?', keyboard: 'default' as const },
      ].map(f => (
        <View key={f.label} style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{f.label}</Text>
          <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' }}
            placeholder={f.placeholder} placeholderTextColor="#BBBBBB" keyboardType={f.keyboard} value={f.value} onChangeText={f.setter} />
        </View>
      ))}
      <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#AAAAAA', marginBottom: 16 }}>Available: UGX {balance.toLocaleString()}</Text>
      <TouchableOpacity style={{ backgroundColor: '#00B14F', borderRadius: 14, alignItems: 'center', paddingVertical: 15 }} activeOpacity={0.85} onPress={handleSend}>
        <Text style={{ fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' }}>Send Money</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Scan sheet ───────────────────────────────────────────────────────────────
function ScanSheet() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 16, paddingBottom: 8 }}>
      <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', marginBottom: 20, textAlign: 'center' }}>
        Show this QR code to the merchant to pay
      </Text>
      <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
        <QRCode size={180} />
      </View>
      <Text style={{ marginTop: 20, fontSize: 20, fontFamily: 'Aeonik-Bold', color: '#1A1A1A', letterSpacing: 4 }}>3 4 5 8 9 0</Text>
      <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#AAAAAA', marginTop: 6 }}>Grab Wallet · Jason Carter</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 14, alignItems: 'center', paddingVertical: 13 }} activeOpacity={0.8}>
          <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#555' }}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#E8F5EE', borderRadius: 14, alignItems: 'center', paddingVertical: 13 }} activeOpacity={0.8}>
          <Text style={{ fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#00B14F' }}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Transaction data ─────────────────────────────────────────────────────────
const WALLET_TX = [
  { id: '1', title: 'Top Up', sub: 'MTN MoMo', amount: +50000, icon: 'arrow-down-circle-outline', color: '#00B14F', bg: '#E0F5EA', date: 'Today, 09:14 AM' },
  { id: '2', title: 'GrabCar fare', sub: 'Trip to Airport', amount: -18500, icon: 'car-sport-outline', color: '#2D7DD2', bg: '#E3F0FF', date: 'Today, 08:00 AM' },
  { id: '3', title: 'Transfer to Sarah K.', sub: 'Lunch split', amount: -8000, icon: 'arrow-up-circle-outline', color: '#FF6B2B', bg: '#FFF0E8', date: 'Yesterday' },
  { id: '4', title: 'GrabFood order', sub: 'Boba House', amount: -14800, icon: 'fast-food-outline', color: '#FF6B2B', bg: '#FFF0E8', date: 'Yesterday' },
  { id: '5', title: 'Top Up', sub: 'Airtel Money', amount: +100000, icon: 'arrow-down-circle-outline', color: '#00B14F', bg: '#E0F5EA', date: '2 days ago' },
  { id: '6', title: 'Scan to Pay', sub: 'KFC Kampala', amount: -23000, icon: 'qr-code-outline', color: '#9B59B6', bg: '#F5EEF8', date: '2 days ago' },
];

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [balance, setBalance] = useState(12000);
  const [activeModal, setActiveModal] = useState<'topup' | 'scan' | 'transfer' | null>(null);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.75}
          onPress={() => Alert.alert('Payment Settings', 'Manage limits, notifications and security.')}>
          <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + bottomPad }]} showsVerticalScrollIndicator={false}>
        {/* My Card */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>My Card</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.75} onPress={() => router.push('/payment')}>
            <Ionicons name="add" size={16} color="#1A1A1A" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient colors={['#00C853', '#00B14F', '#009A3E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.walletCard}>
          <CardWave />
          <View style={styles.cardTop}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <MastercardIcon size={28} />
          </View>
          <Text style={styles.walletAmount}>UGX {balance.toLocaleString()}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.grabCardText}>Grab Card · Jason Carter</Text>
            <Text style={styles.cardExpiry}>05/29</Text>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          {[
            { label: 'Top Up', icon: 'arrow-down-circle-outline', action: 'topup' as const },
            { label: 'Scan to Pay', icon: 'qr-code-outline', action: 'scan' as const },
            { label: 'Transfer', icon: 'swap-horizontal-outline', action: 'transfer' as const },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.actionBtn} activeOpacity={0.75} onPress={() => setActiveModal(a.action)}>
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon as any} size={22} color="#1A1A1A" />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction history */}
        <View style={[styles.sectionRow, { marginBottom: 12 }]}>
          <Text style={styles.sectionLabel}>Transactions</Text>
          <TouchableOpacity activeOpacity={0.75}>
            <Text style={{ fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#00B14F' }}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.txCard}>
          {WALLET_TX.map((tx, i) => (
            <React.Fragment key={tx.id}>
              <TouchableOpacity style={styles.txRow} activeOpacity={0.75}
                onPress={() => Alert.alert(tx.title, `${tx.sub}\n${tx.date}`)}>
                <View style={[styles.txIcon, { backgroundColor: tx.bg }]}>
                  <Ionicons name={tx.icon as any} size={18} color={tx.color} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.sub}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#00B14F' : '#1A1A1A' }]}>
                  {tx.amount > 0 ? '+' : ''}UGX {Math.abs(tx.amount).toLocaleString()}
                </Text>
              </TouchableOpacity>
              {i < WALLET_TX.length - 1 && <View style={styles.txDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Financial services */}
        <Text style={[styles.sectionLabel, { marginTop: 24, marginBottom: 12, fontSize: 16 }]}>Financial Services</Text>
        <View style={styles.fsCard}>
          {[
            { Logo: () => (
                <View style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden' }}>
                  <LinearGradient colors={['#7B2FF7', '#00C6A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#FFF', fontSize: 12, fontFamily: 'Aeonik-Bold' }}>GXS</Text>
                  </LinearGradient>
                </View>
              ), name: 'FlexiLoan', sub: 'Up to UGX 5,000,000', badge: 'New' },
            { Logo: () => (
                <View style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden' }}>
                  <LinearGradient colors={['#3B0087', '#7B2FF7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#FFF', fontSize: 13, fontFamily: 'Aeonik-Bold' }}>W3</Text>
                  </LinearGradient>
                </View>
              ), name: 'Web3 Wallet', sub: 'Crypto & DeFi', badge: null },
            { Logo: () => (
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#E07800" />
                </View>
              ), name: 'GrabInsure', sub: 'Travel & ride cover', badge: null },
          ].map((s, i, arr) => (
            <React.Fragment key={s.name}>
              <TouchableOpacity style={styles.fsRow} activeOpacity={0.75}
                onPress={() => Alert.alert(s.name, `Learn more about ${s.name} on Grabby.`)}>
                <s.Logo />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.fsName}>{s.name}</Text>
                    {s.badge && (
                      <View style={{ backgroundColor: '#E8F5EE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, fontFamily: 'Aeonik-Bold', color: '#00B14F' }}>{s.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' }}>{s.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.fsDivider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      <BottomSheet visible={activeModal === 'topup'} title="Top Up Wallet" onClose={() => setActiveModal(null)}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }} contentContainerStyle={{ paddingBottom: 8 }}>
          <TopUpSheet onTopUp={amt => setBalance(b => b + amt)} onClose={() => setActiveModal(null)} />
        </ScrollView>
      </BottomSheet>

      <BottomSheet visible={activeModal === 'scan'} title="Scan to Pay" onClose={() => setActiveModal(null)}>
        <ScanSheet />
      </BottomSheet>

      <BottomSheet visible={activeModal === 'transfer'} title="Send Money" onClose={() => setActiveModal(null)}>
        <TransferSheet balance={balance} onClose={() => setActiveModal(null)} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  settingsBtn: { position: 'absolute', right: 20, bottom: 14, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionLabel: { fontSize: 16, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  walletCard: { borderRadius: 28, padding: 22, marginBottom: 20, overflow: 'hidden', minHeight: 148, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  walletLabel: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.8)' },
  walletAmount: { fontSize: 28, fontFamily: 'Aeonik-Bold', color: '#FFFFFF', marginTop: 6 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  grabCardText: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: 'rgba(255,255,255,0.85)' },
  cardExpiry: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: 'rgba(255,255,255,0.85)' },
  actionsRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 18, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  actionBtn: { flex: 1, alignItems: 'center', gap: 8 },
  actionIcon: { width: 50, height: 50, borderRadius: 28, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 12, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', textAlign: 'center' },
  txCard: { backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 4 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1, gap: 2 },
  txTitle: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  txSub: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  txDate: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#BBBBBB' },
  txAmount: { fontSize: 13, fontFamily: 'Aeonik-Medium', textAlign: 'right', maxWidth: 110 },
  txDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 68 },
  fsCard: { backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  fsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  fsName: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  fsDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 70 },
});
