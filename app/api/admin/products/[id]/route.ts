import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { basePrice, currentPrice, heatLevel, name, description, imageUrl, category } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        basePrice,
        currentPrice,
        heatLevel,
        name,
        description,
        imageUrl,
        category,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Update product error', err);
    return NextResponse.json({ error: 'VAULT_UPDATE_FAIL' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete product error', err);
    return NextResponse.json({ error: 'VAULT_DELETE_FAIL' }, { status: 500 });
  }
}
