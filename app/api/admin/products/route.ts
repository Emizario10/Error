import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, category } = body;

    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price,
        imageUrl: imageUrl ?? null,
        category: category ?? null,
      },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    console.error('Create product error', err);
    return NextResponse.json({ error: err.message ?? 'Internal' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (err: any) {
    console.error('Fetch products error', err);
    return NextResponse.json({ error: err.message ?? 'Internal' }, { status: 500 });
  }
}
