import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/logger';
import { prismaClient } from '@/app/api/utils';
import { toDoQueryInclude, normalizeToDo } from './utils';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session == null) {
    logger.info(`not authorized GET /api/todo/`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }
  const todos = await prismaClient.toDo.findMany({ where: { userId: session.user.id }, include: toDoQueryInclude });
  logger.child({ user: session.user, todos }).info(`received GET /api/todo/`);
  return NextResponse.json(
    todos.map((todo) => normalizeToDo(todo)),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    logger.info(`not authorized POST /api/todo/`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }

  const data = await request.json();
  const now = new Date();
  const { id: createdToDoId } = await prismaClient.toDo.create({
    data: {
      userId: session.user.id,
      name: data.name,
      createdAt: now,
      updatedAt: now,
      ...(data.labels ? { labels: { create: data.labels.map((labelId: string) => ({ labelId })) } } : {}),
    },
  });
  const todo = (await prismaClient.toDo.findFirst({ where: { id: createdToDoId }, include: toDoQueryInclude }))!;

  logger.child({ user: session.user, todo }).info(`created POST /api/todo/`);
  return NextResponse.json(normalizeToDo(todo), { status: 201 });
}
