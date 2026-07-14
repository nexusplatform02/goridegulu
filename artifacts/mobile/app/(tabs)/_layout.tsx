import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_DEFS: {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  pillW: number;
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 114 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 126 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 122 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 104 },
];

// ─── Geometry ────────────────────────────────────────────────────────────────
//
//   Each inactive tab = two concentric animated layers:
//
//     ╔═══════════════════════╗  ← OUTER HALO  68 px  #EBEBEB
//     ║  ┌─────────────────┐  ║
//     ║  │   INNER FILL    │  ║  ← INNER FILL  50 px  #D8D8D8
//     ║  │      icon       │  ║
//     ║  └─────────────────┘  ║
//     ╚═══════════════════════╝
//
//   Active tab:
//     OUTER → widens to pillW + RING*2, colour → #FFFFFF  (white ring)
//     INNER → widens to pillW,          colour → #00B14F  (green pill)
//
//   Adjacent OUTER halos overlap by OVERLAP px.
//   The overlap zone is the visual "bridge" — same grey, seamlessly joined.
//   Both layers animate their own width so nothing needs to escape its parent.
//
const OUTER_H  = 68;   // outer halo height (and resting width)
const INNER_H  = 50;   // inner fill height (and resting width)
const RING     = 9;    // (OUTER_H - INNER_H) / 2 — ring visible on each side
const OVERLAP  = 22;   // px each outer halo slides behind its left neighbour
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: Animated.AnimatedInterpolation<string | number>;
}) {
  const [c, setC] = useState('#9E9E9E');
  useEffect(() => {
    const id = color.addListener(({ value }) => setC(value as string));
    return () => color.removeListener(id);
  }, [color]);
  return <Ionicons name={name} size={22} color={c} />;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'web' ? 20 : Math.max(insets.bottom + 8, 20);

  const anims = useRef(
    TAB_DEFS.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    Animated.parallel(
      anims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: i === state.index ? 1 : 0,
          useNativeDriver: false,
          friction: 7,
          tension: 60,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.wrapper, { bottom }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab      = TAB_DEFS[index];
          const anim     = anims[index];
          const isActive = state.index === index;

          // OUTER halo: 68 px circle → (pillW + RING*2) px pill, grey → white
          const outerW = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [OUTER_H, tab.pillW + RING * 2],
          });
          const outerBg = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#EBEBEB', '#FFFFFF'],
          });

          // INNER fill: 50 px circle → pillW px pill, dark-grey → green
          const innerW = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_H, tab.pillW],
          });
          const innerBg = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#D8D8D8', '#00B14F'],
          });

          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.6, 1],
            outputRange: [0, 0, 1],
          });
          // Label slot opens from 0 → the extra width the pill gains over INNER_H
          const labelSlotW = anim.interpolate({
            inputRange : [0, 0.5, 1],
            outputRange: [0, 0, tab.pillW - INNER_H - 4],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={[
                index > 0 && { marginLeft: -OVERLAP },
                { zIndex: isActive ? 20 : TAB_DEFS.length - index },
              ]}
            >
              {/* ── Outer halo ── */}
              <Animated.View
                style={[styles.outer, { width: outerW, backgroundColor: outerBg }]}
              >
                {/* ── Inner fill ── */}
                <Animated.View
                  style={[styles.inner, { width: innerW, backgroundColor: innerBg }]}
                >
                  <AnimatedIcon name={tab.icon} color={iconColor} />

                  {/* Label grows in as the pill expands */}
                  <Animated.View style={{ width: labelSlotW, overflow: 'hidden' }}>
                    <Animated.Text
                      style={[styles.label, { opacity: labelOpacity }]}
                      numberOfLines={1}
                      allowFontScaling={false}
                    >
                      {tab.label}
                    </Animated.Text>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Outer halo — animates width & colour; always OUTER_H tall & fully rounded.
  // Adjacent halos overlap via negative marginLeft on the TouchableOpacity;
  // that overlap zone is the seamless grey "bridge" between tabs.
  outer: {
    height: OUTER_H,
    borderRadius: OUTER_H / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow on the outer shell
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Inner fill — animates width & colour; always INNER_H tall & fully rounded.
  inner: {
    height: INNER_H,
    borderRadius: INNER_H / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 6,
    overflow: 'hidden',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink: 0,
  },
});
