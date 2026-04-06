/**
 * hooks/use-login.ts
 *
 * React Query mutation hook — signs the user in.
 *
 * On success:
 *  1. Writes the user to the Zustand auth store.
 *  2. Navigates to /dashboard.
 *     If a `callbackUrl` query param exists the user is sent there instead.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { setTokenCookie } from "@/lib/cookies";
import { signToken } from "@/lib/jwt";
import type { LoginCredentials, LoginResponse } from "@/types";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

export function useLogin() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const setUser = useAuthStore((state) => state.setUser);

   return useMutation<LoginResponse, Error, LoginCredentials>({
      /** Validate credentials, sign JWT, set cookie */
      mutationFn: async (credentials) => {
         const data = await authService.login(credentials);
         setUser(data.user);
         const token = await signToken({ sub: data.user.id, token: data?.token, email: data.user.email, name: data.user.name });
         setTokenCookie(token);
         await new Promise((resolve) => setTimeout(resolve, 1000));
         return data;
      },

      /** Persist user in Zustand and navigate to the intended destination */
      onSuccess: (data) => {
         toast.success(`Welcome back, ${data.user.name}!`);

         // Honour the callbackUrl from the proxy redirect if present
         const callbackUrl = searchParams.get("callbackUrl");
         router.push((callbackUrl as Parameters<typeof router.push>[0]) ?? ROUTES.DASHBOARD);
      },
   });
}
