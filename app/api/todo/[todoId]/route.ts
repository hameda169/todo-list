import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import logger from '@/logger';
import { parseZodError, prismaClient } from '@/app/api/utils';
import { normalizeToDo, toDoQueryInclude } from '@/app/api/todo/utils';
import { toDoUpdateSchema } from '@/validations';

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
  const data = await request.json();
  const validatedData = toDoUpdateSchema.safeParse(data);

  if (!validatedData.success) {
    logger.child({ data, error: validatedData.error }).info(`invalid data PUT /api/todo/${todoId}`);
    return NextResponse.json({ error: parseZodError(validatedData.error) }, { status: 400 });
  }
  const now = new Date();

  if (validatedData.data.labels != null) {
    // TODO: should be avoided from deleting the labels that are going to be added again
    await prismaClient.labelsOnToDos.deleteMany({ where: { toDoId: todo.id } });
  }
  const newToDo = await prismaClient.toDo.update({
    where: { id: todo.id },
    data: {
      name: validatedData.data.name,
      dueDate: validatedData.data.dueDate,
      ...(validatedData.data.labels
        ? {
            labels: {
              create: validatedData.data.labels.map((labelId: string) => ({ labelId })),
            },
          }
        : {}),
      ...(validatedData.data.isCompleted === true ? { completedAt: now } : {}),
      ...(validatedData.data.isCompleted === false ? { completedAt: null } : {}),
      updatedAt: now,
    },
    include: toDoQueryInclude,
  });

  return NextResponse.json(normalizeToDo(newToDo), { status: 200 });
}
