import { ToDoType } from '@/types';
import ToDo from './todo';

export default function ToDoList({
  toDos,
  onDelete,
  onEdit,
}: {
  toDos: ToDoType[];
  onDelete: (deletedToDo: ToDoType) => void;
  onEdit: (markedAsDoneTodo: ToDoType) => void;
}) {
  return (
    <div>
      {toDos.map((item) => (
        <ToDo key={item.id} toDo={item} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
