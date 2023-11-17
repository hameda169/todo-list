import { ToDo as PrismaToDoType, Label as PrismaLabelType } from '.prisma/client';

export type ToDoType = PrismaToDoType & {
  isCompleted: boolean;
  labels: Array<LabelType>;
};

export type LabelType = PrismaLabelType;

export type AsyncRequest<T = any> =
  | { status: 'initial' | 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };
