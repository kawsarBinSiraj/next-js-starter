// ===========================
// User & Auth Types
// ===========================

/** Represents an authenticated user in the system */
export interface User {
  id: string;
  email: string;
  name: string;
}

/** Credentials submitted from the login form */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Fields submitted from the signup form */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

/** Fields submitted from the reset-password form (step 1 — request email) */
export interface ResetPasswordCredentials {
    email: string;
}

/** Fields submitted from the set-new-password form (step 2 — after clicking email link) */
export interface NewPasswordCredentials {
    token: string;       // reset token from the URL query param
    newPassword: string;
}

/** Fields submitted from the verify-email form */
export interface VerifyEmailCredentials {
  code: string;
}

/** Response shape returned after a successful login */
export interface LoginResponse {
  user: User;
  token: string; // JWT stored client-side via js-cookie
  message: string;
}

/** Response shape returned after a successful signup */
export interface SignupResponse {
  user: User;
  token: string;
  message: string;
}

/** Response shape returned when fetching the user profile */
export interface ProfileResponse {
  user: User;
}

// ===========================
// JWT Types
// ===========================

/** Custom JWT payload embedded inside every signed token */
export interface JWTPayload {
  sub?: string;   // User ID
  token?: string; // Original token
  email: string;
  name: string;
  iat?: number;   // Issued-at timestamp
  exp?: number;   // Expiration timestamp
  [key: string]: any; // Allow extra fields if needed
}

// ===========================
// API Types
// ===========================

/** Standard error returned by service calls */
export interface ApiError {
  message: string;
  status: number;
}

/** Generic wrapper for successful responses */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
