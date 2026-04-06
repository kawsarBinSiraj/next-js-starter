export default function AuthLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#ffedd5_32%,_#fff_70%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_34%,_#030712_75%)]">
         <div className="pointer-events-none absolute -left-24 top-14 h-56 w-56 rounded-full bg-amber-300/35 blur-3xl dark:bg-amber-500/20" />
         <div className="pointer-events-none absolute -right-20 bottom-8 h-64 w-64 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20" />
         <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
         <div className="relative z-10 w-full">{children}</div>
      </div>
   );
}
