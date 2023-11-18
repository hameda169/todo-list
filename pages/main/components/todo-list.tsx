import { ToDoType } from '@/types';
import ToDo from './todo';
import { memo } from 'react';

function ToDoListComponent({
  toDos,
  onDelete,
  onEdit,
}: {
  toDos: Array<ToDoType>;
  onDelete: (deletedToDo: ToDoType) => void;
  onEdit: (markedAsDoneTodo: ToDoType) => void;
}) {
  return toDos.length > 0 ? (
    <table className='h-full w-full text-left'>
      <thead>
        <tr className='h-16'>
          <th className='pr-2' />
          <th className='w-1/6 p-0'>Name</th>
          <th className='w-1/6 p-0'>Labels</th>
          <th className='w-1/6 p-0'>Created Date</th>
          <th className='w-2/6 p-0'>Due Date</th>
          <th className='text-right'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {toDos.map((item) => (
          <ToDo key={item.id} toDo={item} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
  ) : (
    <div className='flex w-full flex-1 flex-col items-center justify-center text-center'>
      <p>There is no ToDo with the selected filters</p>
      <p>Please try to create new one with &quot;Create new&quot; button</p>
    </div>
  );
}

export default memo(ToDoListComponent);
