import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
}
