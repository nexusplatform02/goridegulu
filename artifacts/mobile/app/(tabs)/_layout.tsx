import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
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
  pillW: number; // fill width when active
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 114 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 126 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 122 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 104 },
];

// ─── Geometry ────────────────────────────────────────────────────────────────
const FILL  = 50;          // inner fill circle diameter
const RING  = 3;           // white ring thickness
const OUTER = FILL + RING * 2; // 56 — total outer (white shell) diameter at rest

// Bridge connector between adjacent bubbles
const BRW = 14;
const BRH = 24;
const BRR = 6;

const INACTIVE_FILL = '#E6E6E6';
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedIcon({
  name,
  animatedColor,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  animatedColor: Animated.AnimatedInterpolation<string>;
}) {
  const [color, setColor] = useState('#9E9E9E');
  useEffect(() => {
    const id = animatedColor.addListener(({ value }) => setColor(value as string));
    return () => animatedColor.removeListener(id);
  }, [animatedColor]);
  return <Ionicons name={name} size={21} color={color} />;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets       = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'web' ? 20 : Math.max(insets.bottom + 8, 20);

  const anims = useRef(
    TAB_DEFS.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    Animated.parallel(
      anims.map((anim, i) =>
        Animated.spring(anim, {
          toValue        : i === state.index ? 1 : 0,
          useNativeDriver: false,
          friction       : 7,
          tension        : 60,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab      = TAB_DEFS[index];
          const anim     = anims[index];
          const isActive = state.index === index;
          const isLast   = index === state.routes.length - 1;

          // Outer white shell: starts at OUTER (56), grows to pillW + ring×2
          const shellWidth = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [OUTER, tab.pillW + RING * 2],
          });

          // Inner coloured fill: starts at FILL (50), grows to pillW
          const fillWidth = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [FILL, tab.pillW],
          });

          const bgColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INACTIVE_FILL, '#00B14F'],
          });
          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.55, 1],
            outputRange: [0, 0, 1],
          });
          const labelSlotW = anim.interpolate({
            inputRange : [0, 0.45, 1],
            outputRange: [0, 0, tab.pillW - FILL - 4],
          });

          return (
            <React.Fragment key={route.key}>

              {/* ── Bubble: white shell → coloured fill ─────────────── */}
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.82}
                style={{ zIndex: isActive ? 10 : 1 }}
              >
                {/*
                 * White shell — a real layout View whose width is animated.
                 * Its white background IS the visible ring.  Because it is an
                 * independent Animated.View (not borderWidth), it can never be
                 * clipped and always shows as a distinct white stroke around
                 * the coloured fill inside.
                 */}
                <Animated.View style={[styles.shell, { width: shellWidth }]}>
                  {/* Coloured fill (grey → green) centred inside the shell */}
                  <Animated.View
                    style={[styles.fill, { width: fillWidth, backgroundColor: bgColor }]}
                  >
                    <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

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

              {/* ── Bridge connector (not after last tab) ───────────── */}
              {!isLast && <View style={styles.bridge} />}

            </React.Fragment>
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
    left    : 0,
    right   : 0,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems   : 'center',
  },

  // White outer shell — its background colour IS the white ring stroke
  shell: {
    height      : OUTER,
    borderRadius: OUTER / 2,
    backgroundColor: '#FFFFFF',
    alignItems  : 'center',
    justifyContent: 'center',
    // Shadow applied to the shell so the ring casts the drop shadow
    shadowColor  : '#000',
    shadowOpacity: 0.10,
    shadowRadius : 8,
    shadowOffset : { width: 0, height: 3 },
    elevation    : 5,
  },

  // Coloured fill — always RING px inset from each edge of the shell
  fill: {
    height      : FILL,
    borderRadius: FILL / 2,
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap      : 5,
    overflow : 'hidden',
  },

  // Small grey rounded bridge between adjacent bubbles
  bridge: {
    width          : BRW,
    height         : BRH,
    borderRadius   : BRR,
    backgroundColor: INACTIVE_FILL,
  },

  label: {
    color        : '#FFFFFF',
    fontSize     : 14,
    fontFamily   : 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink   : 0,
  },
});
