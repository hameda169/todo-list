'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import ToDoList from './components/todo-list';
import { AsyncRequest, ToDoType } from '@/types';
import AddToDo from '@/containers/main/components/add-todo';
import { LabelProvider } from './contexts/label';

export default function MainPage({ session }: { session: Session }) {
  const userName = session.user.name;
  const userId = session.user.id;
  const [toDosRequest, setToDosRequest] = useState<AsyncRequest<Array<ToDoType>>>({ status: 'initial' });

  const loadToDos = useCallback(async () => {
    try {
      setToDosRequest({ status: 'loading', data: undefined, error: undefined });
      const toDos: Array<ToDoType> = await (await fetch('/api/todo')).json();
      setToDosRequest({ status: 'success', data: toDos, error: undefined });
    } catch (error) {
      setToDosRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, []);

  useEffect(() => {
    void loadToDos();
  }, [loadToDos]);

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
    <LabelProvider>
      <div>
        Hello {userName || `NoName (${userId})`}.
        <div>
          <button onClick={() => signOut()}>Click here to sign out</button>
        </div>
        <div>
          {toDosRequest.status === 'loading' ? 'Loading todo items ...' : null}
          {toDosRequest.status === 'success' ? (
            <>
              <ToDoList toDos={toDosRequest.data} onDelete={deleteToDo} onEdit={editToDo} />
              <AddToDo onDone={addNewToDo} />
            </>
          ) : null}
          {toDosRequest.status === 'error' ? (
            <div>
              Error while loading ToDos: {toDosRequest.error.message}
              <div>
                <button onClick={loadToDos}>Try again</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LabelProvider>
  );
}
