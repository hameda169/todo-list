export default function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-6 w-6 text-gray-800 dark:text-white ${className}`}
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 20 20'
    >
      <path stroke='currentColor' d='m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
    </svg>
  );
}
