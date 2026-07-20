import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COUNTRIES = [
  { id: 'id', name: 'Indonesia', color1: '#CE1126', color2: '#FFFFFF' },
  { id: 'sg', name: 'Singapore', color1: '#EF3340', color2: '#FFFFFF' },
  { id: 'vn', name: 'Vietnam', color1: '#DA251D', color2: '#F5D000' },
  { id: 'my', name: 'Malaysia', color1: '#CC0001', color2: '#003087' },
  { id: 'th', name: 'Thailand', color1: '#003087', color2: '#FFFFFF' },
  { id: 'ph', name: 'Philippines', color1: '#0038A8', color2: '#CE1126' },
  { id: 'mm', name: 'Myanmar', color1: '#FECB00', color2: '#34A853' },
  { id: 'kh', name: 'Cambodia', color1: '#032EA1', color2: '#E00025' },
];

function FlagBadge({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <View style={styles.flagBadge}>
      <View style={[styles.flagHalf, { backgroundColor: color1 }]} />
      <View style={[styles.flagHalf, { backgroundColor: color2 }]} />
    </View>
  );
}

export default function CountryScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('sg');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelect = async (id: string) => {
    setSelected(id);
    setTimeout(async () => {
      await AsyncStorage.setItem('onboardingDone', 'true');
      await AsyncStorage.setItem('selectedCountry', id);
      router.replace('/(tabs)');
    }, 400);
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 24);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Scooter illustration top right */}
      <View style={styles.scooterWrap}>
        <Image
          source={require('../../assets/images/delivery-scooter.png')}
          style={styles.scooterImage}
          resizeMode="contain"
        />
      </View>

      <Animated.View
        style={[styles.content, { paddingBottom: bottomPad, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.heading}>Hello! Where Would{'\n'}You Like to Go?</Text>

        <View style={styles.grid}>
          {COUNTRIES.map((country) => {
            const isSelected = selected === country.id;
            return (
              <TouchableOpacity
                key={country.id}
                style={[styles.countryCard, isSelected && styles.countryCardActive]}
                activeOpacity={0.75}
                onPress={() => handleSelect(country.id)}
              >
                <FlagBadge color1={country.color1} color2={country.color2} />
                <Text style={[styles.countryName, isSelected && styles.countryNameActive]}>
                  {country.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scooterWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '55%',
    height: 220,
    zIndex: 1,
  },
  scooterImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 180,
    zIndex: 2,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1A1A1A',
    lineHeight: 36,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  countryCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
  },
  countryCardActive: {
    backgroundColor: '#00B14F',
    borderColor: '#00B14F',
  },
  flagBadge: {
    width: 22,
    height: 16,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  flagHalf: {
    flex: 1,
  },
  countryName: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#1A1A1A',
    flex: 1,
  },
  countryNameActive: {
    color: '#FFFFFF',
  },
});
