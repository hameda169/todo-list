import { ToDo as PrismaToDoType } from '.prisma/client';

export type ToDoType = PrismaToDoType & {
  isCompleted: boolean;
};
export type AsyncRequest<T = any> =
  | { status: 'initial' | 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };
