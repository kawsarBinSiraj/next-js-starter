import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Next.js Starter Kit",
   description: "A Next.js starter kit with auth, React Query, and Zustand.",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
               <QueryProvider>
                  {children}
                  <Toaster richColors closeButton duration={1500} />
               </QueryProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
