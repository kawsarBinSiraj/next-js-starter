/**
 * useProfile — React Query query hook for fetching the current user.
 *
 * Reads the JWT from the cookie and decodes the user payload.
 * The query is only enabled when the Zustand auth store says the
 * user is authenticated, avoiding unnecessary work on public pages.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import type { ProfileResponse } from "@/types";

export function useProfile() {
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
   const setUser = useAuthStore((state) => state.setUser);

   return useQuery<ProfileResponse | null>({
      queryKey: ["profile"],

      /** Fetch the user profile from the API and sync it to Zustand */
      queryFn: async () => {
         const profile = await authService.getProfile();

         // Keep Zustand in sync with the token data
         if (profile?.user) {
            setUser(profile.user);
         }

         return profile;
      },

      /** Only run when the user is marked as authenticated */
      enabled: isAuthenticated,

      /** Cache the result for 5 minutes before re-fetching */
      staleTime: 5 * 60 * 1000,
   });
}
