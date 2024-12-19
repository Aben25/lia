import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContributionData = {
  id: string;
  amount: number;
  date: string;
  status: string;
};

export default function ContributionScreen() {
  const { session } = useAuth();
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContributions() {
      try {
        if (!session?.user.email) return;

        // TODO: Replace with actual contribution data fetch
        setContributions([
          {
            id: '1',
            amount: 50,
            date: '2023-12-01',
            status: 'Completed',
          },
          {
            id: '2',
            amount: 50,
            date: '2023-11-01',
            status: 'Completed',
          },
        ]);
      } catch (error) {
        console.error('Error loading contributions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContributions();
  }, [session]);

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
        {contributions.map((contribution) => (
          <View key={contribution.id} style={styles.contributionCard}>
            <View style={styles.contributionHeader}>
              <View>
                <Text style={styles.amount}>${contribution.amount}</Text>
                <Text style={styles.date}>
                  {new Date(contribution.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor:
                      contribution.status === 'Completed'
                        ? '#dcfce7'
                        : '#fee2e2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        contribution.status === 'Completed'
                          ? '#16a34a'
                          : '#dc2626',
                    },
                  ]}
                >
                  {contribution.status}
                </Text>
              </View>
            </View>
          </View>
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
  contributionCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
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
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 15,
    color: '#64748b',
  },
});
