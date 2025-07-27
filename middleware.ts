import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware with NextAuth Integration
 *
 * This middleware handles:
 * 1. Route protection for authenticated routes (/dashboard/*)
 * 2. Redirect authenticated users away from login page
 * 3. Redirect unauthenticated users to login for protected routes
 * 4. Allow public access to home page (/) and login page
 *
 * Protected routes: /dashboard/*
 * Public routes: /, /login
 * Auth routes: /api/auth/* (automatically excluded)
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

    // Redirect authenticated users away from login page
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow access to protected routes if authenticated
    if (isProtectedRoute && token) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login for protected routes
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ["/", "/login"];
        const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

        if (isPublicRoute) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
