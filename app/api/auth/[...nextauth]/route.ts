import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NEXUS_AUTH: Secure vault authentication.
 * Uses a single-admin password strategy with strict environment variable verification.
 */
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Nexus.Command",
      credentials: {
        password: { label: "Vault Password", type: "password" }
      },
      async authorize(credentials) {
        // Strict verification against ADMIN_SECRET_PASS environment variable
        if (credentials?.password === process.env.ADMIN_SECRET_PASS) {
          return { id: "1", name: "ADMIN_NEXUS" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/nexus-command/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
