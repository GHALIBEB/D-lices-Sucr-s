import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { items: { include: { product: true } } },
    orderBy: [{ deliveryDate: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(orders);
}
