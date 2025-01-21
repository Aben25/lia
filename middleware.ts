import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

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
      // redirect to protected area
      return NextResponse.redirect(
        new URL('/protected/your-child', request.url)
      );
    }
    // console.log('unauthenticated', supabase.storage);

    // Allow access to auth pages if not signed in
    return response;
  }

  // Handle dashboard redirect
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/protected/your-child', request.url));
  }

  if (request.nextUrl.pathname === '/protected/reset-password') {
    if (session) {
      return response;
    }

    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/reset-password', request.url)
      );
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL('/auth/reset-password', request.url)
      );
    }

    return response;
  }
  // Protected routes handling
  if (
    request.nextUrl.pathname.startsWith('/protected') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    // const isPKCEFlow = await supabase.auth.isP
    if (!session) {
      // If user is not signed in and the current path is protected,
      // redirect to sign-in page.
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    // Allow access to protected pages if signed in
    return response;
  }

  // Public routes - allow access
  return response;
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
