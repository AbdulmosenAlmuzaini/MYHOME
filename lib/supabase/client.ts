import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const isConfigured = 
    supabaseUrl && 
    !supabaseUrl.includes('placeholder') && 
    supabaseKey && 
    !supabaseKey.includes('placeholder');

  if (!isConfigured) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    supabaseUrl && 
    !supabaseUrl.includes('placeholder') && 
    supabaseKey && 
    !supabaseKey.includes('placeholder')
  );
};
