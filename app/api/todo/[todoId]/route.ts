import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/logger';
import { prismaClient } from '@/app/api/utils';
import { normalizeToDo, toDoQueryInclude } from '@/app/api/todo/utils';

export async function GET(_: NextRequest, { params }: { params: { todoId: string } }) {
  const session = await getServerSession(authOptions);
  const todoId = params.todoId;

  if (session == null) {
    logger.child({ todoId }).info(`not authorized GET /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }
  const todo = await prismaClient.toDo.findFirst({ where: { id: todoId }, include: toDoQueryInclude });

  if (todo === null) {
    logger.child({ todoId }).info(`doesn't exist GET /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  if (todo.userId !== session.user.id) {
    logger.child({ todo }).info(`not owned GET /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authorized' }, { status: 403 });
  }

  return NextResponse.json(normalizeToDo(todo), { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: { params: { todoId: string } }) {
  const session = await getServerSession(authOptions);
  const todoId = params.todoId;

  if (session == null) {
    logger.child({ todoId }).info(`not authorized DELETE /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }
  const todo = await prismaClient.toDo.findFirst({ where: { id: todoId }, include: toDoQueryInclude });

  if (todo === null) {
    logger.child({ todoId }).info(`doesn't exist DELETE /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  if (todo.userId !== session.user.id) {
    logger.child({ todo }).info(`not owned DELETE /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authorized' }, { status: 403 });
  }

  await prismaClient.toDo.delete({ where: { id: todo.id } });

  return new Response(null, { status: 204 });
}

export async function PUT(request: NextRequest, { params }: { params: { todoId: string } }) {
  const session = await getServerSession(authOptions);
  const todoId = params.todoId;

  if (session == null) {
    logger.child({ todoId }).info(`not authorized PUT /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }
  const todo = await prismaClient.toDo.findFirst({ where: { id: todoId }, include: toDoQueryInclude });

  if (todo == null) {
    logger.child({ todoId }).info(`doesn't exist PUT /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  if (todo.userId !== session.user.id) {
    logger.child({ todo }).info(`not owned PUT /api/todo/${todoId}`);
    return NextResponse.json({ error: 'not authorized' }, { status: 403 });
  }
  const data = (await request.json()) as Record<string, any> & { isCompleted?: boolean };
  const now = new Date();

  if (data.labels != null) {
    // TODO: should be avoided from deleting the labels that are going to be added again
    await prismaClient.labelsOnToDos.deleteMany({ where: { toDoId: todo.id } });
  }
  const newToDo = await prismaClient.toDo.update({
    where: { id: todo.id },
    data: {
      name: data.name,
      dueDate: data.dueDate,
      ...(data.labels
        ? {
            labels: {
              create: data.labels.map((labelId: string) => ({ labelId })),
            },
          }
        : {}),
      ...(data.isCompleted === true ? { completedAt: now } : {}),
      ...(data.isCompleted === false ? { completedAt: null } : {}),
      updatedAt: now,
    },
    include: toDoQueryInclude,
  });

  return NextResponse.json(normalizeToDo(newToDo), { status: 200 });
}
