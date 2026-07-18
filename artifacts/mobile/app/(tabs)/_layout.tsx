import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeIcon, ActivityIcon, WalletIcon, ChatIcon } from '../../components/TabIcons';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TAB_DEFS: {
  name: string;
  label: string;
  Icon: React.FC<{ color: string; size?: number }>;
  activeWidth: number;
}[] = [
  { name: 'index',    label: 'Home',     Icon: HomeIcon,     activeWidth: 130 },
  { name: 'activity', label: 'Activity', Icon: ActivityIcon, activeWidth: 130 },
  { name: 'orders',   label: 'Payment',  Icon: WalletIcon,   activeWidth: 130 },
  { name: 'chat',     label: 'Chat',     Icon: ChatIcon,     activeWidth: 110 },
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const BAR_BG        = '#E2E2E2';  // outer container background
const CIRCLE_BG     = '#EFEFEF';  // inactive tab circle
const GREEN         = '#00B14F';  // active pill colour
const ICON_INACTIVE = '#1A1A1A';
const CIRCLE_SIZE   = 54;         // inactive circle diameter
const PILL_H        = 54;         // pill height (same as circle for alignment)
const BAR_PADDING   = 8;          // inner padding of the bar container
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedIcon({
  Icon,
  color,
}: {
  Icon: React.FC<{ color: string; size?: number }>;
  color: Animated.AnimatedInterpolation<string | number>;
}) {
  const [c, setC] = useState(ICON_INACTIVE);
  useEffect(() => {
    const id = color.addListener(({ value }) => setC(value as string));
    return () => color.removeListener(id);
  }, [color]);
  return <Icon color={c} size={22} />;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'web' ? 24 : Math.max(insets.bottom + 12, 24);

  const anims = useRef(
    TAB_DEFS.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    Animated.parallel(
      anims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: i === state.index ? 1 : 0,
          useNativeDriver: false,
          friction: 8,
          tension: 60,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.wrapper, { bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TAB_DEFS[index];
          const anim = anims[index];
          const isActive = state.index === index;

          // Animate pill width: circle → active pill width
          const pillW = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [CIRCLE_SIZE, tab.activeWidth],
          });

          // Animate background: circle bg → green
          const bgColor = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [CIRCLE_BG, GREEN],
          });

          // Icon and label colours
          const iconColor = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [ICON_INACTIVE, '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange: [0, 0.55, 1],
            outputRange: [0, 0, 1],
          });
          // Label slot width slides open after icon is centred
          const labelSlotW = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, tab.activeWidth - CIRCLE_SIZE - 2],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.82}
              style={{ zIndex: isActive ? 10 : 1 }}
            >
              <Animated.View
                style={[
                  styles.pill,
                  { width: pillW, backgroundColor: bgColor },
                ]}
              >
                <AnimatedIcon Icon={tab.Icon} color={iconColor} />

                {/* Label slides in when active */}
                <Animated.View
                  style={{ width: labelSlotW, overflow: 'hidden' }}
                >
                  <Animated.Text
                    style={[styles.label, { opacity: labelOpacity }]}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {tab.label}
                  </Animated.Text>
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
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // Outer rounded container — the unified gray pill bar
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BAR_BG,
    borderRadius: (PILL_H + BAR_PADDING * 2) / 2,
    padding: BAR_PADDING,
    // Subtle shadow so it floats above the page
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Each tab animates from a CIRCLE_SIZE circle to an active pill
  pill: {
    height: PILL_H,
    borderRadius: PILL_H / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
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
