import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/logger';
import { parseZodError, prismaClient } from '@/app/api/utils';
import { toDoQueryInclude, normalizeToDo } from './utils';
import { toDoCreateSchema } from '@/validations';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session == null) {
    logger.info(`not authorized GET /api/todo/`);
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }
  const todos = await prismaClient.toDo.findMany({ where: { userId: session.user.id }, include: toDoQueryInclude });
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
  const validatedData = toDoCreateSchema.safeParse(data);

  if (!validatedData.success) {
    logger.child({ data, error: validatedData.error }).info(`invalid data POST /api/todo/`);
    return NextResponse.json({ error: parseZodError(validatedData.error) }, { status: 400 });
  }
  const now = new Date();
  const { id: createdToDoId } = await prismaClient.toDo.create({
    data: {
      userId: session.user.id,
      name: validatedData.data.name,
      createdAt: now,
      updatedAt: now,
      dueDate: validatedData.data.dueDate,
      ...(validatedData.data.labels
        ? { labels: { create: validatedData.data.labels.map((labelId: string) => ({ labelId })) } }
        : {}),
    },
  });
  const todo = (await prismaClient.toDo.findFirst({ where: { id: createdToDoId }, include: toDoQueryInclude }))!;

  return NextResponse.json(normalizeToDo(todo), { status: 201 });
}
