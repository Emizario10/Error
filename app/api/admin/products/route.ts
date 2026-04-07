import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Support both 'price' (legacy) and the new 'basePrice'/'currentPrice'
    const { name, description, currentPrice, price, imageUrl, category, basePrice, stock } = body;

    const finalPrice = currentPrice || price;
    const finalBasePrice = basePrice || finalPrice;

    if (!name || typeof finalPrice !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        basePrice: finalBasePrice,
        currentPrice: finalPrice,
        imageUrl: imageUrl ?? null,
        category: category ?? null,
        stock: stock !== undefined ? parseInt(stock) : 10,
      },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    logger.error('Create product error', err);
    return NextResponse.json({ error: err.message ?? 'Internal' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (err: any) {
    logger.error('Fetch products error', err);
    return NextResponse.json({ error: err.message ?? 'Internal' }, { status: 500 });
  }
}
