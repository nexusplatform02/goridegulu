import { Stack } from 'expo-router';

export default function TransportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"     options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="location"  options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="confirm"   options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="searching" options={{ animation: 'fade' }} />
    </Stack>
  );
}
