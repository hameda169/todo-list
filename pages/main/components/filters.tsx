import { memo } from 'react';
import { useLabels } from '@/pages/main/contexts/label';
import { FilterType } from '@/types';

function FiltersComponent({ value, onChange }: { value: FilterType; onChange: (newValue: FilterType) => void }) {
  const labels = useLabels();

  return (
    <div className='flex flex-1 flex-col gap-4 rounded-3xl bg-blue-400 p-4'>
      <h2 className='text-2xl font-bold'>Filters</h2>
      <div className='flex flex-row gap-2'>
        <h3 className='text-xl'>Status: </h3>
        <label className='flex flex-row items-center gap-1'>
          All
          <input
            name='status'
            type='radio'
            checked={value.statue === 'all'}
            onChange={() => onChange({ ...value, statue: 'all' })}
          />
        </label>
        <label className='flex flex-row items-center gap-1'>
          Completed
          <input
            name='status'
            type='radio'
            checked={value.statue === 'completed'}
            onChange={() => onChange({ ...value, statue: 'completed' })}
          />
        </label>
        <label className='flex flex-row items-center gap-1'>
          Ongoing
          <input
            name='status'
            type='radio'
            checked={value.statue === 'ongoing'}
            onChange={() => onChange({ ...value, statue: 'ongoing' })}
          />
        </label>
      </div>
      <div className='flex flex-row items-center gap-2'>
        <h3 className='text-xl'>Labels: </h3>
        {labels.map((label) => (
          <label className='rounded-lg p-2' key={label.id} style={{ backgroundColor: label.color }}>
            {label.text}{' '}
            <input
              type='checkbox'
              checked={value.labels.includes(label.id)}
              onChange={() =>
                onChange({
                  ...value,
                  labels: value.labels.includes(label.id)
                    ? value.labels.filter((item) => item !== label.id)
                    : [...value.labels, label.id],
                })
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default memo(FiltersComponent);
