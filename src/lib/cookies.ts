/**
 * Client-side cookie helpers using js-cookie.
 *
 * These run in the browser so the login form can set / read / remove
 * the access_token cookie directly after the user submits credentials.
 */

import Cookies from "js-cookie";

/** Name of the cookie that stores the JWT access token */
const TOKEN_NAME = "access_token";

/** Default cookie options shared across set / remove */
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: "/",        // cookie available on every route
  sameSite: "lax",  // CSRF protection while allowing top-level navigations
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
};

/**
 * Persist the JWT token in a browser cookie.
 * Expires after 1 day to match the token lifetime set in lib/jwt.ts.
 */
export function setTokenCookie(token: string): void {
  Cookies.set(TOKEN_NAME, token, {
    ...COOKIE_OPTIONS,
    expires: 1, // 1 day
  });
}

/**
 * Read the current access token from cookies.
 * Returns undefined when no token exists (user not logged in).
 */
export function getTokenCookie(): string | undefined {
  return Cookies.get(TOKEN_NAME);
}

/**
 * Remove the access token cookie.
 * Called on logout to clear the session from the browser.
 */
export function removeTokenCookie(): void {
  Cookies.remove(TOKEN_NAME, { path: "/" });
}
