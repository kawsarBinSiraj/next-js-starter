/**
 * React Query provider for the entire app.
 *
 * Creates a single QueryClient and wraps the component tree with
 * QueryClientProvider.  The client is created lazily and cached in
 * the browser so it survives re-renders without losing cache.
 *
 * Sensible defaults:
 *  - queries : 1 min stale time, 1 retry, no refetch on window focus
 *  - mutations: 0 retries (fail fast)
 */

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Factory that builds a new QueryClient with shared defaults */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,          // consider data fresh for 1 minute
        retry: 1,                      // retry failed queries once
        refetchOnWindowFocus: false,   // don't refetch when tab regains focus
      },
      mutations: {
        retry: 0,                      // mutations should not auto-retry
      },
    },
  });
}

/** Module-level reference so we reuse the same client in the browser */
let browserQueryClient: QueryClient | undefined;

/**
 * Return the singleton QueryClient.
 * On the server a fresh client is always created (no cross-request leaks).
 */
function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server — always create a new client
    return makeQueryClient();
  }

  // Browser — reuse the existing client or create one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

/** Wrap children with the React Query context */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
