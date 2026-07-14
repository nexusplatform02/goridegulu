import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Tab definitions matching the Grab reference design
const TAB_DEFS = [
  {
    name: 'index',
    label: 'Home',
    icon: 'home' as const,
  },
  {
    name: 'activity',
    label: 'Activity',
    icon: 'trending-up' as const,
  },
  {
    name: 'orders',
    label: 'Payment',
    icon: 'wallet-outline' as const,
  },
  {
    name: 'chat',
    label: 'Chat',
    icon: 'chatbox-ellipses-outline' as const,
  },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'web' ? 20 : Math.max(insets.bottom + 8, 20);

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomOffset }]}>
      <View style={styles.pillBar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const tab = TAB_DEFS[index];
          const isHome = index === 0;

          return (
            <View key={route.key} style={styles.tabSlot}>
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.75}
                style={isHome && isActive ? styles.homePill : styles.iconBox}
              >
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={isHome && isActive ? '#FFFFFF' : '#9E9E9E'}
                />
                {isHome && isActive && (
                  <Text style={styles.homeLabel}>Home</Text>
                )}
              </TouchableOpacity>
            </View>
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

  // Outer floating pill — light gray background matching the reference
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    // Android
    elevation: 12,
  },

  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Inactive tab: soft gray rounded square — no border, matching reference
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active Home tab: green pill with icon + label
  homePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#00B14F',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 50,
  },

  homeLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
