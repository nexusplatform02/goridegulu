import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_DEFS = [
  { name: 'index', label: 'Home', active: 'home' as const, inactive: 'home-outline' as const },
  { name: 'activity', label: 'Activity', active: 'trending-up' as const, inactive: 'trending-up-outline' as const },
  { name: 'orders', label: 'Orders', active: 'bag-handle' as const, inactive: 'bag-handle-outline' as const },
  { name: 'chat', label: 'Chat', active: 'chatbubble-ellipses' as const, inactive: 'chatbubble-ellipses-outline' as const },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 8);

  return (
    <View style={[styles.bar, { paddingBottom: bottomPad }]}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const tab = TAB_DEFS[index];
        const isHome = index === 0;

        return (
          <View key={route.key} style={styles.tabSlot}>
            <TouchableOpacity
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
              style={[styles.tabBtn, isHome && isActive && styles.homePill]}
            >
              <Ionicons
                name={isActive ? tab.active : tab.inactive}
                size={22}
                color={isHome && isActive ? '#FFFFFF' : isActive ? '#00B14F' : '#8A8A8A'}
              />
              {isHome && isActive && (
                <Text style={styles.homeLabel}>Home</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
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
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  homePill: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#00B14F',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },
  homeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
