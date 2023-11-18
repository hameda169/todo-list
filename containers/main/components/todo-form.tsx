import { useLabels } from '../contexts/label';
import { AsyncRequest, EditingToDoType, ToDoType } from '@/types';
import { FormEvent, memo, useCallback, useState } from 'react';
import dayjs from 'dayjs';

function ToDoFormComponent({
  updatingToDo,
  onDone,
  onCancel,
  request,
}: {
  updatingToDo?: ToDoType;
  onDone: (todo: EditingToDoType) => void;
  onCancel: () => void;
  request: AsyncRequest;
}) {
  const labels = useLabels();

  const [todo, setToDo] = useState<Omit<Partial<ToDoType>, 'labels'> & { labels: Record<string, boolean> }>(
    updatingToDo
      ? {
          ...updatingToDo,
          labels: Object.fromEntries(
            labels.map((label) => [label.id, updatingToDo.labels.find((item) => item.id === label.id) !== undefined]),
          ),
        }
      : {
          name: '',
          labels: Object.fromEntries(labels.map((label) => [label.id, false])),
          dueDate: null,
        },
  );

  const handleDone = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onDone({
        ...todo,
        labels: Object.entries(todo.labels)
          .filter(([_, isLabelSet]) => isLabelSet)
          .map(([labelId]) => labelId),
      });
    },
    [todo, onDone],
  );

  const isLoading = request.status === 'loading';
  const isDisabled = isLoading || !todo.name;

  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 flex flex-col bg-black/60 px-80 py-48 text-gray-900'>
      <div className='relative flex w-full flex-col rounded-2xl bg-gray-100 p-4 opacity-100 shadow-md'>
        <h1 className='text-3xl'>{updatingToDo ? `Update ${updatingToDo.id}` : 'Create new'}</h1>
        <form className='my-4' onSubmit={handleDone}>
          <div className='mb-4'>
            <label className='mb-2 block text-sm font-bold' htmlFor='name'>
              Name
            </label>
            <input
              value={todo.name}
              className='focus:shadow-outline mb-2 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow '
              id='name'
              type='text'
              placeholder='ToDo Name'
              onChange={(event) => setToDo((prev) => ({ ...prev, name: event.target.value }))}
            />
            {todo.name ? null : <p className='text-xs italic text-red-500'>Name could not be empty.</p>}
          </div>
          <div className='mb-6'>
            <label className='mb-2 block text-sm font-bold' htmlFor='due-date'>
              Due Date
            </label>
            <input
              className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow'
              id='due-date'
              type='date'
              placeholder='YYYY-MM-DD'
              value={todo.dueDate ? dayjs(todo.dueDate).format('YYYY-MM-DD') : ''}
              onChange={(event) => {
                setToDo((prev) => ({ ...prev, dueDate: event.target.valueAsDate }));
              }}
            />
          </div>
          <div className='mb-6'>
            <label className='mb-2 block text-sm font-bold'>Labels</label>
            {labels.map((label) => (
              <label className='mr-2 rounded-lg p-2 text-white' key={label.id} style={{ backgroundColor: label.color }}>
                {label.text}{' '}
                <input
                  type='checkbox'
                  checked={todo.labels[label.id]}
                  onChange={() =>
                    setToDo((prev) => ({ ...prev, labels: { ...prev.labels, [label.id]: !prev.labels[label.id] } }))
                  }
                />
              </label>
            ))}
          </div>
          <div className='flex items-center justify-between'>
            <button
              disabled={isDisabled}
              className={`focus:shadow-outline rounded  px-4 py-2 font-bold text-white ${
                isDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
              }`}
              type='submit'
            >
              {isLoading ? 'Loading...' : updatingToDo ? 'Update' : 'Create'}
            </button>
            <button
              className={`focus:shadow-outline rounded px-4 py-2 font-bold text-white ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
              }`}
              type='button'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(ToDoFormComponent);
