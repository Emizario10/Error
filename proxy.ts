import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NEXT_MIDDLEWARE: Protegemos las rutas /admin.
 * Usamos export default para permitir el nombre 'proxy' según tu preferencia,
 * manteniendo la compatibilidad con el motor de Next.js.
 */
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
