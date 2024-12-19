import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ProtectedLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            height: 85,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 25,
            paddingTop: 10,
          },
          tabBarBackground: () => (
            <View
              style={{
                backgroundColor: '#fff',
                flex: 1,
              }}
            />
          ),
          tabBarActiveTintColor: '#0284c7',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            paddingBottom: 4,
          },
          tabBarItemStyle: {
            paddingTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: '/',
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contribution"
          options={{
            href: '/contribution',
            title: 'Contribution',
            tabBarLabel: 'Contribution',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            href: '/report',
            title: 'Report',
            tabBarLabel: 'Report',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu-tab"
          options={{
            href: '/menu-tab',
            title: 'Menu',
            tabBarLabel: 'Menu',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
