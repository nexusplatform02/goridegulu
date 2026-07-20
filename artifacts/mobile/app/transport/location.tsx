import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, TextInput,
  Modal, Animated, Pressable, GestureResponderEvent, useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackground } from '@/components/MapBackground';

const DESTINATIONS = [
  { id: '1', name: 'Central Market / Town Square', sub: '12 Market St, City Center', dist: '0.0 km' },
  { id: '2', name: 'Bus Terminal 1',               sub: '5 Terminal Rd, Downtown',  dist: '0.8 km' },
  { id: '3', name: 'Shopping Mall Main Entrance',  sub: '88 Commerce Ave, Midtown', dist: '1.1 km' },
];

// Derive a human-ish label from tap position relative to screen
function labelFromTap(x: number, y: number, W: number, H: number): string {
  const col = x < W * 0.33 ? 'West' : x < W * 0.66 ? 'Central' : 'East';
  const row = y < H * 0.33 ? 'North' : y < H * 0.66 ? 'Mid' : 'South';
  const streets = ['Market St', 'Commerce Ave', 'Terminal Rd', 'Park Blvd', 'Main Rd'];
  const pick = streets[Math.floor(((x + y) / (W + H)) * streets.length)];
  return `${col} ${row} — ${pick}`;
}

type PlaceAction = 'workplace' | 'home' | 'favorite' | null;

const SHEET_PEEK = 64; // how many px of sheet remain visible when collapsed

export default function LocationScreen() {
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;

  const [selected, setSelected]           = useState('1');
  const [query, setQuery]                 = useState('');
  const [sheetCollapsed, setCollapsed]    = useState(false);
  const [sheetHeight, setSheetHeight]     = useState(0);
  const [tapPin, setTapPin]               = useState<{ x: number; y: number } | null>(null);
  const [tapLabel, setTapLabel]           = useState('');

  // Context menu
  const [menuVisible, setMenuVisible]     = useState(false);
  const [menuTarget, setMenuTarget]       = useState<{ id: string; name: string } | null>(null);
  const [savedActions, setSavedActions]   = useState<Record<string, PlaceAction>>({});
  const [toast, setToast]                 = useState('');
  const toastOpacity                      = useRef(new Animated.Value(0)).current;
  const sheetSlide                        = useRef(new Animated.Value(0)).current;

  function collapseSheet() {
    const offset = sheetHeight - SHEET_PEEK;
    Animated.spring(sheetSlide, { toValue: offset, useNativeDriver: true, tension: 68, friction: 12 }).start();
    setCollapsed(true);
  }

  function expandSheet() {
    Animated.spring(sheetSlide, { toValue: 0, useNativeDriver: true, tension: 68, friction: 12 }).start();
    setCollapsed(false);
    setTapPin(null);
    setTapLabel('');
  }

  function handleMapTap(e: GestureResponderEvent) {
    if (!sheetCollapsed) return;
    const { locationX, locationY } = e.nativeEvent;
    setTapPin({ x: locationX, y: locationY });
    setTapLabel(labelFromTap(locationX, locationY, W, H));
  }

  function confirmTapLocation() {
    router.push('/transport/confirm');
  }

  function openMenu(id: string, name: string) {
    setMenuTarget({ id, name });
    setMenuVisible(true);
  }

  function applyAction(action: PlaceAction) {
    if (!menuTarget) return;
    setSavedActions(prev => ({ ...prev, [menuTarget.id]: action }));
    setMenuVisible(false);
    const labels: Record<NonNullable<PlaceAction>, string> = {
      workplace: '🏢 Saved as Workplace',
      home:      '🏠 Saved as Home',
      favorite:  '⭐ Added to Favourites',
    };
    if (action) {
      setToast(labels[action]);
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }

  function savedIcon(id: string) {
    const a = savedActions[id];
    if (a === 'home')      return 'home';
    if (a === 'workplace') return 'briefcase';
    if (a === 'favorite')  return 'star';
    return null;
  }

  const activeDestName = tapPin
    ? tapLabel
    : (DESTINATIONS.find(d => d.id === selected)?.name ?? '–');

  return (
    <View style={styles.root}>
      {/* ── Map (tappable when collapsed) ──────────────────────── */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleMapTap}>
        <MapBackground showRoute={false} />
      </Pressable>

      {/* ── Tapped pin ─────────────────────────────────────────── */}
      {tapPin && (
        <View
          style={[styles.tapPinWrap, { left: tapPin.x - 20, top: tapPin.y - 44 }]}
          pointerEvents="none"
        >
          <Ionicons name="location" size={44} color="#00B14F" />
          <View style={styles.tapPinDot} />
        </View>
      )}

      {/* ── Centre crosshair (shows when collapsed, no tap pin) ── */}
      {sheetCollapsed && !tapPin && (
        <View style={styles.centerPinWrap} pointerEvents="none">
          <Ionicons name="add-circle-outline" size={36} color="#00B14F" />
        </View>
      )}

      {/* ── Hint label when collapsed ───────────────────────────── */}
      {sheetCollapsed && !tapPin && (
        <View style={styles.hintBubble} pointerEvents="none">
          <Text style={styles.hintText}>Tap map to set destination</Text>
        </View>
      )}

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <View style={styles.dotGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#AAAAAA"
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#CCCCCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Floating confirm bar (shown when pin is dropped) ─────── */}
      {tapPin && (
        <View style={[styles.floatingBar, { bottom: SHEET_PEEK + 16 }]}>
          <Ionicons name="location" size={18} color="#00B14F" />
          <Text style={styles.floatingLabel} numberOfLines={1}>{tapLabel}</Text>
          <TouchableOpacity style={styles.floatingBtn} onPress={confirmTapLocation}>
            <Text style={styles.floatingBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Bottom sheet ─────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 20) + 12 },
          { transform: [{ translateY: sheetSlide }] },
        ]}
        onLayout={e => setSheetHeight(e.nativeEvent.layout.height)}
      >
        {/* Handle — tap to toggle */}
        <TouchableOpacity
          style={styles.handleWrap}
          onPress={sheetCollapsed ? expandSheet : collapseSheet}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 80, right: 80 }}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        {/* Selected destination header */}
        <View style={styles.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainDestTitle} numberOfLines={1}>{activeDestName}</Text>
            {!tapPin && (
              <Text style={styles.mainDestSub}>
                {DESTINATIONS.find(d => d.id === selected)?.sub ?? ''}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={18} color="#5A5A5A" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Destination rows */}
        {DESTINATIONS.map((dest) => {
          const icon = savedIcon(dest.id);
          return (
            <TouchableOpacity
              key={dest.id}
              style={styles.destRow}
              activeOpacity={0.75}
              onPress={() => {
                setSelected(dest.id);
                setTapPin(null);
                setTapLabel('');
              }}
            >
              <View style={[styles.destDot, selected === dest.id && !tapPin && styles.destDotActive]}>
                {selected === dest.id && !tapPin
                  ? <View style={styles.destDotInner} />
                  : <Ionicons name="location-outline" size={14} color="#AAAAAA" />
                }
              </View>

              <View style={styles.destInfo}>
                <View style={styles.destNameRow}>
                  <Text style={[styles.destName, selected === dest.id && !tapPin && styles.destNameActive]}>
                    {dest.name}
                  </Text>
                  {icon && (
                    <Ionicons
                      name={icon as any}
                      size={13}
                      color={icon === 'star' ? '#FFC107' : '#00B14F'}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text style={styles.destDist}>{dest.dist}</Text>
              </View>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => openMenu(dest.id, dest.name)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#C0C0C0" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* CTA */}
        <TouchableOpacity
          style={styles.chooseBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/transport/confirm')}
        >
          <Text style={styles.chooseBtnText}>Choose This Destination</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Context menu modal ───────────────────────────────── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuCard} onPress={e => e.stopPropagation()}>
            <Text style={styles.menuHeader} numberOfLines={1}>{menuTarget?.name}</Text>
            <View style={styles.menuDivider} />
            {[
              { action: 'workplace' as PlaceAction, icon: 'briefcase-outline', label: 'Set as Workplace' },
              { action: 'home'      as PlaceAction, icon: 'home-outline',      label: 'Set as Home'      },
              { action: 'favorite'  as PlaceAction, icon: 'star-outline',      label: 'Add to Favourites' },
            ].map(({ action, icon, label }) => {
              const isActive = menuTarget ? savedActions[menuTarget.id] === action : false;
              return (
                <TouchableOpacity
                  key={action}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  activeOpacity={0.7}
                  onPress={() => applyAction(action)}
                >
                  <View style={[styles.menuIconWrap, isActive && styles.menuIconWrapActive]}>
                    <Ionicons name={icon as any} size={20} color={isActive ? '#00B14F' : '#5A5A5A'} />
                  </View>
                  <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuCancelBtn} onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Toast ─────────────────────────────────────────────── */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Text style={styles.toastText}>{toast}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 4,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 4,
  },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#1A1A1A' },

  // Pin dropped on map
  tapPinWrap: { position: 'absolute', zIndex: 25, alignItems: 'center' },
  tapPinDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00B14F', marginTop: -4 },

  // Crosshair when collapsed but no pin yet
  centerPinWrap: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },

  // Hint
  hintBubble: {
    position: 'absolute', top: '45%', alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 28,
    paddingHorizontal: 16, paddingVertical: 8, zIndex: 15,
  },
  hintText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium' },

  // Floating confirm bar
  floatingBar: {
    position: 'absolute', left: 20, right: 20, zIndex: 40,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, elevation: 10,
  },
  floatingLabel: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: '#1A1A1A' },
  floatingBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  floatingBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },

  // Bottom sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 8,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 12,
    zIndex: 30,
  },
  handleWrap: { alignItems: 'center', paddingBottom: 10 },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', marginBottom: 4,
  },

  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 14 },
  mainDestTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1A1A1A' },
  mainDestSub:   { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',  color: '#8A8A8A', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 8 },
  iconBtn: { padding: 4 },

  destRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  destDot: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  destDotActive:  { backgroundColor: '#E0F5EA' },
  destDotInner:   { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B14F' },
  destInfo:       { flex: 1 },
  destNameRow:    { flexDirection: 'row', alignItems: 'center' },
  destName:       { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: '#5A5A5A' },
  destNameActive: { color: '#1A1A1A', fontFamily: 'PlusJakartaSans_600SemiBold' },
  destDist:       { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#AAAAAA', marginTop: 2 },

  chooseBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center', marginTop: 16,
  },
  chooseBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end', padding: 16,
  },
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingTop: 16, paddingBottom: 8, overflow: 'hidden',
  },
  menuHeader: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#8A8A8A',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  menuDivider: { height: 1, backgroundColor: '#F0F0F0' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  menuItemActive: { backgroundColor: '#F0FCF5' },
  menuIconWrap: {
    width: 40, height: 40, borderRadius: 28, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  menuIconWrapActive: { backgroundColor: '#E0F5EA' },
  menuLabel:       { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium', color: '#1A1A1A' },
  menuLabelActive: { color: '#00B14F', fontFamily: 'PlusJakartaSans_600SemiBold' },
  menuCancelBtn:   { paddingVertical: 16, alignItems: 'center' },
  menuCancelText:  { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FF3B30' },

  // Toast
  toast: {
    position: 'absolute', bottom: '42%', left: 40, right: 40,
    backgroundColor: '#1A1A1A', borderRadius: 28,
    paddingVertical: 12, paddingHorizontal: 20,
    alignItems: 'center', zIndex: 100,
  },
  toastText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFFFFF' },
});
