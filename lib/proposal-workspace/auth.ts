/**
 * Workspace password lookup — Supabase primary, env var fallback.
 *
 * Returns the raw password string for a client slug. Empty string = ungated
 * (dev convenience, matching the original passwordEnv behaviour).
 *
 * Supabase is authoritative when configured. Fallback to WS_PW_{SLUG} allows
 * local dev and CI without a Supabase connection.
 */
import { supabase } from '../supabase';

export async function getWorkspacePassword(slug: string): Promise<string> {
  if (supabase) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('password')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();

    if (!error && data?.password) return data.password as string;
  }

  // Fallback: WS_PW_UREMBO, WS_PW_DEMO, etc.
  return process.env[`WS_PW_${slug.toUpperCase()}`] ?? '';
}
