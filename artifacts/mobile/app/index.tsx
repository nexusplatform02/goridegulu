import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  // On web: jump straight to tabs — no splash delay needed
  if (Platform.OS === 'web') {
    return <Redirect href="/(tabs)" />;
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        const done = await AsyncStorage.getItem('onboardingDone');
        if (done === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/location');
        }
      } catch {
        router.replace('/onboarding/location');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        Grabby
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B14F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 46,
    fontFamily: 'Aeonik-Bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});
