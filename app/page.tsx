import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignInPage from '@/containers/sign-in';
import MainPage from '@/containers/main';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {session == null ? <SignInPage /> : <MainPage session={session} />}
    </main>
  );
}
