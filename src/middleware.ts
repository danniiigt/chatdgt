import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, LOCALES } from "./lib/constants";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  // Handle auth callback and API routes first - skip i18n and auth logic
  if (
    request.nextUrl.pathname.startsWith("/auth/callback") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Create Supabase client
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Extract locale from pathname
  const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale =
    pathParts[0] && LOCALES.includes(pathParts[0] as any)
      ? pathParts[0]
      : DEFAULT_LOCALE;
  const pathnameWithoutLocale = "/" + pathParts.slice(1).join("/");

  // Protected routes (authenticated routes)
  const protectedRoutes = ["/chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Public routes (unauthenticated routes)
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/confirm-email", "/email-confirmed", "/email-verification-error"];
  const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale);

  // Redirect logic - simplified
  if (!session && isProtectedRoute) {
    // Redirect to sign-in if trying to access protected route without session
    const redirectUrl = new URL(`/${locale}/sign-in`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isPublicRoute && pathnameWithoutLocale !== "/" && !pathnameWithoutLocale.includes("confirm-email") && !pathnameWithoutLocale.includes("email-confirmed")) {
    // Redirect to chat if already logged in and trying to access auth pages (but not confirm/email pages)
    const redirectUrl = new URL(`/${locale}/chat`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|_vercel|auth/callback|.*\\..*).*)"],
};
