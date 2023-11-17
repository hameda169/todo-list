'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import ToDoList from './components/todo-list';
import { AsyncRequest, ToDoType } from '@/types';
import AddToDo from '@/containers/main/components/add-todo';

export default function MainPage({ session }: { session: Session }) {
  const userName = session.user.name!;
  const userId = session.user.id;
  const [toDosRequest, setToDosRequest] = useState<AsyncRequest<Array<ToDoType>>>({ status: 'initial' });

  useEffect(() => {
    async function callback() {
      try {
        setToDosRequest({ status: 'loading', data: undefined, error: undefined });
        const toDos: Array<ToDoType> = await (await fetch('/api/todo')).json();
        setToDosRequest({ status: 'success', data: toDos, error: undefined });
      } catch (error) {
        setToDosRequest({ status: 'error', data: undefined, error: error as Error });
      }
    }
    void callback();
  }, []);

  const addNewToDo = useCallback((createdToDo: ToDoType) => {
    setToDosRequest((prev) =>
      prev.status === 'success'
        ? { ...prev, data: [...prev.data, createdToDo] }
        : { status: 'success', data: [createdToDo], error: undefined },
    );
  }, []);

  const deleteToDo = useCallback(async (deletedToDo: ToDoType) => {
    setToDosRequest((prev) =>
      prev.status === 'success' ? { ...prev, data: prev.data.filter((item) => item.id !== deletedToDo.id) } : prev,
    );
  }, []);

  const editToDo = useCallback(async (editedToDo: ToDoType) => {
    setToDosRequest((prev) =>
      prev.status === 'success'
        ? { ...prev, data: prev.data.map((item) => (item.id === editedToDo.id ? editedToDo : item)) }
        : prev,
    );
  }, []);

  return (
    <div>
      Hello {`${userName || `NoName (${userId})`}`}.
      <div>
        <button onClick={() => signOut()}>Click here to sign out</button>
      </div>
      <div>
        {toDosRequest.status === 'loading' ? 'Loading todo items ...' : null}
        {toDosRequest.status === 'success' ? (
          <ToDoList toDos={toDosRequest.data} onDelete={deleteToDo} onEdit={editToDo} />
        ) : null}
        {toDosRequest.status === 'error' ? `Error: ${toDosRequest.error.message}` : null}
      </div>
      <AddToDo onDone={addNewToDo} />
    </div>
  );
}
