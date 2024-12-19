import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/auth';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
