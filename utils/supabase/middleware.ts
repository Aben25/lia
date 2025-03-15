import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
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
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Auth pages handling
    if (['/sign-in', '/sign-up', '/login'].includes(request.nextUrl.pathname)) {
      if (session) {
        return NextResponse.redirect(
          new URL('/protected/your-child', request.url)
        );
      }
      return response;
    }

    // Protected routes handling
    if (request.nextUrl.pathname.startsWith('/protected')) {
      if (!session) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      return response;
    }

    // Root path handling
    if (request.nextUrl.pathname === '/') {
      if (session) {
        return NextResponse.redirect(
          new URL('/protected/your-child', request.url)
        );
      }
      return response;
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    console.error('Supabase client error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
