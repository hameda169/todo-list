import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';

const prismaClient = new PrismaClient();

export { prismaClient };

export function parseZodError(error: ZodError) {
  const firstIssue = error.issues[0];
  return `${firstIssue.path.toString()} - ${firstIssue.message}`;
}
