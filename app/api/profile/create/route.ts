import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, username } = body;

    logger.info('[VAULT_DEBUG] INCOMING_DATA:', { id, username });

    if (!id || !username) {
      logger.warn('[VAULT_DEBUG] MISSING_REQUIRED_FIELDS');
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }


    /**
     * VAULT_UPSERT: Ensure operative profile exists.
     * Prevents sync failure if the identity was already established.
     */
    try {
      const profile = await prisma.profile.upsert({
        where: { id },
        update: { username }, // Update username if it changed
        create: {
          id,
          username,
        },
      });

      return NextResponse.json(profile);
    } catch (dbErr: any) {
      // P2002: Unique constraint failed
      if (dbErr.code === 'P2002') {
        logger.warn(`[IDENTITY_COLLISION] ALIAS_TAKEN: ${username}`);
        return NextResponse.json(
          { error: 'IDENTITY_COLLISION', message: '[!] IDENTITY_COLLISION: Alias already claimed by another operative.' },
          { status: 400 }
        );
      }
      throw dbErr;
    }
  } catch (err: any) {
    console.error('[VAULT_SYNC_ERR]:', err);
    return NextResponse.json({ error: 'VAULT_SYNC_ERROR', details: err.message }, { status: 500 });
  }
}
