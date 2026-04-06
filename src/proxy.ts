/**
 * WT-based route protection — for every protected route the proxy
 * reads the `access_token` cookie.  If it is missing or invalid the
 * user is redirected to /login with a `callbackUrl` param.

 * Authenticated users visiting auth pages (login, signup, etc.) are
 * redirected straight to /dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTES } from "@/utils/constants";

/**
 * Returns true when the given pathname matches a protected route.
 * Supports exact matches and nested paths (e.g. /dashboard/settings).
 * Protected routes require a valid JWT cookie — unauthenticated users
 * are redirected to /login with a `callbackUrl` query param.
 */
function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Returns true when the given pathname matches an auth-only route
 * (login, signup, reset-password, verify).
 * Authenticated users visiting these pages are bounced to the dashboard
 * so they cannot see the sign-in form while already logged in.
 */
function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Next.js 16 Proxy — runs before every request matched by `config.matcher`.
 *
 * Guard logic:
 *  1. Auth routes  (login, signup, …)
 *     - Valid token present → redirect to /dashboard (already logged in).
 *     - No / invalid token  → let the request through.
 *  2. Protected routes  (/dashboard, …)
 *     - No token            → redirect to /login?callbackUrl=<pathname>.
 *     - Valid token         → let the request through.
 *     - Invalid/expired token → clear the cookie, redirect to /login.
 *  3. Everything else      → pass through unchanged.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("access_token")?.value;

    // ── Auth routes ────────────────────────────────────────────────────────────
    // If the user is authenticated and tries to visit an auth page → redirect to dashboard
    if (isAuthRoute(pathname)) {
        if (token) {
            try {
                await verifyToken(token);
                return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
            } catch {
                // Token invalid — let them through to the auth page
            }
        }
        return NextResponse.next();
    }

    // ── Public routes ──────────────────────────────────────────────────────────
    // Skip middleware entirely for routes that are neither auth nor protected
    if (!isProtectedRoute(pathname)) {
        return NextResponse.next();
    }

    // ── Protected routes ───────────────────────────────────────────────────────
    // No token → redirect to login and remember where the user was headed
    if (!token) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify signature and expiry — throws on any failure
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        // Token is invalid or expired — clear it and send the user to login
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);

        const response = NextResponse.redirect(loginUrl);
        // Expire the cookie immediately so the browser discards it
        response.cookies.set("access_token", "", { maxAge: 0 });
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.*|apple-icon.*).*)",
    ],
};
