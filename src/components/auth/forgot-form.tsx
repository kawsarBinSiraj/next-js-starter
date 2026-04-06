/**
 * components/auth/forgot-form.tsx
 *
 * Client component — forgot password form.
 *
 * Step 1 of the reset flow: the user enters their email and submits.
 * A success state is shown after submission (no actual email is sent
 * in this demo — replace useResetPassword() body with a real API call).
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---- Yup schema ------------------------------------------------------

const forgotSchema = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required"),
});

type ForgotFields = yup.InferType<typeof forgotSchema>;

// ---- Component --------------------------------------------------------

export function ForgotForm() {
  /** Track whether the reset email has been "sent" (demo: always succeeds) */
  const [submitted, setSubmitted] = useState(false);

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFields>({ resolver: yupResolver(forgotSchema) });

  function onSubmit(data: ForgotFields) {
    resetPassword(
      { email: data.email },
      {
        // Show the success state once the mutation settles
        onSuccess: () => setSubmitted(true),
      }
    );
  }

  // ---- Success state -------------------------------------------------
  if (submitted) {
    return (
      <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            <Mail className="size-3.5" />
            Email sent
          </div>
          <CardTitle className="text-3xl tracking-tight">Check your email</CardTitle>
          <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
            If that email exists in our system, you&apos;ll receive a reset code shortly.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">
            Back to login
          </Link>
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
          <Mail className="size-3.5" />
          Account recovery
        </div>
        <CardTitle className="text-3xl tracking-tight">Forgot password?</CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          Enter your email and we will send you a reset code
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-5">
          {/* Server error banner */}
          {error && (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {error.message}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={isPending}>
            {isPending ? "Sending…" : "Send reset code"}
          </Button>

          <Link href="/login" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
