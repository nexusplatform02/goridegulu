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
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home' },
  { name: 'activity', label: 'Activity', icon: 'trending-up' },
  { name: 'orders',   label: 'Payment',  icon: 'wallet-outline' },
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline' },
];

const PILL_W   = 116;
const CIRCLE_W = 52;

// Animated icon — listens to an interpolated color value and re-renders
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

  // One Animated.Value per tab: 0 = small circle, 1 = expanded pill
  const anims = useRef(
    TAB_DEFS.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    Animated.parallel(
      anims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: i === state.index ? 1 : 0,
          useNativeDriver: false, // animating layout props — native driver not supported
          friction: 7,
          tension: 60,
        })
      )
    ).start();
  }, [state.index]);

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomOffset }]}>
      <View style={styles.pillBar}>
        {state.routes.map((route, index) => {
          const tab  = TAB_DEFS[index];
          const anim = anims[index];

          const width = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [CIRCLE_W, PILL_W],
          });
          const bgColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#DCDCDC', '#00B14F'],
          });
          const iconColor = anim.interpolate({
            inputRange : [0, 1],
            outputRange: ['#9E9E9E', '#FFFFFF'],
          });
          const labelOpacity = anim.interpolate({
            inputRange : [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });
          const labelWidth = anim.interpolate({
            inputRange : [0, 0.45, 1],
            outputRange: [0, 0, 54],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={styles.tabSlot}
            >
              <Animated.View style={[styles.tabPill, { width, backgroundColor: bgColor }]}>
                <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                {/* Label slides in as pill expands */}
                <Animated.View style={{ width: labelWidth, overflow: 'hidden' }}>
                  <Animated.Text
                    style={[styles.tabLabel, { opacity: labelOpacity }]}
                    numberOfLines={1}
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
    left: 16,
    right: 16,
  },

  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },

  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabPill: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
    overflow: 'hidden',
  },

  tabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
