import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
