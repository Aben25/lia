import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AuthScreen } from './src/screens/AuthScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          // Protected screens
          <Stack.Group>{/* Add your protected screens here */}</Stack.Group>
        ) : (
          // Public screens
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
