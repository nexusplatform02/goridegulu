import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

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
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const tab = TAB_DEFS[index];
          const isHome = index === 0;

          return (
            <View key={route.key} style={styles.tabSlot}>
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.75}
                style={[
                  styles.tabBtn,
                  isHome && isActive && styles.homePill,
                ]}
              >
                <Ionicons
                  name={isActive ? tab.active : tab.inactive}
                  size={22}
                  color={isHome && isActive ? '#FFFFFF' : isActive ? '#00B14F' : '#9A9A9A'}
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
    alignItems: 'stretch',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    // Android shadow
    elevation: 20,
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  homePill: {
    flexDirection: 'row',
    gap: 7,
    backgroundColor: '#00B14F',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 30,
  },
  homeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
