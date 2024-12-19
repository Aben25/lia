import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Initialize Supabase environment variables
const supabaseUrl = 'https://ntckmekstkqxqgigqzgn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y2ttZWtzdGtxeHFnaWdxemduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzcwNDA3MCwiZXhwIjoyMDQzMjgwMDcwfQ.V97GVqdldwCTrThr4hJ93sB4pXwD7ito7OQtR4UfzYE';

// Custom storage implementation for Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Handle app state changes for realtime subscriptions
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.removeAllChannels();
  }
});
