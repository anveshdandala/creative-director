/**
 * frontend/hooks/useAppAuth.ts
 *
 * Drop-in hook. Use this instead of useAuth() everywhere in the app.
 *
 * What it does:
 *  - Watches Clerk's isSignedIn / isLoaded state.
 *  - On first sign-in, calls POST /api/auth/sync once, stores our JWT,
 *    and caches the AppUser in state.
 *  - On sign-out, clears our JWT.
 *  - Exposes: isReady, isSignedIn, user, token, apiHeaders
 *
 * Usage:
 *   const { isReady, user, apiHeaders } = useAppAuth();
 *   // isReady is true once both Clerk has loaded AND our sync is done
 *
 *   // Making an API call:
 *   fetch("/api/guide", { method: "POST", headers: apiHeaders, body: ... })
 */

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { syncUser, getStoredToken, clearToken, AppUser } from "@/lib/auth";

interface AppAuthState {
  /** True once Clerk has loaded AND our own sync/token check is complete. */
  isReady: boolean;
  isSignedIn: boolean;
  user: AppUser | null;
  /** Our own JWT — use this in fetch Authorization headers. */
  token: string | null;
  /** Pre-built headers object for fetch calls: { "Content-Type", Authorization } */
  apiHeaders: Record<string, string>;
}

export function useAppAuth(): AppAuthState {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const doSync = useCallback(async () => {
    try {
      const appUser = await syncUser(getToken as () => Promise<string | null>);
      setUser(appUser);
      setToken(getStoredToken());
    } catch (err) {
      console.error("[useAppAuth] sync failed:", err);
    } finally {
      setSynced(true);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      const existing = getStoredToken();
      if (existing) {
        // Token already in localStorage from a previous session — skip sync
        setToken(existing);
        setSynced(true);
      } else {
        doSync();
      }
    } else {
      // User signed out
      clearToken();
      setUser(null);
      setToken(null);
      setSynced(true);
    }
  }, [isLoaded, isSignedIn, doSync]);

  const isReady = isLoaded && synced;

  const apiHeaders = useMemo(() => {
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };
  }, [token]);

  return {
    isReady,
    isSignedIn: !!isSignedIn,
    user,
    token,
    apiHeaders,
  };
}
