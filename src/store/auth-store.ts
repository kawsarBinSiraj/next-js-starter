/**
 * Zustand auth store with localStorage persistence.
 *
 * Keeps the currently logged-in user and an isAuthenticated flag.
 * The persist middleware serialises a subset of the state to
 * localStorage so a page refresh doesn't lose the session.
 *
 * The real source of truth for "can access protected routes" is the
 * JWT cookie checked by middleware.ts — this store is a convenience
 * for the UI layer.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

// ---- State shape ----

/** Read-only slices of the auth store */
interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
}

/** Mutation methods exposed by the auth store */
interface AuthActions {
   /** Save a user object after a successful login */
   setUser: (user: User) => void;

   /** Remove user data without side-effects (e.g. clearing cookies) */
   clearUser: () => void;

   /** Full logout: clear user state (cookie removal is handled elsewhere) */
   logout: () => void;
}

type AuthStore = AuthState & AuthActions;

// ---- Store creation ----

export const useAuthStore = create<AuthStore>()(
   persist(
      (set) => ({
         // -- Initial state --
         user: null,
         isAuthenticated: false,

         // -- Actions --
         setUser: (user) => set({ user, isAuthenticated: true }),
         clearUser: () => set({ user: null, isAuthenticated: false }),
         logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
         name: "auth-storage", // localStorage key
         storage: createJSONStorage(() => localStorage),

         /** Only persist what we need — actions are recreated on hydration */
         partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
         }),
      }
   )
);
