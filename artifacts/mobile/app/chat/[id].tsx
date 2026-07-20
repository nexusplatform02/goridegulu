import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Platform, KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHATS } from '../(tabs)/chat';

type Message = { id: string; from: string; text: string; time: string };

function getNow() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 48 : insets.top;

  const chat = CHATS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>(chat?.messages ?? []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Auto-scroll on new message
  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // Simulate driver "typing" then replying
  function simulateDriverReply(userMsg: string) {
    setIsTyping(true);
    const replies: Record<string, string> = {
      default: 'Got it! I\'ll be with you shortly 👍',
      hello: 'Hi there! Everything is going smoothly.',
      eta: 'About 5 minutes away now.',
      thanks: 'You\'re welcome! Safe day ahead 😊',
      ok: '👍',
      where: 'I\'m just turning onto your street now.',
      wait: 'Of course, no rush! Take your time.',
    };
    const lower = userMsg.toLowerCase();
    const key = Object.keys(replies).find(k => k !== 'default' && lower.includes(k)) || 'default';
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `m${Date.now()}`,
        from: 'driver',
        text: replies[key],
        time: getNow(),
      }]);
    }, 1200 + Math.random() * 800);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const msg: Message = { id: `m${Date.now()}`, from: 'me', text, time: getNow() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    if (chat?.status !== 'support' && chat?.status !== 'completed') {
      simulateDriverReply(text);
    } else if (chat?.status === 'support') {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `m${Date.now()}`,
          from: 'driver',
          text: 'Thanks for reaching out! A support agent will respond within a few minutes.',
          time: getNow(),
        }]);
      }, 1500);
      setIsTyping(true);
    }
  }

  if (!chat) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Aeonik-Regular', color: '#8A8A8A' }}>Chat not found</Text>
      </View>
    );
  }

  const isCompleted = chat.status === 'completed';

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: chat.driverColor + '20' }]}>
          <Text style={[styles.headerAvatarText, { color: chat.driverColor }]}>{chat.driverInitials}</Text>
          {chat.status === 'active' && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.driverName}</Text>
          <Text style={styles.headerSub}>
            {chat.status === 'active' ? `Active · ${chat.orderType}` :
             chat.status === 'completed' ? `${chat.orderType} · Completed` :
             chat.orderDetail}
          </Text>
        </View>
        <TouchableOpacity style={styles.callBtn} activeOpacity={0.75}
          onPress={() => Alert.alert('Call Driver', `Calling ${chat.driverName}…`)}>
          <Ionicons name="call-outline" size={20} color="#00B14F" />
        </TouchableOpacity>
      </View>

      {/* Order info banner */}
      <View style={styles.orderBanner}>
        <Ionicons name={
          chat.orderType === 'GrabFood' ? 'fast-food-outline' :
          chat.orderType === 'GrabCar' ? 'car-sport-outline' :
          chat.orderType === 'GrabMart' ? 'basket-outline' : 'headset-outline'
        } size={14} color="#00B14F" />
        <Text style={styles.orderBannerText}>{chat.orderDetail}</Text>
        {isCompleted && (
          <View style={styles.completedTag}>
            <Text style={styles.completedTagText}>Completed</Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item: msg, index }) => {
          const isMe = msg.from === 'me';
          const showAvatar = !isMe && (index === 0 || messages[index - 1]?.from !== 'driver');
          return (
            <View style={[styles.msgWrap, isMe ? styles.msgWrapMe : styles.msgWrapDriver]}>
              {!isMe && (
                <View style={[styles.msgAvatar, { opacity: showAvatar ? 1 : 0 }]}>
                  <Text style={[styles.msgAvatarText, { color: chat.driverColor }]}>{chat.driverInitials}</Text>
                </View>
              )}
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleDriver]}>
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextDriver]}>{msg.text}</Text>
                <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeDriver]}>{msg.time}</Text>
              </View>
            </View>
          );
        }}
        ListFooterComponent={isTyping ? (
          <View style={[styles.msgWrap, styles.msgWrapDriver, { marginTop: 4 }]}>
            <View style={[styles.msgAvatar, { backgroundColor: chat.driverColor + '20' }]}>
              <Text style={[styles.msgAvatarText, { color: chat.driverColor }]}>{chat.driverInitials}</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleDriver, { paddingHorizontal: 16, paddingVertical: 12 }]}>
              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <View key={i} style={styles.typingDot} />)}
              </View>
            </View>
          </View>
        ) : null}
      />

      {/* Quick replies */}
      {!isCompleted && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplies} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {['👍 OK', '5 mins?', 'I\'m outside', 'Thank you!', 'Please hurry'].map(q => (
            <TouchableOpacity key={q} style={styles.quickBtn} activeOpacity={0.8}
              onPress={() => { setInput(q.replace(/^[👍]\s*/, '')); }}>
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      {isCompleted ? (
        <View style={[styles.completedBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Ionicons name="checkmark-circle" size={18} color="#00B14F" />
          <Text style={styles.completedBarText}>This order was completed. Chat is read-only.</Text>
        </View>
      ) : (
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.75}
            onPress={() => Alert.alert('Attachments', 'Send your location or a photo.')}>
            <Ionicons name="attach-outline" size={22} color="#8A8A8A" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message…"
            placeholderTextColor="#BBBBBB"
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? '#00B14F' : '#E8E8E8' }]}
            activeOpacity={0.85}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={16} color={input.trim() ? '#FFFFFF' : '#AAAAAA'} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { padding: 4 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  headerAvatarText: { fontSize: 14, fontFamily: 'Aeonik-Bold' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: '#00B14F', borderWidth: 2, borderColor: '#FFFFFF' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontFamily: 'Aeonik-Bold', color: '#1A1A1A' },
  headerSub: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#8A8A8A' },
  callBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center' },

  orderBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#F7FFF9', paddingHorizontal: 16, paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: '#E8F5EE',
  },
  orderBannerText: { flex: 1, fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#555' },
  completedTag: { backgroundColor: '#E8F5EE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  completedTagText: { fontSize: 10, fontFamily: 'Aeonik-Bold', color: '#00B14F' },

  messageList: { flex: 1 },

  msgWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  msgWrapMe: { justifyContent: 'flex-end' },
  msgWrapDriver: { justifyContent: 'flex-start' },

  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarText: { fontSize: 10, fontFamily: 'Aeonik-Bold' },

  bubble: { maxWidth: '72%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, gap: 3 },
  bubbleMe: { backgroundColor: '#00B14F', borderBottomRightRadius: 4 },
  bubbleDriver: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMe: { fontFamily: 'Aeonik-Regular', color: '#FFFFFF' },
  bubbleTextDriver: { fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },
  bubbleTime: { fontSize: 10, fontFamily: 'Aeonik-Regular', alignSelf: 'flex-end' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.7)' },
  bubbleTimeDriver: { color: '#BBBBBB' },

  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#BBBBBB' },

  quickReplies: { maxHeight: 48, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  quickBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center' },
  quickText: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#555' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  input: {
    flex: 1, backgroundColor: '#F5F5F5', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, paddingTop: 10,
    fontSize: 14, fontFamily: 'Aeonik-Regular', color: '#1A1A1A',
    maxHeight: 100, marginBottom: 2,
  },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },

  completedBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F7FFF9', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#E8F5EE',
    justifyContent: 'center',
  },
  completedBarText: { fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#555' },
});
