/**
 * Server-side Supabase client — service-role key, never exposed to client.
 * Null when env vars are missing (e.g. local dev without Supabase configured).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidUrl(s: string | undefined): s is string {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const supabase: SupabaseClient | null =
  isValidUrl(url) && key ? createClient(url, key) : null;
