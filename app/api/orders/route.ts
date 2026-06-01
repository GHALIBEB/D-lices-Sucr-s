import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      customerName: body.customerName,
      phone: body.phone,
      city: body.city,
      address: body.address || null,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
      occasion: body.occasion || null,
      notes: body.notes || null,
      total: body.total,
      items: {
        create: body.items.map((item: { productId: string; quantity: number; price: number }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return NextResponse.json(order, { status: 201 });
}
