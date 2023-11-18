import { ToDoType } from '@/types';
import GitHubCalendar from 'react-github-contribution-calendar';
import dayjs from 'dayjs';
import { memo } from 'react';

function StatisticsComponent({ toDos }: { toDos: Array<ToDoType> }) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-blue-400 p-4'>
      <h3 className='text-2xl font-bold'>Statistics: </h3>
      <GitHubCalendar
        monthLabelAttributes={{ style: { fontSize: 10 } }}
        weekLabelAttributes={{ style: { fontSize: 10 } }}
        values={toDos.reduce(
          (currentResult, todo) => {
            if (todo.isCompleted) {
              const completedDate = dayjs(todo.completedAt).format('YYYY-MM-DD');
              currentResult[completedDate] = currentResult[completedDate] || 0;
              currentResult[completedDate] += 1;
              return currentResult;
            }
            return currentResult;
          },
          {} as Record<string, number>,
        )}
        until={'2023-12-30'}
        panelAttributes={{ rx: 6, ry: 6 }}
      />
    </div>
  );
}

export default memo(StatisticsComponent);
