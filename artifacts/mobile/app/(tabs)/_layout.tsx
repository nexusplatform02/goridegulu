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
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 116 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 128 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 124 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 106 },
];

// ─── Geometry ────────────────────────────────────────────────────────────────
//
//  Visual structure of ONE inactive tab (cross-section):
//
//  page #F5F5F5 ···· [  HALO #E8E8E8  [ INNER #BEBEBE  ]  HALO  ] ···· page
//                    ↑──────── HALO_D ─────────────────────────────↑
//                                      ↑─── INNER_D ───↑
//
//  Adjacent HALO circles overlap by OVERLAP px.
//  The overlap zone is the same #E8E8E8 → reads as a seamless grey bridge.
//  INNER circles are clearly darker (#BEBEBE) so they stand out inside the halo.
//
const HALO_D   = 70;   // outer bubble diameter
const INNER_D  = 50;   // inner icon circle diameter
//
// CRITICAL: OVERLAP must stay below (HALO_D - INNER_D) / 2 = 10 px.
// If it exceeds that, the inner icon circles start overlapping each other and
// every icon looks merged. At OVERLAP = 12 the inner circles have an 8 px gap
// (clearly separate) while the outer halos overlap by 12 px → bridge zone.
//
const OVERLAP  = 12;
const ACTIVE_H = 52;   // height of the green pill (same as inner)

const HALO_BG  = '#E8E8E8';   // outer bubble  – clearly visible on #F5F5F5 page
const INNER_BG = '#BEBEBE';   // inner circle  – noticeably darker than halo
const GREEN    = '#00B14F';
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: Animated.AnimatedInterpolation<string | number>;
}) {
  const [c, setC] = useState('#7E7E7E');
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
          tension: 55,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.wrapper, { bottom }]}>
      {/*
        overflow:'visible' on both wrappers is critical – without it the
        overlapping halos get clipped and the bridge disappears.
      */}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab      = TAB_DEFS[index];
          const anim     = anims[index];
          const isActive = state.index === index;

          // ── outer halo: HALO_D circle → pillW + padding pill ──────────
          const haloW = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [HALO_D, tab.pillW + (HALO_D - INNER_D)],
          });
          const haloBg = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [HALO_BG, '#FFFFFF'],
          });

          // ── inner fill: INNER_D circle → pillW pill ────────────────────
          const innerW = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_D, tab.pillW],
          });
          const innerBg = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_BG, GREEN],
          });

          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#7E7E7E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.6, 1],
            outputRange: [0, 0, 1],
          });
          const labelSlotW = anim.interpolate({
            inputRange : [0, 0.5, 1],
            outputRange: [0, 0, tab.pillW - INNER_D - 4],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={[
                // Slide each tab (after the first) left so halos overlap.
                // The 26 px overlap zone is pure HALO_BG on both sides → bridge.
                index > 0 && { marginLeft: -OVERLAP },
                {
                  zIndex: isActive
                    ? 30
                    : TAB_DEFS.length - index, // inactive stack right-to-left
                },
              ]}
            >
              {/* ── Outer halo ──────────────────────────────────────────── */}
              <Animated.View style={[styles.halo, { width: haloW, backgroundColor: haloBg }]}>

                {/* ── Inner fill (icon + label) ───────────────────────── */}
                <Animated.View style={[styles.inner, { width: innerW, backgroundColor: innerBg }]}>
                  <AnimatedIcon name={tab.icon} color={iconColor} />

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
    position  : 'absolute',
    left      : 0,
    right     : 0,
    alignItems: 'center',
    // Must be visible so overlapping halos render outside their sibling bounds
    overflow  : 'visible',
  },

  row: {
    flexDirection: 'row',
    alignItems   : 'center',
    overflow     : 'visible',
  },

  // Outer halo: always HALO_D tall, fully rounded, animates width + colour.
  // Its background colour is what creates the bridge in the overlap zone.
  halo: {
    height        : HALO_D,
    borderRadius  : HALO_D / 2,
    alignItems    : 'center',
    justifyContent: 'center',
    // Soft shadow so the halo reads as a floating element above the page
    shadowColor   : '#000',
    shadowOpacity : 0.10,
    shadowRadius  : 10,
    shadowOffset  : { width: 0, height: 3 },
    elevation     : 4,
  },

  // Inner fill: always ACTIVE_H tall, fully rounded, animates width + colour.
  inner: {
    height        : ACTIVE_H,
    borderRadius  : ACTIVE_H / 2,
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap           : 6,
    overflow      : 'hidden',
  },

  label: {
    color        : '#FFFFFF',
    fontSize     : 14,
    fontFamily   : 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink   : 0,
  },
});
