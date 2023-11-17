import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prismaClient } from '@/app/api/utils';

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      httpOptions: { timeout: 20000 },
    }),
  ],
  adapter: PrismaAdapter(prismaClient),
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      return { ...session, user };
    },
  },
};

const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST };
