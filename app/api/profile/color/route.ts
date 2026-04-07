import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const TACTICAL_UNLOCKS: Record<string, number> = {
  '#CCFF00': 1, // ACID_GREEN
  '#00F0FF': 2, // COBALT_BLUE
  '#FF003C': 3, // INFRARED_RED
  '#FF8A00': 4, // ARCHITECT_ORANGE
  '#FFFFFF': 5, // GHOST_WHITE
};

export async function PATCH(req: Request) {
  try {
    const { color } = await req.json();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    // 1. SECURITY_VALIDATION: Do not trust the client.
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { clearanceLevel: true }
    });

    if (!profile) return NextResponse.json({ error: 'PROFILE_NOT_FOUND' }, { status: 404 });

    const requiredLevel = TACTICAL_UNLOCKS[color.toUpperCase()] || 99;

    if (profile.clearanceLevel < requiredLevel) {
      console.error(`[SEC_VIOLATION] ILLEGAL_COLOR_REQUEST: ${color} | USER_L${profile.clearanceLevel} | REQ_L${requiredLevel}`);
      return NextResponse.json({ error: '[ SYS_ERROR: INSUFFICIENT_CLEARANCE ]' }, { status: 403 });
    }

    // 2. VAULT_UPDATE: Apply the tactical shift
    const updatedProfile = await prisma.profile.update({
      where: { id: user.id },
      data: { customColor: color },
    });

    return NextResponse.json(updatedProfile);
  } catch (err: any) {
    console.error('THEME_UPDATE_ERR:', err);
    return NextResponse.json({ error: 'VAULT_UPDATE_FAIL' }, { status: 500 });
  }
}
