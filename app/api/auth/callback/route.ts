import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * AUTH_CALLBACK: The secure handshake route.
 * Processes the email verification code and establishes the permanent session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next defines where to go after successful verification
  const next = searchParams.get('next') ?? '/account'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Identity confirmed. Forward to target vault.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Error during handshake: Return to login with error state
  return NextResponse.redirect(`${origin}/login?error=HANDSHAKE_FAILED`)
}
