import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { grantXP } from '@/lib/gamification';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
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

    // 1. DATABASE CHECK: Query the XPLog table for this profileId where type is "EASTER_EGG_KROM"
    const existingLog = await prisma.xPLog.findFirst({
      where: {
        profileId: user.id,
        type: 'EASTER_EGG_KROM',
      },
    });

    if (existingLog) {
      return NextResponse.json(
        { success: false, message: "BREACH_ALREADY_LOGGED" },
        { status: 400 }
      );
    }

    // 2. GRANT XP: Call existing grantXP
    await grantXP(user.id, 100, "EASTER_EGG_KROM");

    // 3. SECONDARY FLAG: Update Profile to set kromEasterEggFound: true
    await prisma.profile.update({
      where: { id: user.id },
      data: { kromEasterEggFound: true },
    });

    return NextResponse.json({
      success: true,
      message: "SYSTEM_BREACH_SUCCESS: +100 XP"
    });

  } catch (err: any) {
    logger.error('EASTER_EGG_ERR:', err);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
