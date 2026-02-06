import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey, isSupabaseConfigured } from './info';

// Create a null client for demo mode
const createNullClient = (): Partial<SupabaseClient> => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - no backend configured' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - no backend configured' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: { message: 'Demo mode - no backend configured' } }),
    update: () => ({ data: [], error: { message: 'Demo mode - no backend configured' } }),
    delete: () => ({ data: [], error: { message: 'Demo mode - no backend configured' } }),
    upsert: () => ({ data: [], error: { message: 'Demo mode - no backend configured' } })
  })
} as any);

// Create Supabase client with fallback handling
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, publicAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createNullClient();

// Export configuration status
export { isSupabaseConfigured };