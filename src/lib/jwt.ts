/**
 * JWT utilities powered by the `jose` library.
 *
 * - signToken  : creates a signed HS256 JWT with a 24 h expiry.
 * - verifyToken: validates the signature + expiry and returns the payload.
 * - getJwtSecret: returns the secret as a Uint8Array (shared with middleware).
 *
 * The secret is read from the NEXT_PUBLIC_JWT_SECRET env var.
 * A dev-only fallback is used when the var is missing so the app still
 * works locally without extra setup.
 */

import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "@/types";

/**
 * Encode the JWT_SECRET string into a Uint8Array required by jose.
 * Falls back to a hard-coded dev secret when the env var is absent.
 */
export function getJwtSecret(): Uint8Array {
   const secret = process.env.NEXT_PUBLIC_JWT_SECRET || "5dlCnN}y!G#XPQEo";
   return new TextEncoder().encode(secret);
}

/**
 * Create a signed JWT for the given payload.
 * `iat` and `exp` are set automatically by jose.
 */
export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
   const secret = getJwtSecret();

   return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);
}

/**
 * Verify an existing token and return its decoded payload.
 * Throws if the token is expired or the signature is invalid.
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
   const secret = getJwtSecret();
   const { payload } = await jwtVerify(token, secret);
   return payload as unknown as JWTPayload;
}
