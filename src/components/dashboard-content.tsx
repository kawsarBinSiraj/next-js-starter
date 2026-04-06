/**
 * components/dashboard-content.tsx
 *
 * Protected client component rendered inside app/dashboard/page.tsx.
 *
 * - Reads the current user from Zustand (hydrated by useProfile on mount).
 * - Shows loading / error states.
 * - Provides a sign-out button wired to useLogout().
 */

"use client";

import type { ReactNode } from "react";
import { useProfile } from "@/hooks/auth/use-profile";
import { useLogout } from "@/hooks/auth/use-logout";
import { useAuthStore } from "@/store/auth-store";
import { BadgeCheck, LogOut, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DashboardContent() {
   const { isLoading, error } = useProfile();
   const { mutate: logout, isPending: isLoggingOut } = useLogout();
   const user = useAuthStore((state) => state.user);

   if (isLoading) {
      return (
         <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffedd5_30%,#fff_68%)] px-4 dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#111827_36%,#030712_76%)]">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading profile...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffedd5_30%,#fff_68%)] px-4 dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#111827_36%,#030712_76%)]">
            <p className="text-sm font-medium text-destructive">Failed to load profile.</p>
            <Button variant="outline" className="h-11 rounded-xl" onClick={() => window.location.reload()}>
               <RefreshCw className="size-4" />
               Retry
            </Button>
         </div>
      );
   }

   return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffedd5_24%,#fff_64%)] dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#111827_34%,#030712_75%)]">
         <div className="pointer-events-none absolute -left-24 top-6 h-64 w-64 rounded-full bg-amber-300/35 blur-3xl dark:bg-amber-500/20" />
         <div className="pointer-events-none absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20" />

         <header className="relative z-10 border-b border-white/50 bg-white/60 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-white/10 dark:bg-slate-950/45">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
               <div className="space-y-1">
                  <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                     <BadgeCheck className="size-3.5" />
                     Secure area
                  </p>
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
               </div>

               <Button
                  variant="outline"
                  className="h-9 rounded-xl border-slate-200 bg-white/80 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
               >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
               </Button>
            </div>
         </header>

         <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-5 sm:px-6 sm:py-6">
            <Card className="w-full max-w-xl rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
               <CardHeader className="space-y-2 pb-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                     <ShieldCheck className="size-3.5" />
                     Profile overview
                  </div>
                  <CardTitle className="text-2xl tracking-tight">Welcome, {user?.name ?? "User"}</CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                     Your account information and current session details.
                  </CardDescription>
               </CardHeader>

               <CardContent className="flex flex-col gap-3">
                  <DataRow label="Name" value={user?.name ?? "N/A"} icon={<UserRound className="size-4" />} />
                  <Separator className="bg-slate-200/80 dark:bg-slate-700/70" />

                  <DataRow label="Email" value={user?.email ?? "N/A"} icon={<BadgeCheck className="size-4" />} />
                  <Separator className="bg-slate-200/80 dark:bg-slate-700/70" />

                  <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-3 dark:border-slate-700/70 dark:bg-slate-900/60">
                     <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">User ID</p>
                     <p className="mt-1 break-all font-mono text-sm text-slate-900 dark:text-slate-100">{user?.id ?? "N/A"}</p>
                  </div>
               </CardContent>
            </Card>
         </main>
      </div>
   );
}

function DataRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
   return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-3 dark:border-slate-700/70 dark:bg-slate-900/60">
         <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            {icon}
            {label}
         </p>
         <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100 sm:text-base">{value}</p>
      </div>
   );
}
