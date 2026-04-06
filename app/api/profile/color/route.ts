import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: { customColor: color },
    });

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error('THEME_UPDATE_ERR:', err);
    return NextResponse.json({ error: 'VAULT_UPDATE_FAIL' }, { status: 500 });
  }
}
