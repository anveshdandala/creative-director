/**
 * frontend/lib/auth.ts
 *
 * Central place for everything related to our own JWT.
 *
 * Flow:
 *  1. After Clerk sign-in, call syncUser() once.
 *     It posts the Clerk token to POST /api/auth/sync on the backend.
 *     The backend verifies it, upserts the User row, and returns our JWT.
 *  2. Our JWT is stored in localStorage under APP_TOKEN_KEY.
 *  3. Every API call from the browser reads the token via getStoredToken().
 *  4. Server-side Next.js Route Handlers read it from the cookie via getOwnToken(req).
 *
 * The Clerk session token is used ONLY during sync — never attached to any
 * other request.
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const APP_TOKEN_KEY = "app_token";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ---------------------------------------------------------------------------
// Server-side helper (used by Route Handlers in /app/api/**)
// ---------------------------------------------------------------------------

/**
 * Reads our own JWT from the Authorization header of an incoming Next.js
 * Route Handler request (the frontend sets it from localStorage via fetch).
 * Returns null if missing.
 */
export async function getOwnToken(req: NextRequest): Promise<string | null> {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

// ---------------------------------------------------------------------------
// Client-side helpers (used in React components / hooks)
// ---------------------------------------------------------------------------

/** Store our own JWT in localStorage. */
export function storeToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(APP_TOKEN_KEY, token);
  }
}

/** Read our own JWT from localStorage. */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(APP_TOKEN_KEY);
}

/** Remove our own JWT (call on sign-out). */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(APP_TOKEN_KEY);
  }
}

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

/**
 * Call once after Clerk sign-in.
 * Gets the Clerk session token, posts it to the backend sync endpoint,
 * stores our JWT, and returns the AppUser.
 *
 * Usage (in a "use client" component that has access to Clerk's useAuth):
 *
 *   import { useAuth } from "@clerk/nextjs";
 *   import { syncUser } from "@/lib/auth";
 *
 *   const { getToken } = useAuth();
 *   const appUser = await syncUser(getToken);
 */
export async function syncUser(
  getClerkToken: () => Promise<string | null>
): Promise<AppUser> {
  const clerkToken = await getClerkToken();
  if (!clerkToken) throw new Error("No Clerk session");

  const res = await fetch(`${BACKEND_URL}/api/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkToken}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Sync failed");
  }

  const { token, user } = await res.json();
  storeToken(token);
  return user as AppUser;
}
