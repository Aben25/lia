// File: /app/store/useStore.ts
import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../lib/database.types';

type Sponsee = Database['public']['Tables']['Sponsees']['Row'];
type Sponsor = Database['public']['Tables']['Sponsors']['Row'];

interface StoreState {
  sponsee: Sponsee | null;
  sponsor: Sponsor | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const supabase = createClientComponentClient<Database>();

const useStore = create<StoreState>((set) => ({
  sponsee: null,
  sponsor: null,
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      // First, get the authenticated user's email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message);
      }

      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Fetch sponsor data using the authenticated user's email
      const { data: sponsorData, error: sponsorError } = await supabase
        .from('Sponsors')
        .select('*')
        .eq('Email', user.email)
        .single();

      if (sponsorError) {
        throw new Error('Error fetching sponsor: ' + sponsorError.message);
      }

      if (sponsorData) {
        set({ sponsor: sponsorData });

        // Fetch sponsee data using Sponsee_id from sponsor data
        if (sponsorData.Sponsee_id) {
          const { data: sponseeData, error: sponseeError } = await supabase
            .from('Sponsees')
            .select('*')
            .eq('id', sponsorData.Sponsee_id)
            .single();

          if (sponseeError) {
            throw new Error('Error fetching sponsee: ' + sponseeError.message);
          } else {
            set({ sponsee: sponseeData });
          }
        }
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useStore;