/**
 * useLogout — React Query mutation hook for signing out.
 *
 * Removes the access_token cookie, clears the Zustand auth store,
 * empties the React Query cache, and redirects to the login page.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { removeTokenCookie } from "@/lib/cookies";
import { ROUTES } from "@/utils/constants";

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    return useMutation({
        /** Remove the cookie (synchronous, no API call) */
        mutationFn: async () => {
            await authService.logout();
            // Wrap synchronous operations in a promise
            await new Promise<void>((resolve) => {
                removeTokenCookie(); // Cookie removal
                resolve();
            });
            await new Promise((resolve) => setTimeout(resolve, 300));
        },

        /** Redirect to login */
        onSuccess: () => {
            router.push(ROUTES.LOGIN);
            setTimeout(() => {
                logout();
                queryClient.clear();
            }, 1000);
        },

        /** Even on error, force-clear everything so the user is logged out */
        onError: () => {
            router.push(ROUTES.LOGIN);
            setTimeout(() => {
                logout();
                queryClient.clear();
            }, 1000);
        },
    });
}
