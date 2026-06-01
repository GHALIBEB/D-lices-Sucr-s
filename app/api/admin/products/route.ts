import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const product = await prisma.product.create({ data });
  await prisma.adminActivity.create({ data: { action: 'create_product', details: `Produit créé: ${product.name}` } });
  return NextResponse.json(product, { status: 201 });
}
