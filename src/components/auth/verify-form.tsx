/**
 * components/auth/verify-form.tsx
 *
 * Client component — email-verification form.
 *
 * The user enters the 6-digit OTP code sent to their email.
 * On success a confirmation state is shown with a link back to login.
 * Replace useVerifyEmail() body with a real API call when ready.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ---- Yup schema ------------------------------------------------------

const verifySchema = yup.object({
   /** Exactly 6 numeric digits */
   code: yup
      .string()
      .matches(/^\d{6}$/, "Must be exactly 6 digits")
      .required("Code is required"),
});

type VerifyFields = yup.InferType<typeof verifySchema>;

// ---- Component --------------------------------------------------------

export function VerifyForm() {
   /** Track whether the verification succeeded */
   const [verified, setVerified] = useState(false);
   const { mutate: verify, isPending, error } = useVerifyEmail();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<VerifyFields>({ resolver: yupResolver(verifySchema) });

   function onSubmit(data: VerifyFields) {
      verify({ code: data.code }, { onSuccess: () => setVerified(true) });
   }

   // ---- Success state -------------------------------------------------
   if (verified) {
      return (
         <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
            <CardHeader className="space-y-3">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <BadgeCheck className="size-3.5" />
                  Verified
               </div>
               <CardTitle className="text-3xl tracking-tight">Email verified</CardTitle>
               <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                  Your email has been verified successfully.
               </CardDescription>
            </CardHeader>
            <CardFooter>
               <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
                  <Link href="/login">Back to login</Link>
               </Button>
            </CardFooter>
         </Card>
      );
   }

   // ---- Default state -------------------------------------------------
   return (
      <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
         {/* Header */}
         <CardHeader className="space-y-3 pb-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
               <BadgeCheck className="size-3.5" />
               Verification
            </div>
            <CardTitle className="text-3xl tracking-tight">Verify your email</CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
               Enter the 6-digit code sent to your email
            </CardDescription>
         </CardHeader>

         <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-5">
               {/* Server error banner */}
               {error && (
                  <div
                     role="alert"
                     className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                  >
                     {error.message}
                  </div>
               )}

               {/* OTP code input */}
               <div className="flex flex-col gap-2">
                  <Label htmlFor="code" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                     Code
                  </Label>
                  <Input
                     id="code"
                     type="text"
                     inputMode="numeric"
                     maxLength={6}
                     placeholder="000000"
                     autoComplete="one-time-code"
                     className="h-11 rounded-xl bg-white/90 text-center font-mono tracking-[0.5em] dark:bg-slate-900/80"
                     {...register("code")}
                  />
                  {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
               </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
               <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={isPending}>
                  {isPending ? "Verifying…" : "Verify"}
               </Button>

               {/* Resend link — replace with actual resend mutation */}
               <button
                  type="button"
                  className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300"
                  onClick={() => {
                     /* TODO: trigger resend mutation */
                  }}
               >
                  Resend code
               </button>

               <Link href="/login" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">
                  Back to login
               </Link>
            </CardFooter>
         </form>
      </Card>
   );
}
