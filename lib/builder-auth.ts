/**
 * Builder session auth — single source of truth (BSO-658).
 *
 * The cookie holds BOTH the Supabase access token (short-lived JWT) AND the
 * refresh token, as JSON: {"a": <access>, "r": <refresh>}. On every request we
 * validate the access token; if it has expired we silently refresh the session
 * with the refresh token and re-write the cookie with the rotated pair. This is
 * what makes the session survive a page reload — the old code stored only the
 * access token, so once it expired (<= 1h) a reload dropped the user back to the
 * login screen with no way to recover.
 *
 * Replaces the five hand-copied getEmail() functions in the builder API routes.
 * Cookie writes happen via cookies().set(), which Next.js permits inside Route
 * Handlers (where all callers live), so each route is a one-line auth check.
 */
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export const SESSION_COOKIE = 'bso_b_sess';

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days — the refresh token keeps the session alive
};

/** Serialize the token pair for the cookie. */
export function sessionCookieValue(access: string, refresh: string): string {
  return JSON.stringify({ a: access, r: refresh });
}

/**
 * Read + validate the builder session from the cookie. If the access token has
 * expired, refresh it with the stored refresh token and re-write the cookie with
 * the rotated pair. Returns the signed-in email, or null when there is no valid
 * session. Call only from Route Handlers (it may write the session cookie).
 */
export async function readSession(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;

  // Local-only dev shortcut (NODE_ENV-gated; needs BUILDER_DEV_LOGIN in .env.local).
  if (!raw) {
    if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_DEV_LOGIN) {
      return process.env.BUILDER_DEV_LOGIN;
    }
    return null;
  }
  if (!supabase) return null;

  // Parse {a,r}; tolerate the legacy bare-access-token cookie (still validates,
  // just can't refresh — the user re-logs in once and gets the new format).
  let access = raw;
  let refresh: string | null = null;
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === 'object' && p.a) {
      access = p.a;
      refresh = p.r || null;
    }
  } catch {
    /* legacy bare token */
  }

  // 1) Access token still valid?
  const { data, error } = await supabase.auth.getUser(access);
  if (!error && data.user) return data.user.email || 'unknown';

  // 2) Expired/invalid — refresh on a fresh, isolated client (no shared-session
  //    mutation under concurrency). Supabase rotates the refresh token, so we
  //    persist the new pair immediately or the next request would be logged out.
  if (!refresh) return null;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const fresh = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: rd, error: re } = await fresh.auth.refreshSession({ refresh_token: refresh });
  if (re || !rd.session || !rd.user) return null;

  try {
    store.set(SESSION_COOKIE, sessionCookieValue(rd.session.access_token, rd.session.refresh_token), sessionCookieOptions);
  } catch {
    /* set() is allowed in Route Handlers; if a caller is outside one, the request
       still succeeds and the next request simply refreshes again. */
  }
  return rd.user.email || 'unknown';
}
