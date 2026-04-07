import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, image, category, authorId } = body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        category,
        authorId,
      },
    });

    return NextResponse.json(post);
  } catch (err: any) {
    logger.error('POST_CREATE_ERR:', err);
    return NextResponse.json({ error: 'POST_CREATE_FAIL' }, { status: 500 });
  }
}
