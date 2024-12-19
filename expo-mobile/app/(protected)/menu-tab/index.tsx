import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../../contexts/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  route?: string;
  badge?: number;
  action?: () => void;
};

export default function MenuScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person',
      route: '/profile',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      route: 'settings',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle',
      route: '/help',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle',
      route: '/about',
    },
    {
      id: 'signout',
      title: 'Sign Out',
      icon: 'log-out',
      action: signOut,
    },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
            >
              <View style={styles.menuItemContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        item.id === 'signout' ? '#fee2e2' : '#f1f5f9',
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.id === 'signout' ? '#dc2626' : '#0284c7'}
                  />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    item.id === 'signout' && styles.signOutText,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  menuSection: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  signOutText: {
    color: '#dc2626',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
