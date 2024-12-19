import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type NotificationType = 'birthday' | 'graduation' | 'update' | 'achievement';

type NotificationData = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  sponseeId: string;
  sponseeName: string;
};

export default function NotificationScreen() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        if (!session?.user.email) return;

        // TODO: Replace with actual notification data fetch
        setNotifications([
          {
            id: '1',
            type: 'birthday',
            title: 'Birthday Reminder',
            message:
              "Asrat's birthday is coming up next week! She will be turning 9 years old.",
            date: '2023-12-25',
            read: false,
            sponseeId: '1',
            sponseeName: 'Asrat',
          },
          {
            id: '2',
            type: 'graduation',
            title: 'Academic Achievement',
            message:
              'Asrat has successfully completed her current grade with excellent marks!',
            date: '2023-12-20',
            read: true,
            sponseeId: '1',
            sponseeName: 'Asrat',
          },
          {
            id: '3',
            type: 'update',
            title: 'New Progress Report',
            message: "A new progress report has been added to Asrat's profile.",
            date: '2023-12-15',
            read: false,
            sponseeId: '1',
            sponseeName: 'Asrat',
          },
          {
            id: '4',
            type: 'achievement',
            title: 'Special Achievement',
            message:
              "Asrat won first place in her school's science competition!",
            date: '2023-12-10',
            read: true,
            sponseeId: '1',
            sponseeName: 'Asrat',
          },
        ]);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [session]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'birthday':
        return 'gift';
      case 'graduation':
        return 'school';
      case 'update':
        return 'newspaper';
      case 'achievement':
        return 'trophy';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'birthday':
        return '#ec4899';
      case 'graduation':
        return '#0284c7';
      case 'update':
        return '#7c3aed';
      case 'achievement':
        return '#eab308';
      default:
        return '#64748b';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard,
            ]}
          >
            <View style={styles.notificationHeader}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${getNotificationColor(notification.type)}15`,
                  },
                ]}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color={getNotificationColor(notification.type)}
                />
              </View>
              <View style={styles.notificationInfo}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>
                <Text style={styles.date}>{formatDate(notification.date)}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 15,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  notificationCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284c7',
    marginLeft: 8,
    marginTop: 6,
  },
});
