import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type SponsorData = {
  id: string;
  full_name: string;
  email: string;
};

type SponseeData = {
  id: string;
  full_name: string;
  location: string;
  date_of_birth: string;
  grade: string;
  education: string;
  aspiration: string;
  hobby: string;
  about: string;
  how_sponsorship_will_help: string;
  family: string;
  joined_sponsorship_program: string;
  gender: string;
  profile_picture_url?: string;
  profile_picture_id?: string;
  gallery_id?: string;
};

function formatDate(dateString?: string) {
  if (!dateString) return 'Not available';
  try {
    const datePart = dateString.split('T')[0];
    return format(parseISO(datePart), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

function ChildDetailsScreen({
  sponsee,
  signOut,
}: {
  sponsee: SponseeData;
  signOut: () => void;
}) {
  const [activeTab, setActiveTab] = useState('personal');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Family</Text>
              <Text style={styles.sectionText}>{sponsee.family}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aspiration</Text>
              <Text style={styles.sectionText}>{sponsee.aspiration}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hobby</Text>
              <Text style={styles.sectionText}>{sponsee.hobby}</Text>
            </View>
          </View>
        );
      case 'education':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Grade</Text>
              <Text style={styles.sectionText}>
                {sponsee.grade || 'Not specified'}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education Details</Text>
              <Text style={styles.sectionText}>{sponsee.education}</Text>
            </View>
          </View>
        );
      case 'about':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                About {sponsee.full_name.split(' ')[0]}
              </Text>
              <Text style={styles.sectionText}>{sponsee.about}</Text>
            </View>
          </View>
        );
      case 'impact':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How Sponsorship Will Help</Text>
              <Text style={styles.sectionText}>
                {sponsee.how_sponsorship_will_help}
              </Text>
            </View>
          </View>
        );
      case 'gallery':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              {sponsee.gallery_id ? (
                <Text style={styles.sectionText}>Gallery coming soon...</Text>
              ) : (
                <Text style={styles.sectionText}>No gallery available</Text>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.childContainer}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                sponsee.profile_picture_url
                  ? { uri: sponsee.profile_picture_url }
                  : require('../../assets/images/adaptive-icon.png')
              }
              style={styles.profileImage}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.childName}>{sponsee.full_name}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>
                  {formatDate(sponsee.date_of_birth)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{sponsee.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Joined Program</Text>
                <Text style={styles.infoValue}>
                  {formatDate(sponsee.joined_sponsorship_program)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{sponsee.gender}</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'personal' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('personal')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'personal' && styles.activeTabText,
              ]}
            >
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'education' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('education')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'education' && styles.activeTabText,
              ]}
            >
              Education
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'about' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('about')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'about' && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'impact' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('impact')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'impact' && styles.activeTabText,
              ]}
            >
              Impact
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'gallery' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('gallery')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'gallery' && styles.activeTabText,
              ]}
            >
              Gallery
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Home() {
  const { session, signOut } = useAuth();
  const [sponsor, setSponsor] = useState<SponsorData | null>(null);
  const [sponsees, setSponsees] = useState<SponseeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (!session?.user.email) return;

        // Fetch sponsor data
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (sponsorError) throw sponsorError;
        setSponsor(sponsorData);

        if (sponsorData?.id) {
          // Fetch sponsees data with all details
          const { data: sponseesRelData, error: sponseesError } = await supabase
            .from('sponsors_rels')
            .select(
              `
              sponsees (
                id,
                full_name,
                location,
                date_of_birth,
                grade,
                education,
                aspiration,
                hobby,
                about,
                how_sponsorship_will_help,
                family,
                joined_sponsorship_program,
                gender,
                profile_picture_id,
                gallery_id
              )
            `
            )
            .eq('parent_id', sponsorData.id);

          if (sponseesError) throw sponseesError;

          const sponseesList = sponseesRelData.map((rel) => rel.sponsees);

          // Fetch profile pictures
          const profilePictureIds = sponseesList
            .map((sponsee) => sponsee?.profile_picture_id)
            .filter((id) => id != null);

          if (profilePictureIds.length > 0) {
            const { data: mediaData, error: mediaError } = await supabase
              .from('media')
              .select('id, filename')
              .in('id', profilePictureIds);

            if (!mediaError && mediaData) {
              const mediaMap = mediaData.reduce(
                (acc, media) => {
                  acc[media.id] = media.filename;
                  return acc;
                },
                {} as Record<string, string>
              );

              // Add profile picture URLs to sponsees
              sponseesList.forEach((sponsee) => {
                if (sponsee?.profile_picture_id) {
                  const filename = mediaMap[sponsee.profile_picture_id];
                  if (filename) {
                    sponsee.profile_picture_url = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(filename)}`;
                  }
                }
              });
            }
          }

          setSponsees(sponseesList);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
      <ScrollView>
        {sponsees.map((sponsee) => (
          <ChildDetailsScreen
            key={sponsee.id}
            sponsee={sponsee}
            signOut={signOut}
          />
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
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1e1e2f',
    padding: 20,
    paddingTop: 60,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerInfo: {
    paddingHorizontal: 10,
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBarContent: {
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0284c7',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0284c7',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingBottom: 120,
  },
  section: {
    padding: 20,
    backgroundColor: '#f8fafc',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  sectionText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
});
