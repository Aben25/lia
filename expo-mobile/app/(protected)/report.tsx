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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReportData = {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'academic' | 'personal' | 'health';
};

export default function ReportScreen() {
  const { session } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        if (!session?.user.email) return;

        // TODO: Replace with actual report data fetch
        setReports([
          {
            id: '1',
            title: 'Academic Progress Report',
            date: '2023-12-15',
            description:
              'Excellent progress in mathematics and science. Showing great interest in programming.',
            type: 'academic',
          },
          {
            id: '2',
            title: 'Health Check Update',
            date: '2023-12-01',
            description:
              'Regular health check-up completed. All vital signs are normal.',
            type: 'health',
          },
        ]);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [session]);

  const getReportTypeIcon = (type: ReportData['type']) => {
    switch (type) {
      case 'academic':
        return 'school';
      case 'health':
        return 'medical';
      case 'personal':
        return 'person';
      default:
        return 'document-text';
    }
  };

  const getReportTypeColor = (type: ReportData['type']) => {
    switch (type) {
      case 'academic':
        return '#0284c7';
      case 'health':
        return '#16a34a';
      case 'personal':
        return '#7c3aed';
      default:
        return '#64748b';
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
        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${getReportTypeColor(report.type)}15` },
                ]}
              >
                <Ionicons
                  name={getReportTypeIcon(report.type)}
                  size={20}
                  color={getReportTypeColor(report.type)}
                />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.date}>
                  {new Date(report.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <Text style={styles.description}>{report.description}</Text>
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
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  description: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginLeft: 52,
  },
});
