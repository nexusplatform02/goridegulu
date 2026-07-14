import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CHATS = [
  {
    id: '1',
    name: 'Driver — Ahmad',
    message: 'I am 2 minutes away from your location.',
    time: '2m',
    unread: 1,
    icon: 'car-sport',
    iconColor: '#00B14F',
    iconBg: '#E0F5EA',
  },
  {
    id: '2',
    name: 'Grabby Support',
    message: 'Your issue has been resolved. Thank you!',
    time: '1h',
    unread: 0,
    icon: 'headset',
    iconColor: '#007AFF',
    iconBg: '#E8F1FF',
  },
  {
    id: '3',
    name: 'Driver — Farid',
    message: 'Order picked up, on the way!',
    time: '3h',
    unread: 0,
    icon: 'fast-food',
    iconColor: '#FF6B2B',
    iconBg: '#FFF0E8',
  },
  {
    id: '4',
    name: 'Grabby Promotions',
    message: 'Get 20% off your next GrabFood order.',
    time: 'Yesterday',
    unread: 2,
    icon: 'pricetag',
    iconColor: '#E07800',
    iconBg: '#FFF4E0',
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 + bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {CHATS.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatRow} activeOpacity={0.75}>
            <View style={[styles.avatar, { backgroundColor: chat.iconBg }]}>
              <Ionicons name={chat.icon as any} size={22} color={chat.iconColor} />
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.chatMsg} numberOfLines={1}>{chat.message}</Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{chat.time}</Text>
              {chat.unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{chat.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#1A1A1A' },
  content: { paddingVertical: 8 },
  chatRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F8F8F8',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center',
  },
  chatInfo: { flex: 1, gap: 3 },
  chatName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A1A1A' },
  chatMsg: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#8A8A8A' },
  chatMeta: { alignItems: 'flex-end', gap: 6 },
  chatTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#BBBBBB' },
  badge: {
    backgroundColor: '#00B14F', borderRadius: 10, width: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
