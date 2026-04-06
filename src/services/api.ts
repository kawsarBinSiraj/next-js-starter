/**
 * Axios instance pre-configured for the application.
 *
 * - Reads the JWT from the js-cookie access_token on every request
 *   and attaches it as an Authorization header.
 * - Intercepts 401 responses to clear local auth state and redirect
 *   the user to the login page.
 *
 * When you integrate a real backend API, set NEXT_PUBLIC_API_BASE_URL
 * in .env to point at your server and all requests will go through
 * this instance automatically.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getTokenCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import type { ApiError } from "@/types";

/** Create a shared axios instance with sensible defaults */
const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
   withCredentials: true, // include cookies in cross-origin requests
   headers: {
      "Content-Type": "application/json",
   },
});

// --------------------------------------------------
// Request interceptor
// Attach the JWT Bearer token from cookies to every
// outgoing request so the backend can authenticate it.
// --------------------------------------------------
api.interceptors.request.use(
   async (config: InternalAxiosRequestConfig) => {
      const accessToken = getTokenCookie();

      if (accessToken && config.headers) {
         try {
            // Verify and decode the token — throws if expired or invalid
            const { token } = await verifyToken(accessToken);
            config.headers.Authorization = `Bearer ${token}`;
         } catch {
            // Token invalid or expired — skip the header; response interceptor handles 401
         }
      }

      return config;
   },
   (error: AxiosError) => {
      return Promise.reject(error);
   }
);

// --------------------------------------------------
// Response interceptor
// On 401 (Unauthorized), clear local auth state and
// redirect to the login page so the user can re-authenticate.
// --------------------------------------------------
api.interceptors.response.use(
   (response) => response,
   async (error: AxiosError<ApiError>) => {
      const status = error.response?.status;

      if (status === 401) {
         // Dynamically import to avoid circular deps
         if (typeof window !== "undefined") {
            const { useAuthStore } = await import("@/store/auth-store");
            const { removeTokenCookie } = await import("@/lib/cookies");

            // Clear zustand state + cookie
            useAuthStore.getState().logout();
            removeTokenCookie();

            // Send user to login
            window.location.href = "/login";
         }
      }

      return Promise.reject(error);
   }
);

export default api;
