import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const products = await prisma.product.findMany();

    await prisma.$transaction(
      products.map((p: any) =>
        prisma.product.update({
          where: { id: p.id },
          data: {
            currentPrice: p.basePrice,
            salesCount: 0,
            heatLevel: 0,
          },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'MARKET_RESET_COMPLETE' });
  } catch (err: any) {
    logger.error('Market reset error', err);
    return NextResponse.json({ error: 'MARKET_RESET_FAIL' }, { status: 500 });
  }
}
