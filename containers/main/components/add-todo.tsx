import { useCallback, useState } from 'react';
import { AsyncRequest, ToDoType } from '@/types';
import { useLabels } from '@/containers/main/contexts/label';
import { toDoCreateSchema } from '@/validations';

export default function AddToDo({ onDone }: { onDone: (createdToDo: ToDoType) => void }) {
  const labels = useLabels();
  const [name, setName] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<Record<string, boolean>>(
    Object.fromEntries(labels.map((label) => [label.id, false])),
  );
  const [addToDoRequest, setAddToDoRequest] = useState<AsyncRequest>({ status: 'initial' });

  const addToDo = useCallback(async () => {
    try {
      setAddToDoRequest({ status: 'loading', data: undefined, error: undefined });
      const createdToDo: ToDoType = await (
        await fetch('/api/todo', {
          method: 'POST',
          body: JSON.stringify(
            toDoCreateSchema.parse({
              name,
              labels: Object.entries(selectedLabels)
                .filter((item) => item[1])
                .map((item) => item[0]),
            }),
          ),
        })
      ).json();
      setName('');
      setSelectedLabels(Object.fromEntries(labels.map((label) => [label.id, false])));
      setAddToDoRequest({ status: 'success', data: undefined, error: undefined });
      onDone(createdToDo);
    } catch (error) {
      setAddToDoRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, [name, selectedLabels, labels, onDone]);

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      {labels.map((label) => (
        <label key={label.id} style={{ backgroundColor: label.color }}>
          {label.text}{' '}
          <input
            type='checkbox'
            checked={selectedLabels[label.id]}
            onChange={() => setSelectedLabels((prev) => ({ ...prev, [label.id]: !prev[label.id] }))}
          />
        </label>
      ))}
      <button disabled={addToDoRequest.status === 'loading'} onClick={addToDo}>
        Add new ToDo
      </button>
    </div>
  );
}
