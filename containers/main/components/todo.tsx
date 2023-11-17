import { AsyncRequest, ToDoType } from '@/types';
import { useCallback, useState } from 'react';

export default function ToDo({
  toDo,
  onDelete,
  onEdit,
}: {
  toDo: ToDoType;
  onDelete: (deletedToDo: ToDoType) => void;
  onEdit: (editedToDo: ToDoType) => void;
}) {
  const [deleteToDosRequest, setDeleteToDosRequest] = useState<AsyncRequest>({ status: 'initial' });
  const [markToDosDoneRequest, setMarkToDoDoneRequest] = useState<AsyncRequest>({ status: 'initial' });

  const deleteToDo = useCallback(async () => {
    try {
      setDeleteToDosRequest({ status: 'loading', data: undefined, error: undefined });
      await fetch(`/api/todo/${toDo.id}`, { method: 'DELETE' });
      setDeleteToDosRequest({ status: 'success', data: undefined, error: undefined });
      onDelete(toDo);
    } catch (error) {
      setDeleteToDosRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, [toDo, onDelete]);

  const toggleToDoDone = useCallback(async () => {
    try {
      setMarkToDoDoneRequest({ status: 'loading', data: undefined, error: undefined });
      const editedToDo: ToDoType = await (
        await fetch(`/api/todo/${toDo.id}`, {
          method: 'PUT',
          body: JSON.stringify({ isCompleted: !toDo.isCompleted }),
        })
      ).json();
      setMarkToDoDoneRequest({ status: 'success', data: undefined, error: undefined });
      onEdit(editedToDo);
    } catch (error) {
      setMarkToDoDoneRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, [toDo, onEdit]);

  return (
    <div>
      Name: <span>{toDo.name}</span>, Completed: <span>{toDo.isCompleted ? 'Completed' : 'Ungoing'}</span>,{' '}
      <button disabled={deleteToDosRequest.status === 'loading'} onClick={deleteToDo}>
        Delete
      </button>
      ,{' '}
      <button disabled={markToDosDoneRequest.status === 'loading'} onClick={toggleToDoDone}>
        {toDo.isCompleted ? 'Mark as Ungoing' : 'Mark as Done'}
      </button>
    </div>
  );
}
