
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./context";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
   // Add this line
  providers: [Google],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        console.log("session", session)
      
        session.user.id = token.sub;
      }
      return session;
    },
    
  },
})