'use client';
import { Session } from 'next-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ToDoList from './components/todo-list';
import { AsyncRequest, EditingToDoType, FilterType, ToDoType } from '@/types';
import { LabelProvider } from './contexts/label';
import ToDoForm from './components/todo-form';
import { toDoCreateSchema } from '@/validations';
import Header from '@/pages/main/components/header';
import Filters from '@/pages/main/components/filters';
import GitHubCalendar from 'react-github-contribution-calendar';
import dayjs from 'dayjs';
import Statistics from '@/pages/main/components/statistics';

export default function MainPage({ session }: { session: Session }) {
  const [toDosRequest, setToDosRequest] = useState<AsyncRequest<Array<ToDoType>>>({ status: 'initial' });
  const [addToDoRequest, setAddToDoRequest] = useState<AsyncRequest>({ status: 'initial' });
  const [isCreatingToDo, setIsCreatingToDo] = useState(false);
  const [filter, setFilter] = useState<FilterType>({ statue: 'all', labels: [] });
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

  const handleToDoFormDone = useCallback(async (newData: EditingToDoType) => {
    try {
      setAddToDoRequest({ status: 'loading', data: undefined, error: undefined });
      const createdToDo: ToDoType = await (
        await fetch('/api/todo', {
          method: 'POST',
          body: JSON.stringify(toDoCreateSchema.parse(newData)),
        })
      ).json();
      setAddToDoRequest({ status: 'success', data: undefined, error: undefined });
      setToDosRequest((prev) =>
        prev.status === 'success'
          ? { ...prev, data: [...prev.data, createdToDo] }
          : { status: 'success', data: [createdToDo], error: undefined },
      );
    } catch (error) {
      setAddToDoRequest({ status: 'error', data: undefined, error: error as Error });
    } finally {
      setIsCreatingToDo(false);
    }
  }, []);

  const handleToDoFormCancel = useCallback(() => setIsCreatingToDo(false), []);

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

  const filteredToDos = useMemo(() => {
    if (toDosRequest.status !== 'success') {
      return [];
    }
    return toDosRequest.data.filter(
      (toDo) =>
        (filter.statue === 'all' || (toDo.isCompleted ? filter.statue === 'completed' : filter.statue === 'ongoing')) &&
        (filter.labels.length === 0 ||
          filter.labels.some((item) => toDo.labels.find((label) => label.id === item) !== undefined)),
    );
  }, [filter, toDosRequest]);

  return (
    <>
      <Header session={session} />
      <LabelProvider>
        <div className='flex w-full flex-1 flex-col justify-center overflow-hidden  p-16 xl:px-32 2xl:px-64'>
          <div className='mb-4 flex w-full flex-row gap-4'>
            <Filters value={filter} onChange={setFilter} />
            <Statistics toDos={filteredToDos} />
          </div>
          <div className='flex w-full flex-1 flex-col overflow-hidden rounded-3xl border-2 border-blue-300 bg-violet-50 p-4 text-gray-900 shadow-2xl'>
            {toDosRequest.status === 'loading' ? 'Loading todo items ...' : null}
            {toDosRequest.status === 'success' ? (
              <>
                <div className='p-b mb-8 flex flex-row items-center justify-between'>
                  <p className='text-2xl font-bold'>ToDo List</p>
                  <button
                    className='rounded-lg bg-violet-600 px-6 py-2 text-white'
                    onClick={() => setIsCreatingToDo(true)}
                  >
                    Create new
                  </button>
                </div>
                <div className='flex h-full flex-1 overflow-auto'>
                  <ToDoList toDos={filteredToDos} onDelete={deleteToDo} onEdit={editToDo} />
                </div>
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
        {isCreatingToDo ? (
          <ToDoForm request={addToDoRequest} onDone={handleToDoFormDone} onCancel={handleToDoFormCancel} />
        ) : null}
      </LabelProvider>
    </>
  );
}
