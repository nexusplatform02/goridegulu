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

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TAB_DEFS: {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  pillW: number; // width of the green pill when this tab is active
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 120 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 132 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 128 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 110 },
];

// ─── Geometry ────────────────────────────────────────────────────────────────
//
//  Each inactive tab = two concentric circles:
//
//    ┌─────────────────────┐   ← HALO  (68 px, light #EBEBEB)
//    │   ┌─────────────┐   │
//    │   │  inner btn  │   │   ← INNER (50 px, #DCDCDC)
//    │   │    icon     │   │
//    │   └─────────────┘   │
//    └─────────────────────┘
//
//  Adjacent halos overlap by HALO_OVERLAP pixels.
//  The overlap zone IS the "bridge" — no separate connector needed.
//
//  Active tab = green pill that grows beyond the halo bounds (zIndex on top).
//
const HALO_D       = 68;   // outer halo diameter
const INNER_D      = 50;   // inner button diameter
const HALO_OVERLAP = 20;   // how much adjacent halos overlap → the bridge
const PILL_H       = 52;   // green pill height (active)

const HALO_COLOR  = '#EBEBEB';  // outer halo fill
const INNER_COLOR = '#DCDCDC';  // inner button fill (clearly darker than halo)

// ─────────────────────────────────────────────────────────────────────────────

function AnimatedIcon({
  name,
  animatedColor,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  animatedColor: Animated.AnimatedInterpolation<string>;
}) {
  const [color, setColor] = useState(INNER_COLOR);
  useEffect(() => {
    // Seed with inactive colour immediately
    setColor('#9E9E9E');
    const id = animatedColor.addListener(({ value }) => setColor(value as string));
    return () => animatedColor.removeListener(id);
  }, [animatedColor]);
  return <Ionicons name={name} size={22} color={color} />;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets       = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'web'
    ? 20
    : Math.max(insets.bottom + 8, 20);

  // One spring value per tab: 0 = inactive, 1 = active
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

          // Green pill grows from INNER_D (circle at rest) → tab.pillW
          const pillWidth = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_D, tab.pillW],
          });
          const pillColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_COLOR, '#00B14F'],
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
            outputRange: [0, 0, tab.pillW - INNER_D],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={[
                // Overlap halos: every tab after the first slides left
                index > 0 && { marginLeft: -HALO_OVERLAP },
                // Active tab always on top so the growing pill overlays neighbours
                { zIndex: isActive ? 20 : TAB_DEFS.length - index },
              ]}
            >
              {/*
               * OUTER HALO — the large light circle.
               * overflow:'visible' lets the animated inner pill grow BEYOND these
               * bounds without being clipped.  Adjacent halos overlap each other;
               * that shared grey zone is the visual "bridge" between tabs.
               */}
              <View style={styles.halo}>

                {/*
                 * INNER PILL — starts as the small grey circle, springs into the
                 * full green pill.  Positioned absolute+centred so it can grow
                 * in both directions past the halo edge.
                 */}
                <Animated.View
                  style={[
                    styles.pill,
                    {
                      width          : pillWidth,
                      backgroundColor: pillColor,
                    },
                  ]}
                >
                  <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                  {/* Label slot — width animates open; content fades in */}
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

              </View>
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
  },

  row: {
    flexDirection: 'row',
    alignItems   : 'center',
  },

  // Large outer halo — overlaps adjacent halos to form the bridge
  halo: {
    width          : HALO_D,
    height         : HALO_D,
    borderRadius   : HALO_D / 2,
    backgroundColor: HALO_COLOR,
    alignItems     : 'center',
    justifyContent : 'center',
    overflow       : 'visible', // pill may grow beyond these bounds
  },

  // Animated inner pill — small circle at rest, green pill when active
  pill: {
    height         : PILL_H,
    borderRadius   : PILL_H / 2,
    flexDirection  : 'row',
    alignItems     : 'center',
    justifyContent : 'center',
    paddingHorizontal: 10,
    gap            : 6,
    // Shadow lives on the pill so it follows the active state correctly
    shadowColor    : '#000',
    shadowOpacity  : 0.12,
    shadowRadius   : 8,
    shadowOffset   : { width: 0, height: 3 },
    elevation      : 5,
  },

  label: {
    color        : '#FFFFFF',
    fontSize     : 14,
    fontFamily   : 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink   : 0,
  },
});
