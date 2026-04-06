"use client";

/**
 * Thin wrapper around sonner so the rest of the app can call
 * `useToast()` and get back a `toast` function with a familiar API.
 *
 * Replaces the deprecated shadcn/ui toast component.
 */

import { toast as sonnerToast } from "sonner";

export type ToastOptions = {
   title?: string;
   description?: string;
   variant?: "default" | "destructive";
};

/** Convenience wrapper that maps the old { title, description, variant } API to sonner */
export function toast({ title, description, variant }: ToastOptions = {}) {
   const message = title ?? "";
   const options = description ? { description } : {};

   if (variant === "destructive") {
      return sonnerToast.error(message, options);
   }
   return sonnerToast(message, options);
}

/** Hook — returns the same `toast` function so call-sites stay unchanged */
export function useToast() {
   return { toast };
}
