export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/settings';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getSettings());
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  await updateSettings(data);
  await prisma.adminActivity.create({ data: { action: 'update_settings', details: 'Paramètres mis à jour' } });
  return NextResponse.json({ ok: true });
}
