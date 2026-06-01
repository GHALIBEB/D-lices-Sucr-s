import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminGuard';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { status } = await req.json();
  const order = await prisma.order.update({ where: { id: params.id }, data: { status } });
  await prisma.adminActivity.create({
    data: { action: 'update_order_status', details: `Commande #${params.id.slice(-6)} → ${status}` },
  });
  return NextResponse.json(order);
}
