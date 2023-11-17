import { useCallback, useState } from 'react';
import { AsyncRequest, ToDoType } from '@/types';

export default function AddToDo({ onDone }: { onDone: (createdToDo: ToDoType) => void }) {
  const [name, setName] = useState('');
  const [addToDoRequest, setAddToDoRequest] = useState<AsyncRequest>({ status: 'initial' });

  const addToDo = useCallback(async () => {
    try {
      setAddToDoRequest({ status: 'loading', data: undefined, error: undefined });
      const createdToDo: ToDoType = await (
        await fetch('/api/todo', { method: 'POST', body: JSON.stringify({ name }) })
      ).json();
      setName('');
      setAddToDoRequest({ status: 'success', data: undefined, error: undefined });
      onDone(createdToDo);
    } catch (error) {
      setAddToDoRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, [name, onDone]);

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button disabled={addToDoRequest.status === 'loading'} onClick={addToDo}>
        Add new ToDo
      </button>
    </div>
  );
}
