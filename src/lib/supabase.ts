import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  /^https?:\/\//i.test(supabaseUrl),
);

export const backendMode = isSupabaseConfigured ? 'live' : 'demo';

if (!isSupabaseConfigured) {
  console.warn(
    '[ClassFlow] Running in DEMO mode. Configure VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_ANON_KEY for real authentication and persistent data.',
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'demo-placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
