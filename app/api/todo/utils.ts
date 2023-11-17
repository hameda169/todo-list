export const toDoQueryInclude = {
  labels: { include: { label: true } },
  user: { select: { id: true, name: true, email: true, image: true } },
};
export function normalizeToDo(
  todo: Record<string, unknown> & { labels: Array<Record<string, unknown> & { label: Record<string, unknown> }> },
) {
  return {
    ...todo,
    userId: undefined,
    labels: todo.labels.map((label) => label.label),
    isCompleted: todo.completedAt != null,
  };
}
