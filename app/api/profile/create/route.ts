import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, username } = body;

    console.log('[VAULT_DEBUG] INCOMING_DATA:', { id, username });

    if (!id || !username) {
      console.warn('[VAULT_DEBUG] MISSING_REQUIRED_FIELDS');
      return NextResponse.json({ error: 'MISSING_DATA' }, { status: 400 });
    }

    /**
     * VAULT_UPSERT: Ensure operative profile exists.
     * Prevents sync failure if the identity was already established.
     */
    const profile = await prisma.profile.upsert({
      where: { id },
      update: { username }, // Update username if it changed
      create: {
        id,
        username,
      },
    });

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error('[VAULT_SYNC_ERR]:', err);
    return NextResponse.json({ error: 'VAULT_SYNC_ERROR', details: err.message }, { status: 500 });
  }
}
