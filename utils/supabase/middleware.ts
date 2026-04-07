import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * UPDATE_SESSION: Secure session management for KROM.SYS.
 * Refactored to prevent 307 redirect loops by preserving cookies on all response types.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Identify current identity
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // Suppressing noise in production
  }

  const { pathname } = request.nextUrl;
  const isNexusRoute = pathname.startsWith('/nexus-command');
  const isAccountRoute = pathname.startsWith('/account');
  const isLoginRoute = pathname.startsWith('/login');
  const isNexusLogin = pathname.includes('/nexus-command/login');

  // 2. ADMIN RADIUS: Extreme security for Nexus Command
  if (isNexusRoute && !isNexusLogin) {
    const ADMIN_EMAIL = "juanfe13lasso@gmail.com"
    
    if (!user || user.email !== ADMIN_EMAIL) {
      // Redirect to catalog with tactical alert
      const url = new URL('/catalog', request.url)
      url.searchParams.set('system_alert', 'ACCESS_DENIED_UNAUTHORIZED_IP_LOGGED')
      const response = NextResponse.redirect(url)
      copyCookies(supabaseResponse, response)
      return response
    }
  }

  // 3. Logic: Redirect authenticated operatives away from LOGIN screen
  if (user && isLoginRoute) {
    const url = new URL('/account', request.url);
    const response = NextResponse.redirect(url);
    copyCookies(supabaseResponse, response);
    return response;
  }

  // 4. Logic: Protect account vault from unauthenticated entities
  if (!user && isAccountRoute) {
    const url = new URL('/login', request.url);
    const response = NextResponse.redirect(url);
    copyCookies(supabaseResponse, response);
    return response;
  }

  return supabaseResponse;
}

/**
 * Helper to sync cookies between responses.
 * Ensures session persistence during redirects.
 */
function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
}
