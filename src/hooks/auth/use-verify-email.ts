/**
 * hooks/use-verify-email.ts
 *
 * React Query mutation hook — verifies a user's email with an OTP code.
 *
 * On success the VerifyForm switches to a confirmation state.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { VerifyEmailCredentials } from "@/types";

export function useVerifyEmail() {
   return useMutation<{ message: string }, Error, VerifyEmailCredentials>({
      /** Submit the OTP code to the verify flow (real API call goes in auth-service.ts) */
      mutationFn: (credentials) => authService.verifyEmail(credentials),
   });
}
