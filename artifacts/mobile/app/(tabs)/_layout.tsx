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
  pillW: number; // width of the expanded green pill, sized per label
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home',                     pillW: 112 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',               pillW: 128 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',            pillW: 124 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline',  pillW: 104 },
];

const CIRCLE_W = 52; // resting circle diameter

// Animated icon — interpolated color can't be passed directly to Ionicons
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

  // One Animated.Value per tab: 0 = circle, 1 = expanded pill
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
      {/* No single outer pill — tabs are individual bubbles linked by slim connectors */}
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab  = TAB_DEFS[index];
          const anim = anims[index];
          const isLast = index === state.routes.length - 1;

          const width = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [CIRCLE_W, tab.pillW],
          });
          const bgColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#E6E6E6', '#00B14F'],
          });
          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.45, 1],
            outputRange: [0, 0, 1],
          });
          // Label container grows from 0 to a fixed max wide enough for the label
          const labelMaxW = tab.pillW - CIRCLE_W - 18; // pill extra space minus padding
          const labelContainerW = anim.interpolate({
            inputRange : [0, 0.45, 1],
            outputRange: [0, 0, labelMaxW],
          });

          return (
            <React.Fragment key={route.key}>
              {/* Tab bubble */}
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.85}
              >
                <Animated.View style={[styles.bubble, { width, backgroundColor: bgColor }]}>
                  <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                  {/* Label — slides in as pill expands, never truncated */}
                  <Animated.View style={{ width: labelContainerW, overflow: 'hidden' }}>
                    <Animated.Text style={[styles.label, { opacity: labelOpacity }]}>
                      {tab.label}
                    </Animated.Text>
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>

              {/* Slim connector between tabs — not after the last tab */}
              {!isLast && <View style={styles.connector} />}
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
  floatingWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center', // center the bar horizontally if it doesn't fill full width
  },

  // Row of independent bubbles + connectors — no background, no outer pill
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    // subtle shadow cast by each bubble individually via `bubble` below
  },

  // Each tab: its own pill/circle
  bubble: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
    overflow: 'hidden',
    // soft shadow per bubble
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Slim bridge connecting adjacent bubbles
  connector: {
    width: 8,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E6E6E6',
    // no shadow — it's just a small visual link
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
