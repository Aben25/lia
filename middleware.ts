import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // If we're on an auth page and we're authenticated, redirect to protected area
  if (
    (pathname === '/sign-in' ||
      pathname === '/sign-up' ||
      pathname === '/login') &&
    !res.headers.get('location')
  ) {
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
