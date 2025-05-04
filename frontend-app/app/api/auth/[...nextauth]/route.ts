import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Include user ID in session
      if (session.user) {
        session.user.id = user.id;

        // Get user profile including role
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        // If no profile, create one
        if (!profile) {
          await prisma.profile.create({
            data: { userId: user.id },
          });
        } else {
          // Add role to session
          session.user.role = profile.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    signOut: "/",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
