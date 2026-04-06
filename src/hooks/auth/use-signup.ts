/**
 * hooks/use-signup.ts
 *
 * React Query mutation hook — registers a new user.
 *
 * On success:
 *  1. Writes the new user to the Zustand auth store.
 *  2. Navigates to /dashboard.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import type { SignupCredentials, SignupResponse } from "@/types";
import { ROUTES } from "@/utils/constants";

export function useSignup() {
   const router = useRouter();
   const setUser = useAuthStore((state) => state.setUser);

   return useMutation<SignupResponse, Error, SignupCredentials>({
      /** Create account, sign JWT, set cookie */
      mutationFn: (credentials) => authService.signup(credentials),

      /** Persist user in Zustand and navigate to dashboard */
      onSuccess: (data) => {
         setUser(data.user);
         router.push(ROUTES.DASHBOARD);
      },
   });
}
