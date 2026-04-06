/**
 * app/page.tsx — Home / landing page.
 *
 * Server component.
 * Static content version (no next-intl).
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Box, Database, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
   title: "Home",
   description: "Modern Next.js boilerplate with JWT auth, Zustand, React Query and Docker setup.",
};

export default function HomePage() {
   return (
   <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#ffedd5_26%,_#fff_64%)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_35%,_#030712_72%)]">
         <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-amber-300/35 blur-3xl dark:bg-amber-500/20" />
         <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20" />

         <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-5 text-center pt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/75 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
               <Sparkles className="size-3.5" />
               Production-ready starter
            </div>

            <div className="space-y-3">
               <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-100">
                  Build Faster With A Cleaner Next.js Foundation
               </h1>
               <p className="mx-auto max-w-2xl text-pretty text-sm text-slate-600 sm:text-base dark:text-slate-300">
                  Modern auth flow, resilient API layer, predictable state management, and containerized deployment out
                  of the box.
               </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
               <Button asChild className="h-11 flex-1 rounded-xl text-sm font-semibold">
                  <Link href="/login" className="inline-flex items-center justify-center gap-2">
                     Sign In
                     <ArrowRight className="size-4" />
                  </Link>
               </Button>
               <Button
                  asChild
                  variant="outline"
                  className="h-11 flex-1 rounded-xl border-slate-200 bg-white/75 text-sm font-semibold hover:bg-white dark:border-slate-700 dark:bg-slate-900/70"
               >
                  <Link href="/dashboard">Open Dashboard</Link>
               </Button>
            </div>

            <div className="mt-1 max-w-3xl grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
               <FeatureCard
                  icon={<ShieldCheck className="size-5" />}
                  title="JWT Authentication"
                  description="Secure route protection with verified tokens and cookie-based sessions."
               />
               <FeatureCard
                  icon={<Database className="size-5" />}
                  title="Zustand Store"
                  description="Simple, scalable client state with minimal boilerplate and clear actions."
               />
               <FeatureCard
                  icon={<Sparkles className="size-5" />}
                  title="React Query + Axios"
                  description="Strong data-fetching defaults, caching, retries, and interceptor support."
               />
               <FeatureCard
                  icon={<Box className="size-5" />}
                  title="Docker Ready"
                  description="Ship quickly using the included Dockerfile and compose setup."
               />
            </div>
         </section>
      </main>
   );
}

function FeatureCard({
   icon,
   title,
   description,
}: {
   icon: ReactNode;
   title: string;
   description: string;
}) {
   return (
      <div className="rounded-2xl border border-white/65 bg-white/80 p-4 text-left shadow-lg shadow-amber-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/25">
         <div className="mb-2 inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {icon}
         </div>
         <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
         <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{description}</p>
      </div>
   );
}
