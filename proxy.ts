import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NEXUS_COMMAND_PROXY: Obscurity-based Security Layer.
 * Protects the /nexus-command vault via session verification.
 */
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect the secret /nexus-command route
  if (pathname.startsWith('/nexus-command')) {
    // Check both standard and secure session tokens
    const sess = req.cookies.get('next-auth.session-token')?.value || 
                 req.cookies.get('__Secure-next-auth.session-token')?.value;

    // Allow access to the login page itself to avoid redirect loops
    if (!sess && !pathname.includes('/nexus-command/login')) {
      const url = req.nextUrl.clone();
      url.pathname = '/nexus-command/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/nexus-command/:path*', '/nexus-command'],
};
