import {
  View,
  Text,
  StyleSheet,
  Switch,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    updateDarkMode();
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const updateDarkMode = () => {
    if (themeMode === 'system') {
      setIsDarkMode(systemColorScheme === 'dark');
    } else {
      setIsDarkMode(themeMode === 'dark');
    }
  };

  const handleThemeModeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const getBackgroundStyle = () => ({
    backgroundColor: isDarkMode ? '#1e1e2f' : '#fff',
  });

  const getTextStyle = () => ({
    color: isDarkMode ? '#fff' : '#1e293b',
  });

  const getCardStyle = () => ({
    backgroundColor: isDarkMode ? '#2d2d3f' : '#fff',
    borderColor: isDarkMode ? '#3d3d4f' : '#e2e8f0',
  });

  return (
    <SafeAreaView
      style={[styles.container, getBackgroundStyle()]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, getTextStyle()]}>Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        <View style={[styles.settingCard, getCardStyle()]}>
          <Text style={[styles.settingTitle, getTextStyle()]}>Appearance</Text>

          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'light' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeModeChange('light')}
          >
            <View style={styles.themeOptionContent}>
              <Ionicons
                name="sunny"
                size={22}
                color={isDarkMode ? '#fff' : '#0284c7'}
              />
              <Text style={[styles.themeText, getTextStyle()]}>Light</Text>
            </View>
            {themeMode === 'light' && (
              <Ionicons name="checkmark-circle" size={22} color="#0284c7" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'dark' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeModeChange('dark')}
          >
            <View style={styles.themeOptionContent}>
              <Ionicons
                name="moon"
                size={22}
                color={isDarkMode ? '#fff' : '#0284c7'}
              />
              <Text style={[styles.themeText, getTextStyle()]}>Dark</Text>
            </View>
            {themeMode === 'dark' && (
              <Ionicons name="checkmark-circle" size={22} color="#0284c7" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'system' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeModeChange('system')}
          >
            <View style={styles.themeOptionContent}>
              <Ionicons
                name="settings"
                size={22}
                color={isDarkMode ? '#fff' : '#0284c7'}
              />
              <Text style={[styles.themeText, getTextStyle()]}>System</Text>
            </View>
            {themeMode === 'system' && (
              <Ionicons name="checkmark-circle" size={22} color="#0284c7" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  settingsSection: {
    paddingHorizontal: 15,
  },
  settingCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedTheme: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
