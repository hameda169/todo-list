import { AsyncRequest, ToDoType, EditingToDoType } from '@/types';
import { memo, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { toDoUpdateSchema } from '@/validations';
import EditIcon from '@/components/icons/edit';
import DeleteIcon from '@/components/icons/delete';
import ToDoForm from '../components/todo-form';

function getDaysPluralType(count: number) {
  if (count > 1) return 'days';
  return 'day';
}
function generateDueDateMessage({
  isCompleted,
  dueDate,
  remainingDays,
  completedDayDiff,
}: {
  isCompleted: boolean;
  dueDate?: Date | null;
  remainingDays: number;
  completedDayDiff: number;
}) {
  const completionMessage =
    isCompleted && dueDate
      ? `Completed ${Math.abs(completedDayDiff)} ${getDaysPluralType(completedDayDiff)} ${
          completedDayDiff > 0 ? 'earlier' : 'later'
        }`
      : undefined;
  const remainingMessage = dueDate
    ? remainingDays < 0
      ? 'Expired'
      : `${remainingDays} ${getDaysPluralType(remainingDays)} remaining`
    : undefined;
  const formattedDueDate = dueDate ? dayjs(dueDate).format('YYYY/MM/DD') : 'Infinite';
  return `${formattedDueDate}${
    completionMessage || remainingMessage ? ` (${completionMessage || remainingMessage})` : ''
  }`;
}

function ToDoComponent({
  toDo,
  onDelete,
  onEdit,
}: {
  toDo: ToDoType;
  onDelete: (deletedToDo: ToDoType) => void;
  onEdit: (editedToDo: ToDoType) => void;
}) {
  const [isEditingToDo, setIsEditingToDo] = useState(false);
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
    async (newData: EditingToDoType) => {
      try {
        setEditToDoRequest({ status: 'loading', data: undefined, error: undefined });
        const editedToDo: ToDoType = await (
          await fetch(`/api/todo/${toDo.id}`, {
            method: 'PUT',
            body: JSON.stringify(toDoUpdateSchema.parse(newData)),
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

  const handleToDoFormDone = useCallback(
    async (newData: EditingToDoType) => {
      await editToDo(newData);
      setIsEditingToDo(false);
    },
    [editToDo],
  );

  const handleToDoFormCancel = useCallback(() => {
    setIsEditingToDo(false);
  }, []);

  const remainingDays = Math.ceil(dayjs(toDo.dueDate).diff(dayjs(), 'h') / 24);
  const completedDayDiff = Math.ceil(dayjs(toDo.dueDate).diff(dayjs(toDo.completedAt), 'h') / 24);

  return (
    <tr>
      <td className='flex h-full items-center justify-center pr-2'>
        <input
          className='h-4 w-4'
          type='checkbox'
          checked={toDo.isCompleted}
          onChange={() => toggleToDoDone()}
          disabled={editToDoRequest.status === 'loading'}
        />
      </td>
      <td>{toDo.name}</td>
      <td>
        <div className='flex flex-row'>
          {toDo.labels.map((label) => (
            <span className='mr-1 block h-4 w-4 rounded-full' key={label.id} style={{ backgroundColor: label.color }} />
          ))}
        </div>
      </td>
      <td>{dayjs(toDo.createdAt).format('YYYY/MM/DD')}</td>
      <td className={`${remainingDays < 0 ? 'text-red-500' : 'text-green-700'}`}>
        {generateDueDateMessage({
          isCompleted: toDo.isCompleted,
          dueDate: toDo.dueDate,
          remainingDays: remainingDays,
          completedDayDiff: completedDayDiff,
        })}
      </td>
      <td className='text-right'>
        <button onClick={() => setIsEditingToDo(true)} disabled={editToDoRequest.status === 'loading'} className='m-1'>
          <EditIcon className='fill-gray-500' />
        </button>
        <button disabled={deleteToDosRequest.status === 'loading'} onClick={deleteToDo}>
          <DeleteIcon className='fill-gray-500' />
        </button>
      </td>
      {isEditingToDo ? (
        // TODO: should be rendered outside of the `tr`, `tbody`, and `table`
        <ToDoForm
          request={editToDoRequest}
          onDone={handleToDoFormDone}
          onCancel={handleToDoFormCancel}
          updatingToDo={toDo}
        />
      ) : null}
    </tr>
  );
}

export default memo(ToDoComponent);
