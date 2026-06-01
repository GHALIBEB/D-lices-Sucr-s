import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const product = await prisma.product.update({ where: { id: params.id }, data });
  await prisma.adminActivity.create({ data: { action: 'update_product', details: `Produit modifié: ${product.name}` } });
  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const product = await prisma.product.delete({ where: { id: params.id } });
  await prisma.adminActivity.create({ data: { action: 'delete_product', details: `Produit supprimé: ${product.name}` } });
  return NextResponse.json({ ok: true });
}
