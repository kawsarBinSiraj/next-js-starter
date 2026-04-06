"use client";

/**
 * hooks/use-new-password.ts
 *
 * React Query mutation hook — submits a new password using the reset token
 * from the user's email link (step 2 of the reset flow).
 *
 * Replace the mutationFn stub with a real API call when ready.
 */

import { useMutation } from "@tanstack/react-query";
import type { NewPasswordCredentials } from "@/types";

export function useNewPassword() {
    return useMutation<{ message: string }, Error, NewPasswordCredentials>({
        /** TODO: replace with → const { data } = await api.post("/api/auth/new-password", credentials) */
        mutationFn: async (_credentials: NewPasswordCredentials) => {
            // Stub — always resolves successfully in the demo
            await new Promise((r) => setTimeout(r, 600));
            return { message: "Password updated successfully" };
        },
    });
}
