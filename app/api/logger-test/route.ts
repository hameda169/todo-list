import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/logger';

export async function GET() {
  const session = await getServerSession(authOptions);
  logger.child({ session }).info(`request to /api/logger-test`);
  return NextResponse.json({ response: 'test endpoint success' }, { status: 200 });
}
