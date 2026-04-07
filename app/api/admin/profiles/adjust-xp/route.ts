import { NextResponse } from 'next/server';
import { grantXP } from '@/lib/gamification';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, type } = body;

    if (!userId || typeof amount !== 'number') {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const updatedProfile = await grantXP(userId, amount, type || 'ADMIN_ADJUSTMENT');

    return NextResponse.json(updatedProfile);
  } catch (err: any) {
    console.error('XP adjustment error', err);
    return NextResponse.json({ error: 'XP_ADJUSTMENT_FAIL' }, { status: 500 });
  }
}
