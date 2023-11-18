import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { memo, useState } from 'react';
import Image from 'next/image';

function HeaderComponent({ session }: { session: Session }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const userName = session.user.name;
  const userId = session.user.id;

  return (
    <div className='flex w-screen flex-row items-center justify-between bg-orange-400 px-1 py-3'>
      <div>Pragmateam</div>
      <button onClick={() => setIsPopupOpen((prev) => !prev)}>
        {session.user.image ? (
          <Image width={48} height={48} alt='profile' className='h-12 w-12 rounded-full' src={session.user.image} />
        ) : null}
      </button>
      {isPopupOpen ? (
        <div className='absolute right-8 top-10 flex flex-col rounded-2xl bg-blue-200 p-2 text-gray-900'>
          <h1>Hello {userName || `NoName (${userId})`}</h1>
          <hr />
          <button onClick={() => signOut()} className='rounded-lg bg-blue-500 p-1 text-white'>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(HeaderComponent);
