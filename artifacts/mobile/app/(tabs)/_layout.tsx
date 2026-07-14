import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
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
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 120 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 132 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 128 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 108 },
];

// Resting circle diameter (excluding the white border)
const CIRCLE_W  = 54;
// White border width — this is the "connector stroke" visible at every junction
const BORDER_W  = 3;
// How much each bubble slides behind the previous one
// The white border on both sides fills the gap, giving the connected-ring look
const OVERLAP   = 12;

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
  return <Ionicons name={name} size={22} color={color} />;
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
          toValue: i === state.index ? 1 : 0,
          useNativeDriver: false,
          friction: 7,
          tension: 60,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomOffset }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab  = TAB_DEFS[index];
          const anim = anims[index];
          const isActive = state.index === index;

          const width = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [CIRCLE_W, tab.pillW],
          });
          const bgColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#E8E8E8', '#00B14F'],
          });
          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });
          // Label container expands from 0 → exactly enough for the text (no wrap)
          const labelContainerW = anim.interpolate({
            inputRange : [0, 0.4, 1],
            outputRange: [0, 0, tab.pillW - CIRCLE_W - BORDER_W * 2],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={[
                // Overlap every tab after the first to create the chained ring look
                index > 0 && { marginLeft: -OVERLAP },
                // Active tab always renders on top
                { zIndex: isActive ? 20 : TAB_DEFS.length - index },
              ]}
            >
              <Animated.View
                style={[
                  styles.bubble,
                  {
                    width,
                    backgroundColor: bgColor,
                    // White border ring — the visible "connector stroke" between bubbles
                    borderWidth: BORDER_W,
                    borderColor: '#FFFFFF',
                  },
                ]}
              >
                <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                {/* Label: single line, never wraps */}
                <Animated.View
                  style={{ width: labelContainerW, overflow: 'hidden' }}
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
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // Bare row — no background, no outer container
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bubble: {
    height: CIRCLE_W,
    // borderRadius must account for the border so the pill stays fully rounded
    borderRadius: (CIRCLE_W + BORDER_W * 2) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
    overflow: 'hidden',
    // Subtle drop shadow so each bubble floats above the page
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink: 0,
  },
});
