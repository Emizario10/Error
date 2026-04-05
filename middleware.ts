import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes by checking NextAuth session cookies.
  // We avoid importing `next-auth/jwt` here to keep middleware compatible with Turbopack.
  if (pathname.startsWith('/admin')) {
    const sess = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!sess) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
