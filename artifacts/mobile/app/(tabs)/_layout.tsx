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
  { name: 'chat',     label: 'Chat',     icon: 'chatbox-ellipses-outline', pillW: 108 },
];

// Inner fill diameter (the gray/green circle content area)
const INNER_W   = 52;
// White ring border around each bubble — this IS the visible stroke at every junction
const BORDER_W  = 3;
// Full outer diameter including border
const OUTER_W   = INNER_W + BORDER_W * 2;
// How much each bubble slides behind its left neighbour.
// At this value the two white rings meet cleanly, creating the bridge stroke.
const OVERLAP   = 14;

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
          const tab     = TAB_DEFS[index];
          const anim    = anims[index];
          const isActive = state.index === index;

          // Inner fill width: INNER_W when resting, pill width when active
          const innerWidth = anim.interpolate({
            inputRange : [0, 1],
            outputRange: [INNER_W, tab.pillW],
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
          const labelContainerW = anim.interpolate({
            inputRange : [0, 0.4, 1],
            outputRange: [0, 0, tab.pillW - INNER_W],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={[
                // Every tab after the first overlaps its left neighbour
                index > 0 && { marginLeft: -OVERLAP },
                // Active tab renders on top; others stack left-to-right
                { zIndex: isActive ? 20 : TAB_DEFS.length - index },
              ]}
            >
              {/*
               * The white border ring is the visual "bridge stroke" you see at
               * every junction. When the front bubble overlaps the back one, the
               * front's white left border sits on top of the back's gray fill,
               * creating the clean white connector visible in the reference image.
               */}
              <Animated.View
                style={[
                  styles.outerRing,
                  {
                    width: Animated.add(innerWidth, new Animated.Value(BORDER_W * 2)),
                    borderColor: '#FFFFFF',
                    borderWidth: BORDER_W,
                  },
                ]}
              >
                {/* Inner fill — gray or green */}
                <Animated.View
                  style={[styles.innerFill, { width: innerWidth, backgroundColor: bgColor }]}
                >
                  <AnimatedIcon name={tab.icon} animatedColor={iconColor} />

                  {/* Label — reveals as pill expands, always fits on one line */}
                  <Animated.View style={{ width: labelContainerW, overflow: 'hidden' }}>
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
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // White border ring — animates in width together with the inner fill
  outerRing: {
    height: OUTER_W,
    borderRadius: OUTER_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Subtle shadow so each bubble floats above the page
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    backgroundColor: '#FFFFFF', // white shows through as the ring
  },

  // Colored fill inside the white ring
  innerFill: {
    height: INNER_W,
    borderRadius: INNER_W / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
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
