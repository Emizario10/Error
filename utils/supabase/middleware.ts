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
    console.error('[AUTH_MIDDLEWARE_ERR]:', e);
  }

  const { pathname } = request.nextUrl;
  const isNexusRoute = pathname.startsWith('/nexus-command');
  const isAccountRoute = pathname.startsWith('/account');
  const isLoginRoute = pathname.startsWith('/login'); // Solo /login
  const isRegisterRoute = pathname.startsWith('/register');
  const isNexusLogin = pathname.includes('/nexus-command/login');

  // 2. Logic: Redirect authenticated operatives away from LOGIN screen only
  // Permitimos /register porque un usuario logueado en Supabase puede necesitar crear su perfil en Prisma
  if (user && isLoginRoute) {
    const url = new URL('/account', request.url);
    const response = NextResponse.redirect(url);
    cookiesToSet(supabaseResponse, response);
    return response;
  }

  // 3. Logic: Protect vaults from unauthenticated entities
  if (!user && (isNexusRoute || isAccountRoute) && !isNexusLogin) {
    const target = isNexusRoute ? '/nexus-command/login' : '/login';
    const url = new URL(target, request.url);
    const response = NextResponse.redirect(url);
    // CRITICAL: Copy cookies to the new redirect response
    cookiesToSet(supabaseResponse, response);
    return response;
  }

  return supabaseResponse;
}

/**
 * Helper to sync cookies between responses.
 * Ensures session persistence during redirects.
 */
function cookiesToSet(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
}
