export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [todayOrders, weekOrders, monthOrders, pending, urgent, upcoming] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.findMany({
      where: { deliveryDate: { gte: now, lte: in24h }, status: { notIn: ['livre', 'annule'] } },
      include: { items: { include: { product: true } } },
      orderBy: { deliveryDate: 'asc' },
    }),
    prisma.order.findMany({
      where: { deliveryDate: { gte: now }, status: { notIn: ['livre', 'annule'] } },
      include: { items: { include: { product: true } } },
      orderBy: { deliveryDate: 'asc' },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    todayOrders,
    weekOrders,
    monthRevenue: monthOrders._sum.total || 0,
    pendingCount: pending,
    urgentOrders: urgent,
    upcomingDeliveries: upcoming,
  });
}
