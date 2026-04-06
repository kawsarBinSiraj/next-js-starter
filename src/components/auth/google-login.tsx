"use client";

import { useState } from "react";
import type { TokenResponse } from "@react-oauth/google";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GoogleTokenInfo = {
   azp?: string;
   aud?: string;
   sub?: string;
   scope?: string;
   exp?: string;
   expires_in?: string;
   email?: string;
   email_verified?: string;
   access_type?: string;
};

export type GoogleLoginSuccessPayload = {
   tokenResponse: TokenResponse;
   tokenInfo: GoogleTokenInfo;
   isLoading: boolean;
};

type GoogleLoginProps = {
   onSuccess?: (payload: GoogleLoginSuccessPayload) => void;
};

function GoogleLoginButton({ onSuccess }: GoogleLoginProps) {
   const [isLoading, setIsLoading] = useState(false);

   const login = useGoogleLogin({
      onSuccess: async (tokenResponse: TokenResponse) => {
         try {
            const accessToken = tokenResponse.access_token;
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
            const tokenInfo: GoogleTokenInfo = await response.json();
            onSuccess?.({ tokenResponse, tokenInfo, isLoading: false });
         } finally {
            setIsLoading(false);
         }
      },
      onError: () => {
         setIsLoading(false);
         console.error("[Google OAuth] login failed");
      },
      flow: "implicit",
   });

   const handleLogin = () => {
      if (!clientId || isLoading) return;
      setIsLoading(true);
      login();
   };

   return (
      <Button
         type="button"
         variant="outline"
         className="h-11 w-full rounded-xl border-slate-200 bg-white/80 font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
         disabled={!clientId || isLoading}
         onClick={handleLogin}
      >
         {isLoading ? "Connecting..." : "Continue with Google"}
      </Button>
   );
}

export default function GoogleLogin({ onSuccess }: GoogleLoginProps) {
   if (!clientId) {
      return (
         <Button type="button" variant="outline" className="h-11 w-full rounded-xl" disabled>
            Continue with Google
         </Button>
      );
   }

   return (
      <GoogleOAuthProvider clientId={clientId}>
         <GoogleLoginButton onSuccess={onSuccess} />
      </GoogleOAuthProvider>
   );
}
