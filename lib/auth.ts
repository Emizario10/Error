import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.password) return null;

        const secret = process.env.ADMIN_SECRET_KEY;
        const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
        if (!secret) {
          console.error('ADMIN_SECRET_KEY is not set');
          return null;
        }

        if (credentials.password === secret) {
          return { id: 'admin', name: 'Administrator', email: adminEmail } as any;
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as any;
      return token;
    },
    async session({ session, token }) {
      if (token && (token as any).user) session.user = (token as any).user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
