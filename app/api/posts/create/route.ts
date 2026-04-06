import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, category, content, image, authorId } = await req.json();

    const post = await prisma.post.create({
      data: {
        title,
        category,
        content,
        image,
        authorId,
      },
    });

    return NextResponse.json(post);
  } catch (err: any) {
    console.error('POST_CREATE_ERR:', err);
    return NextResponse.json({ error: 'BROADCAST_FAILURE' }, { status: 500 });
  }
}
