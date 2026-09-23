import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key') &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.info(
    '[Maestro Supabase] Credentials not configured in .env.local. Running in resilient mock/local mode with full culinary catalog.'
  );
}

// Fallback dummy URL and key for safe client initialization when offline/unconfigured
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-maestro.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient<Database>(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
