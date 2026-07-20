import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAllow = async () => {
    router.push('/onboarding/country');
  };

  const handleEnter = () => {
    router.push('/onboarding/country');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 24);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* App name at top */}
      <Text style={styles.appName}>Grabby</Text>

      {/* Illustration */}
      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../assets/images/delivery-location.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Bottom content */}
      <Animated.View
        style={[
          styles.bottomContent,
          { paddingBottom: bottomPad + 16, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.heading}>Location is{'\n'}Important</Text>
        <Text style={styles.subtitle}>
          Ride pick-ups will be faster, more{'\n'}accurate, and safer.
        </Text>

        <TouchableOpacity style={styles.allowBtn} activeOpacity={0.85} onPress={handleAllow}>
          <Text style={styles.allowBtnText}>Allow Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.enterBtn} activeOpacity={0.85} onPress={handleEnter}>
          <Text style={styles.enterBtnText}>Enter Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF9F3',
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#00B14F',
    marginTop: 12,
    letterSpacing: 1,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  illustration: {
    width: '90%',
    height: 280,
  },
  bottomContent: {
    width: '100%',
    paddingHorizontal: 28,
    gap: 0,
  },
  heading: {
    fontSize: 34,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1A1A1A',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#8A8A8A',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  allowBtn: {
    backgroundColor: '#00B14F',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  allowBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  enterBtn: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
  },
  enterBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1A1A1A',
  },
});
