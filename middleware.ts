import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes handling
  if (
    request.nextUrl.pathname === '/auth/sign-in' ||
    request.nextUrl.pathname === '/auth/sign-up' ||
    request.nextUrl.pathname === '/auth/reset-password'
  ) {
    if (session) {
      // If user is signed in and the current path is auth page,
      // redirect to dashboard.
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to auth pages if not signed in
    return res;
  }

  // Protected routes handling
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!session) {
      // If user is not signed in and the current path is protected,
      // redirect to sign-in page.
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    // Allow access to protected pages if signed in
    return res;
  }

  // Public routes - allow access
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
