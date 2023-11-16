'use client';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

function Status() {
  const { data: session, status } = useSession();

  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'unauthenticated':
      return <button onClick={() => signIn('github')}>Sing in with github</button>;
    case 'authenticated':
      return (
        <div>
          Hello {`${session.user.id}:${session.user.name || 'STRANGER'}`}.{' '}
          <button onClick={() => signOut()}>Click here to sign out</button>
        </div>
      );
  }
}

export default function AuthenticationWrapper() {
  return (
    <SessionProvider>
      <div>
        <Status />
      </div>
    </SessionProvider>
  );
}
