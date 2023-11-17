import { NextResponse } from 'next/server';
import { prismaClient } from '@/app/api/utils';

export async function GET() {
  const labels = await prismaClient.label.findMany();
  return NextResponse.json(labels, { status: 200 });
}
