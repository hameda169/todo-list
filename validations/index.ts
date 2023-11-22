import { z } from 'zod';

const toDoShape = {
  name: z.string().min(1, { message: 'Name is required' }),
  labels: z.array(z.string()).min(0).optional(),
  dueDate: z.coerce.date().nullable().optional(),
};
export const toDoCreateSchema = z.object(toDoShape);

export const toDoUpdateSchema = z.object({
  ...toDoShape,
  name: toDoShape.name.optional(),
  isCompleted: z.boolean().optional(),
});
