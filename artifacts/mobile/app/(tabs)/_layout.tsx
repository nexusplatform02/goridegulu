import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Each tab: icon shown inside a rounded-square bordered container when inactive;
// Home tab collapses into a green pill with label when active.
const TAB_DEFS = [
  {
    name: 'index',
    label: 'Home',
    active: 'home' as const,
    inactive: 'home-outline' as const,
  },
  {
    name: 'activity',
    label: 'Transactions',
    active: 'stats-chart' as const,
    inactive: 'stats-chart-outline' as const,
  },
  {
    name: 'orders',
    label: 'Payment',
    active: 'wallet' as const,
    inactive: 'wallet-outline' as const,
  },
  {
    name: 'chat',
    label: 'Chat',
    active: 'chatbubble-ellipses' as const,
    inactive: 'chatbubble-ellipses-outline' as const,
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
                  name={isActive ? tab.active : tab.inactive}
                  size={21}
                  color={
                    isHome && isActive
                      ? '#FFFFFF'
                      : isActive
                      ? '#00B14F'
                      : '#8C8C8C'
                  }
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

  // The outer floating white bar
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    // Android
    elevation: 18,
  },

  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Inactive tab: rounded square with mint green border
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C5EDDA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active Home tab: green pill with icon + label
  homePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#00B14F',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 50,
  },

  homeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
