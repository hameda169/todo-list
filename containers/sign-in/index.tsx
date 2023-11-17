'use client';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div>
      You need to sign-in first
      <div>
        <button onClick={() => signIn('github')}>Sing in with github</button>
      </div>
    </div>
  );
}
