'use client';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className='m-12 mt-48 flex flex-col gap-4 rounded-3xl bg-blue-400 p-10'>
      <div>You need to sign-in first</div>
      <button className='rounded-3xl bg-amber-50 p-4 text-blue-800' onClick={() => signIn('github')}>
        Sing in with github
      </button>
    </div>
  );
}
