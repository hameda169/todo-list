import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignInPage from '@/pages/sign-in';
import MainPage from '@/pages/main';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className='flex max-h-screen min-h-screen w-screen flex-col items-center overflow-hidden'>
      {session == null ? <SignInPage /> : <MainPage session={session} />}
    </main>
  );
}
