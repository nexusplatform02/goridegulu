import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// ─── Data ─────────────────────────────────────────────────────────────────────
export const CHATS = [
  {
    id: 'order-1',
    driverName: 'Ahmad Ssentamu',
    driverInitials: 'AS',
    driverColor: '#2D7DD2',
    orderType: 'GrabFood',
    orderDetail: 'Boba House · 2 items',
    lastMessage: 'I\'m at your gate, please come out 🙏',
    lastTime: '10:24 AM',
    unread: 2,
    status: 'active',
    messages: [
      { id: 'm1', from: 'driver', text: 'Hello! I\'ve picked up your order from Boba House.', time: '10:15 AM' },
      { id: 'm2', from: 'me', text: 'Great, how long will it take?', time: '10:16 AM' },
      { id: 'm3', from: 'driver', text: 'About 10 minutes, traffic is light today 👍', time: '10:17 AM' },
      { id: 'm4', from: 'me', text: 'Perfect, I\'ll be home!', time: '10:18 AM' },
      { id: 'm5', from: 'driver', text: 'I\'m at your gate, please come out 🙏', time: '10:24 AM' },
    ],
  },
  {
    id: 'order-2',
    driverName: 'Grace Nakato',
    driverInitials: 'GN',
    driverColor: '#00B14F',
    orderType: 'GrabCar',
    orderDetail: 'To: Entebbe Airport',
    lastMessage: 'On my way, ETA 5 mins',
    lastTime: '08:02 AM',
    unread: 0,
    status: 'active',
    messages: [
      { id: 'm1', from: 'driver', text: 'Hi, I\'m your driver Grace. I\'ll be there shortly.', time: '07:58 AM' },
      { id: 'm2', from: 'me', text: 'Thanks! I\'m ready outside.', time: '07:59 AM' },
      { id: 'm3', from: 'driver', text: 'On my way, ETA 5 mins', time: '08:02 AM' },
    ],
  },
  {
    id: 'order-3',
    driverName: 'Peter Okello',
    driverInitials: 'PO',
    driverColor: '#FF6B2B',
    orderType: 'GrabMart',
    orderDetail: 'Fresh Market · 5 items',
    lastMessage: 'Your order has been delivered ✅',
    lastTime: 'Yesterday',
    unread: 0,
    status: 'completed',
    messages: [
      { id: 'm1', from: 'driver', text: 'I\'m at Fresh Market picking your items.', time: 'Yesterday, 2:10 PM' },
      { id: 'm2', from: 'driver', text: 'They\'re out of the large milk. Can I substitute with medium 2×?', time: 'Yesterday, 2:14 PM' },
      { id: 'm3', from: 'me', text: 'Yes that\'s fine, thanks for asking!', time: 'Yesterday, 2:15 PM' },
      { id: 'm4', from: 'driver', text: 'On my way to you now 🚴', time: 'Yesterday, 2:22 PM' },
      { id: 'm5', from: 'me', text: 'Great!', time: 'Yesterday, 2:23 PM' },
      { id: 'm6', from: 'driver', text: 'Your order has been delivered ✅', time: 'Yesterday, 2:38 PM' },
    ],
  },
  {
    id: 'support',
    driverName: 'Grabby Support',
    driverInitials: 'GS',
    driverColor: '#9B59B6',
    orderType: 'Support',
    orderDetail: 'Help & customer service',
    lastMessage: 'How can we help you today?',
    lastTime: '2 days ago',
    unread: 0,
    status: 'support',
    messages: [
      { id: 'm1', from: 'driver', text: 'Hello Jason! Welcome to Grabby Support. How can we help you today?', time: '2 days ago' },
    ],
  },
];

const NOTIFICATIONS = [
  { id: '1', icon: 'pricetag-outline', color: '#00B14F', bg: '#E0F5EA', title: 'Exclusive offer just for you!', body: 'Get 30% off your next GrabFood order. Valid today only.', time: '2h ago', unread: true },
  { id: '2', icon: 'car-sport-outline', color: '#2D7DD2', bg: '#E3F0FF', title: 'Your ride has been confirmed', body: 'Driver Grace is 3 mins away in a silver Toyota Vitz.', time: '4h ago', unread: true },
  { id: '3', icon: 'checkmark-circle-outline', color: '#00B14F', bg: '#E0F5EA', title: 'Order delivered!', body: 'Your GrabMart order from Fresh Market has arrived. Enjoy!', time: 'Yesterday', unread: false },
  { id: '4', icon: 'gift-outline', color: '#9B59B6', bg: '#F5EEF8', title: 'Earn double points this weekend!', body: 'All GrabFood orders earn 2× GrabRewards points Sat–Sun.', time: 'Yesterday', unread: false },
  { id: '5', icon: 'star-outline', color: '#E07800', bg: '#FFF4E0', title: 'Rate your last trip', body: 'How was your ride with Grace? Leave a quick rating.', time: '2 days ago', unread: false },
  { id: '6', icon: 'shield-checkmark-outline', color: '#2D7DD2', bg: '#E3F0FF', title: 'Security alert', body: 'A new device signed into your account. Was this you?', time: '3 days ago', unread: false },
];

const ORDER_COLORS: Record<string, string> = {
  GrabFood: '#FF6B2B', GrabCar: '#00B14F', GrabMart: '#2D7DD2', Support: '#9B59B6',
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 56 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [tab, setTab] = useState<'chats' | 'notifications'>('chats');
  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());

  const totalUnread = CHATS.reduce((s, c) => s + c.unread, 0);
  const notifUnread = NOTIFICATIONS.filter(n => n.unread && !readNotifs.has(n.id)).length;

  function markNotifRead(id: string) {
    setReadNotifs(prev => new Set([...prev, id]));
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalUnread}</Text>
          </View>
        )}
      </View>

      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          {([
            { key: 'chats', label: 'Chats', count: totalUnread },
            { key: 'notifications', label: 'Notifications', count: notifUnread },
          ] as const).map(t => (
            <TouchableOpacity key={t.key} style={[styles.segBtn, tab === t.key && styles.segBtnActive]}
              onPress={() => setTab(t.key)} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.segText, tab === t.key && styles.segTextActive]}>{t.label}</Text>
                {t.count > 0 && (
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: tab === t.key ? 'rgba(255,255,255,0.3)' : '#00B14F', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' }}>{t.count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tab === 'chats' ? (
        <FlatList
          data={CHATS}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 + bottomPad }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F5F5F5', marginLeft: 82 }} />}
          renderItem={({ item: chat }) => (
            <TouchableOpacity style={styles.chatRow} activeOpacity={0.75}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.id } })}>
              <View style={[styles.chatAvatar, { backgroundColor: chat.driverColor + '20' }]}>
                <Text style={[styles.chatAvatarText, { color: chat.driverColor }]}>{chat.driverInitials}</Text>
                {chat.status === 'active' && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.chatBody}>
                <View style={styles.chatTop}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.chatName}>{chat.driverName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.orderBadge, { backgroundColor: (ORDER_COLORS[chat.orderType] || '#888') + '18' }]}>
                        <Text style={[styles.orderBadgeText, { color: ORDER_COLORS[chat.orderType] || '#888' }]}>{chat.orderType}</Text>
                      </View>
                      <Text style={styles.orderDetail} numberOfLines={1}>{chat.orderDetail}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={styles.chatTime}>{chat.lastTime}</Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[styles.chatLast, chat.unread > 0 && styles.chatLastUnread]} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 + bottomPad }} showsVerticalScrollIndicator={false}>
          {NOTIFICATIONS.map(n => {
            const isRead = readNotifs.has(n.id) || !n.unread;
            return (
              <TouchableOpacity key={n.id} style={[styles.notifRow, !isRead && { backgroundColor: '#F7FFF9' }]}
                activeOpacity={0.75} onPress={() => markNotifRead(n.id)}>
                {!isRead && <View style={styles.unreadDot} />}
                <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
                  <Ionicons name={n.icon as any} size={20} color={n.color} />
                </View>
                <View style={styles.notifBody}>
                  <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, !isRead && { fontFamily: 'Aeonik-Bold' }]} numberOfLines={1}>{n.title}</Text>
                    <Text style={styles.notifTime}>{n.time}</Text>
                  </View>
                  <Text style={styles.notifText} numberOfLines={2}>{n.body}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  badge: { position: 'absolute', right: 20, bottom: 16, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#E53E3E', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { fontSize: 11, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  segmentWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, backgroundColor: '#FFFFFF' },
  segment: { flexDirection: 'row', backgroundColor: '#F2F2F2', borderRadius: 30, padding: 4 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  segBtnActive: { backgroundColor: '#00B14F' },
  segText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#8A8A8A' },
  segTextActive: { color: '#FFFFFF' },
  chatRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingHorizontal: 20, paddingVertical: 14 },
  chatAvatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' },
  chatAvatarText: { fontSize: 18, fontFamily: 'Aeonik-Bold' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#00B14F', borderWidth: 2, borderColor: '#FFFFFF' },
  chatBody: { flex: 1, gap: 4 },
  chatTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  chatName: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  orderBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  orderBadgeText: { fontSize: 10, fontFamily: 'Aeonik-Bold' },
  orderDetail: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#AAAAAA', flex: 1 },
  chatTime: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#BBBBBB' },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#00B14F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { fontSize: 11, fontFamily: 'Aeonik-Bold', color: '#FFFFFF' },
  chatLast: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  chatLastUnread: { fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  notifRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', position: 'relative' },
  unreadDot: { position: 'absolute', left: 6, top: '50%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#00B14F' },
  notifIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifBody: { flex: 1, gap: 4 },
  notifTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { flex: 1, fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', marginRight: 8 },
  notifTime: { fontSize: 11, fontFamily: 'Aeonik-Regular', color: '#BBBBBB' },
  notifText: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#8A8A8A', lineHeight: 18 },
});
