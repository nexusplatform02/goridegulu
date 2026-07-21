import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, TextInput,
  Modal, Animated, Pressable, ActivityIndicator, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleMap } from '@/components/GoogleMap';
import { useLocation, geocodeAddress } from '@/hooks/useLocation';

const SHEET_PEEK = 64;

type Result = { lat: number; lng: number; name: string };

type PlaceAction = 'workplace' | 'home' | 'favorite' | null;

const QUICK_PLACES = [
  { id: 'home',   icon: 'home-outline' as const,      label: 'Home',       sub: 'Set home location' },
  { id: 'work',   icon: 'briefcase-outline' as const, label: 'Work',       sub: 'Set work location' },
];

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 60 : insets.top;
  const { coords: userCoords } = useLocation();

  const [query, setQuery]               = useState('');
  const [searching, setSearching]       = useState(false);
  const [results, setResults]           = useState<Result[]>([]);
  const [selected, setSelected]         = useState<Result | null>(null);
  const [sheetCollapsed, setCollapsed]  = useState(false);
  const [sheetHeight, setSheetHeight]   = useState(0);

  const [menuVisible, setMenuVisible]   = useState(false);
  const [menuTarget, setMenuTarget]     = useState<Result | null>(null);
  const [savedActions, setSavedActions] = useState<Record<string, PlaceAction>>({});
  const [toast, setToast]               = useState('');
  const toastOpacity                    = useRef(new Animated.Value(0)).current;
  const sheetSlide                      = useRef(new Animated.Value(0)).current;
  const searchTimer                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Map shows user location until they pick a destination
  const mapLat = selected?.lat ?? userCoords.lat;
  const mapLng = selected?.lng ?? userCoords.lng;

  function collapseSheet() {
    const offset = sheetHeight - SHEET_PEEK;
    Animated.spring(sheetSlide, { toValue: offset, useNativeDriver: true, tension: 68, friction: 12 }).start();
    setCollapsed(true);
  }

  function expandSheet() {
    Animated.spring(sheetSlide, { toValue: 0, useNativeDriver: true, tension: 68, friction: 12 }).start();
    setCollapsed(false);
  }

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (text.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const r = await geocodeAddress(text, userCoords.lat, userCoords.lng);
      setResults(r);
      setSearching(false);
    }, 400);
  }, [userCoords]);

  function pickResult(r: Result) {
    setSelected(r);
    setResults([]);
    setQuery(r.name.split(',')[0]);
  }

  function confirmDestination() {
    if (!selected) return;
    router.push({
      pathname: '/transport/confirm',
      params: {
        destLat:  String(selected.lat),
        destLng:  String(selected.lng),
        destName: selected.name.split(',').slice(0, 2).join(','),
        originLat: String(userCoords.lat),
        originLng: String(userCoords.lng),
      },
    });
  }

  function openMenu(r: Result) {
    setMenuTarget(r);
    setMenuVisible(true);
  }

  function applyAction(action: PlaceAction) {
    if (!menuTarget) return;
    setSavedActions(prev => ({ ...prev, [menuTarget.name]: action }));
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

  return (
    <View style={styles.root}>
      {/* ── Real Google Map ───────────────────────────────────── */}
      <GoogleMap lat={mapLat} lng={mapLng} zoom={17} style={StyleSheet.absoluteFill} />

      {/* ── Top bar ─────────────────────────────────────────── */}
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
            onChangeText={handleSearch}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          {searching
            ? <ActivityIndicator size="small" color="#00B14F" />
            : query.length > 0
              ? <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSelected(null); }}>
                  <Ionicons name="close-circle" size={18} color="#CCCCCC" />
                </TouchableOpacity>
              : null}
        </View>
      </View>

      {/* ── Search results dropdown ──────────────────────────── */}
      {results.length > 0 && (
        <View style={[styles.resultsDropdown, { top: topPad + 68 }]}>
          <FlatList
            data={results}
            keyExtractor={(_, i) => String(i)}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultRow} onPress={() => pickResult(item)}>
                <View style={styles.resultIconWrap}>
                  <Ionicons name="location-outline" size={18} color="#00B14F" />
                </View>
                <Text style={styles.resultText} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Floating confirm bar (when destination selected) ─ */}
      {selected && (
        <View style={[styles.floatingBar, { bottom: SHEET_PEEK + 16 }]}>
          <Ionicons name="location" size={18} color="#00B14F" />
          <Text style={styles.floatingLabel} numberOfLines={1}>
            {selected.name.split(',')[0]}
          </Text>
          <TouchableOpacity style={styles.floatingBtn} onPress={confirmDestination}>
            <Text style={styles.floatingBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Bottom sheet ──────────────────────────────────── */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 20) + 12 },
          { transform: [{ translateY: sheetSlide }] },
        ]}
        onLayout={e => setSheetHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity
          style={styles.handleWrap}
          onPress={sheetCollapsed ? expandSheet : collapseSheet}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 80, right: 80 }}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        <Text style={styles.sheetTitle}>Recent & Saved Places</Text>

        {QUICK_PLACES.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.destRow}
            activeOpacity={0.75}
            onPress={() => handleSearch(p.label)}
          >
            <View style={styles.destDot}>
              <Ionicons name={p.icon} size={16} color="#6B6B6B" />
            </View>
            <View style={styles.destInfo}>
              <Text style={styles.destName}>{p.label}</Text>
              <Text style={styles.destDist}>{p.sub}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleSearch(p.label)}>
              <Ionicons name="arrow-forward" size={16} color="#C0C0C0" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {selected && (
          <>
            <View style={styles.divider} />
            <View style={styles.selectedRow}>
              <Ionicons name="location" size={18} color="#00B14F" />
              <Text style={styles.selectedText} numberOfLines={2}>
                {selected.name.split(',').slice(0, 2).join(',')}
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.chooseBtn, !selected && styles.chooseBtnDisabled]}
          activeOpacity={0.88}
          onPress={confirmDestination}
          disabled={!selected}
        >
          <Text style={styles.chooseBtnText}>
            {selected ? 'Confirm Destination' : 'Search for a destination above'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Context menu ──────────────────────────────────── */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuCard} onPress={e => e.stopPropagation()}>
            <Text style={styles.menuHeader} numberOfLines={1}>{menuTarget?.name.split(',')[0]}</Text>
            <View style={styles.menuDivider} />
            {[
              { action: 'workplace' as PlaceAction, icon: 'briefcase-outline', label: 'Set as Workplace' },
              { action: 'home'      as PlaceAction, icon: 'home-outline',      label: 'Set as Home'      },
              { action: 'favorite'  as PlaceAction, icon: 'star-outline',      label: 'Add to Favourites' },
            ].map(({ action, icon, label }) => {
              const isActive = menuTarget ? savedActions[menuTarget.name] === action : false;
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

      {/* ── Toast ──────────────────────────────────────────── */}
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
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Aeonik-Regular', color: '#1A1A1A' },

  resultsDropdown: {
    position: 'absolute', left: 66, right: 16, zIndex: 50,
    backgroundColor: '#FFFFFF', borderRadius: 18, maxHeight: 240,
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 12, elevation: 8,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  resultIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F5EE',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  resultText: { flex: 1, fontSize: 13, fontFamily: 'Aeonik-Regular', color: '#1A1A1A', lineHeight: 18 },

  floatingBar: {
    position: 'absolute', left: 20, right: 20, zIndex: 40,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, elevation: 10,
  },
  floatingLabel: { flex: 1, fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  floatingBtn: {
    backgroundColor: '#00B14F', borderRadius: 22,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  floatingBtnText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },

  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 8,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 12,
    zIndex: 30,
  },
  handleWrap: { alignItems: 'center', paddingBottom: 10 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', marginBottom: 4 },
  sheetTitle: { fontSize: 13, fontFamily: 'Aeonik-Medium', color: '#9A9A9A', marginBottom: 12 },

  destRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  destDot: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  destInfo: { flex: 1 },
  destName: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  destDist: { fontSize: 12, fontFamily: 'Aeonik-Regular', color: '#AAAAAA', marginTop: 2 },
  iconBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },

  selectedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  selectedText: { flex: 1, fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#1A1A1A', lineHeight: 20 },

  chooseBtn: {
    backgroundColor: '#00B14F', borderRadius: 30,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  chooseBtnDisabled: { backgroundColor: '#C8E8C5' },
  chooseBtnText: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end', padding: 16 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingTop: 16, paddingBottom: 8, overflow: 'hidden' },
  menuHeader: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#8A8A8A', paddingHorizontal: 20, paddingBottom: 12 },
  menuDivider: { height: 1, backgroundColor: '#F0F0F0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
  menuItemActive: { backgroundColor: '#F0FCF5' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 28, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  menuIconWrapActive: { backgroundColor: '#E0F5EA' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
  menuLabelActive: { color: '#00B14F' },
  menuCancelBtn: { paddingVertical: 16, alignItems: 'center' },
  menuCancelText: { fontSize: 15, fontFamily: 'Aeonik-Medium', color: '#FF3B30' },

  toast: {
    position: 'absolute', bottom: '42%', left: 40, right: 40,
    backgroundColor: '#1A1A1A', borderRadius: 28,
    paddingVertical: 12, paddingHorizontal: 20,
    alignItems: 'center', zIndex: 100,
  },
  toastText: { fontSize: 14, fontFamily: 'Aeonik-Medium', color: '#FFFFFF' },
});
