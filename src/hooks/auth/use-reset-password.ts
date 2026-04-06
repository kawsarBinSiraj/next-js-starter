/**
 * hooks/use-reset-password.ts
 *
 * React Query mutation hook — sends a password-reset request.
 *
 * The mutation resolves with a success message; the component
 * (ResetForm) switches to a success state on resolution.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { ResetPasswordCredentials } from "@/types";

export function useResetPassword() {
   return useMutation<{ message: string }, Error, ResetPasswordCredentials>({
      /** Trigger the reset-password flow (real API call goes in auth-service.ts) */
      mutationFn: (credentials) => authService.resetPassword(credentials),
   });
}
