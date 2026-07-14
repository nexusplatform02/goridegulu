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
  { name: 'index',    label: 'Home',     icon: 'home',                    pillW: 118 },
  { name: 'activity', label: 'Activity', icon: 'trending-up',              pillW: 130 },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline',           pillW: 126 },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 106 },
];

const CIRCLE_W = 54;    // resting diameter
const OVERLAP  = 10;    // how much adjacent bubbles overlap — creates the chained look

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

          const width = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [CIRCLE_W, tab.pillW],
          });
          const bgColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#EBEBEB', '#00B14F'],
          });
          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });
          // Reserve enough room for the label so it never wraps
          const labelW = anim.interpolate({
            inputRange : [0, 0.4, 1],
            outputRange: [0, 0, tab.pillW - CIRCLE_W - 4],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              // Each tab after the first overlaps the previous by OVERLAP px
              style={index === 0 ? undefined : { marginLeft: -OVERLAP, zIndex: state.index === index ? 10 : index }}
            >
              <Animated.View style={[styles.bubble, { width, backgroundColor: bgColor }]}>
                <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                {/* Label in a fixed-width container — single line, no wrap */}
                <Animated.View style={{ width: labelW, overflow: 'hidden' }}>
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
    alignItems: 'center',  // center the chain horizontally
  },

  // No background, no outer container — just a row of overlapping bubbles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bubble: {
    height: CIRCLE_W,
    borderRadius: CIRCLE_W / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
    overflow: 'hidden',
    // Each bubble casts its own shadow, creating the floating depth look
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
    flexShrink: 0,      // never shrink — the container width controls display
  },
});
