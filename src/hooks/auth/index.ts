/**
 * hooks/auth/index.ts
 *
 * Barrel export for all auth-related hooks.
 * Import from "@/hooks/auth" instead of individual file paths.
 */

export { useLogin }         from "./use-login";
export { useLogout }        from "./use-logout";
export { useSignup }        from "./use-signup";
export { useProfile }       from "./use-profile";
export { useResetPassword } from "./use-reset-password";
export { useNewPassword }   from "./use-new-password";
export { useVerifyEmail }   from "./use-verify-email";
