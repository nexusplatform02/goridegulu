import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, G, Rect } from 'react-native-svg';

// ─── 3D Chat Bubbles illustration ─────────────────────────────────────────────
function ChatBubblesIllustration() {
  return (
    <Svg width={180} height={160} viewBox="0 0 180 160">
      {/* Cloud / sky background circle */}
      <Circle cx={90} cy={80} r={72} fill="#D6EAF8" opacity={0.5} />

      {/* Small cloud */}
      <Ellipse cx={130} cy={42} rx={22} ry={14} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={145} cy={44} rx={16} ry={11} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={118} cy={46} rx={14} ry={9} fill="#FFFFFF" opacity={0.9} />

      {/* Blue bubble (left, front) */}
      <G transform="translate(28, 48)">
        {/* Shadow */}
        <Ellipse cx={42} cy={82} rx={30} ry={8} fill="#1A6FBF" opacity={0.25} />
        {/* Main bubble */}
        <Path d="M4,0 Q4,-4 8,-4 L76,-4 Q80,-4 80,0 L80,56 Q80,60 76,60 L36,60 L20,76 L22,60 L8,60 Q4,60 4,56 Z" fill="#2D7DD2" />
        {/* Highlight */}
        <Path d="M12,4 Q12,2 14,2 L60,2 Q62,2 62,4 L62,14 Q62,16 60,16 L14,16 Q12,16 12,14 Z" fill="#FFFFFF" opacity={0.15} />
        {/* Dots */}
        <Circle cx={28} cy={28} r={6} fill="#FFFFFF" opacity={0.9} />
        <Circle cx={42} cy={28} r={6} fill="#FFFFFF" opacity={0.9} />
        <Circle cx={56} cy={28} r={6} fill="#FFFFFF" opacity={0.9} />
      </G>

      {/* Green bubble (right, back) */}
      <G transform="translate(82, 62)">
        {/* Shadow */}
        <Ellipse cx={44} cy={78} rx={32} ry={8} fill="#005C29" opacity={0.2} />
        {/* Main bubble */}
        <Path d="M4,0 Q4,-4 8,-4 L80,-4 Q84,-4 84,0 L84,58 Q84,62 80,62 L58,62 L68,78 L44,62 L8,62 Q4,62 4,58 Z" fill="#00B14F" />
        {/* Highlight */}
        <Path d="M12,4 Q12,2 14,2 L64,2 Q66,2 66,4 L66,14 Q66,16 64,16 L14,16 Q12,16 12,14 Z" fill="#FFFFFF" opacity={0.18} />
        {/* Dots */}
        <Circle cx={30} cy={29} r={6} fill="#FFFFFF" opacity={0.9} />
        <Circle cx={44} cy={29} r={6} fill="#FFFFFF" opacity={0.9} />
        <Circle cx={58} cy={29} r={6} fill="#FFFFFF" opacity={0.9} />
      </G>
    </Svg>
  );
}

// ─── Notification item ────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: '1', icon: 'pricetag-outline', color: '#00B14F', bg: '#E0F5EA', title: 'Exclusive offer just for you!', body: 'Get 30% off your next GrabFood order. Valid today only.', time: '2h ago' },
  { id: '2', icon: 'car-sport-outline', color: '#2D7DD2', bg: '#E3F0FF', title: 'Your ride is confirmed', body: 'Driver Ahmad is 3 mins away. Tap to track.', time: 'Yesterday' },
  { id: '3', icon: 'checkmark-circle-outline', color: '#FF6B2B', bg: '#FFF0E8', title: 'Order delivered!', body: 'Your GrabMart order has been delivered. Enjoy!', time: '2 days ago' },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [tab, setTab] = useState<'chats' | 'notifications'>('chats');

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Segmented control */}
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'chats' && styles.segBtnActive]}
            onPress={() => setTab('chats')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segText, tab === 'chats' && styles.segTextActive]}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'notifications' && styles.segBtnActive]}
            onPress={() => setTab('notifications')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segText, tab === 'notifications' && styles.segTextActive]}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'chats' ? (
        /* ── Chats empty state ── */
        <View style={styles.emptyWrap}>
          <ChatBubblesIllustration />
          <Text style={styles.emptyTitle}>Find Your Chats With Our Support{'\n'}Specialists Here!</Text>
          <Text style={styles.emptyBody}>
            You can also get help from them via our
          </Text>
          <TouchableOpacity activeOpacity={0.75}>
            <Text style={styles.helpLink}>Help Centre</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Notifications list ── */
        <ScrollView
          contentContainerStyle={[styles.notifContent, { paddingBottom: 120 + bottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          {NOTIFICATIONS.map((n) => (
            <TouchableOpacity key={n.id} style={styles.notifRow} activeOpacity={0.75}>
              <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
                <Ionicons name={n.icon as any} size={20} color={n.color} />
              </View>
              <View style={styles.notifBody}>
                <View style={styles.notifTop}>
                  <Text style={styles.notifTitle} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
                <Text style={styles.notifText} numberOfLines={2}>{n.body}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
  },

  segmentWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: {
    backgroundColor: '#00B14F',
  },
  segText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#8A8A8A',
  },
  segTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
    marginTop: -20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  emptyBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#8A8A8A',
    textAlign: 'center',
  },
  helpLink: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#00B14F',
    marginTop: 2,
  },

  notifContent: { paddingTop: 8 },
  notifRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  notifIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifBody: { flex: 1, gap: 4 },
  notifTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A', marginRight: 8 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#BBBBBB' },
  notifText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#8A8A8A', lineHeight: 18 },
});
