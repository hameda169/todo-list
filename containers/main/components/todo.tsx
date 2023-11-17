import { AsyncRequest, ToDoType } from '@/types';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useLabels } from '@/containers/main/contexts/label';
import dayjs from 'dayjs';

export default function ToDo({
  toDo,
  onDelete,
  onEdit,
}: {
  toDo: ToDoType;
  onDelete: (deletedToDo: ToDoType) => void;
  onEdit: (editedToDo: ToDoType) => void;
}) {
  const labels = useLabels();
  const [deleteToDosRequest, setDeleteToDosRequest] = useState<AsyncRequest>({ status: 'initial' });
  const [editToDoRequest, setEditToDoRequest] = useState<AsyncRequest>({ status: 'initial' });

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

  const editToDo = useCallback(
    async (newData: Omit<Partial<ToDoType>, 'labels'> & { labels?: Array<string> }) => {
      try {
        setEditToDoRequest({ status: 'loading', data: undefined, error: undefined });
        const editedToDo: ToDoType = await (
          await fetch(`/api/todo/${toDo.id}`, {
            method: 'PUT',
            body: JSON.stringify(newData),
          })
        ).json();
        setEditToDoRequest({ status: 'success', data: undefined, error: undefined });
        onEdit(editedToDo);
      } catch (error) {
        setEditToDoRequest({ status: 'error', data: undefined, error: error as Error });
      }
    },
    [toDo, onEdit],
  );

  const toggleToDoDone = useCallback(() => {
    void editToDo({ isCompleted: !toDo.isCompleted });
  }, [toDo, editToDo]);

  const setToDoLabels = useCallback(
    (newLabels: Record<string, boolean>) => {
      void editToDo({
        labels: Object.entries(newLabels)
          .filter((item) => item[1])
          .map((item) => item[0]),
      });
    },
    [editToDo],
  );

  const editDueDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      void editToDo({ dueDate: event.target.valueAsDate });
    },
    [editToDo],
  );

  const selectedLabels = useMemo(() => {
    return Object.fromEntries(
      labels.map((label) => [label.id, toDo.labels.find((item) => item.id === label.id) !== undefined]),
    );
  }, [labels, toDo]);

  return (
    <div style={{ border: '2px solid white', padding: '4px 8px', margin: '8px 0' }}>
      <div>Name: {toDo.name}</div>
      <div>Status: {toDo.isCompleted ? 'Completed' : 'Ungoing'}</div>
      <div>
        Labels:{' '}
        {labels.map((label) => (
          <label key={label.id} style={{ backgroundColor: label.color }}>
            {label.text}{' '}
            <input
              disabled={editToDoRequest.status === 'loading'}
              type='checkbox'
              checked={selectedLabels[label.id]}
              onChange={() => setToDoLabels({ ...selectedLabels, [label.id]: !selectedLabels[label.id] })}
            />
          </label>
        ))}
      </div>
      <label>
        Due Date:{' '}
        <input
          value={toDo.dueDate != null ? dayjs(toDo.dueDate).format('YYYY-MM-DD') : 0}
          disabled={editToDoRequest.status === 'loading'}
          type='date'
          onChange={editDueDate}
        />
        {toDo.dueDate != null ? (
          <>
            , {Math.ceil(dayjs(toDo.dueDate).diff(dayjs(), 'h') / 24)} Days until end,{' '}
            <button onClick={() => editToDo({ dueDate: null })}>Clear</button>{' '}
          </>
        ) : null}
      </label>
      <div>
        Actions:{' '}
        <button disabled={deleteToDosRequest.status === 'loading'} onClick={deleteToDo}>
          Delete
        </button>
        ,{' '}
        <button disabled={editToDoRequest.status === 'loading'} onClick={toggleToDoDone}>
          {toDo.isCompleted ? 'Mark as Ungoing' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
}
