import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/options';
import SignInPage from '@/containers/sign-in';
import MainPage from '@/containers/main';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className='flex max-h-screen min-h-screen w-screen flex-col items-center overflow-hidden'>
      {session == null ? <SignInPage /> : <MainPage session={session} />}
    </main>
  );
}
