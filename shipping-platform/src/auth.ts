
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "./context";
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    allowDangerousEmailAccountLinking: true
  }),
  FacebookProvider({
    clientId: process.env.AUTH_FACEBOOK_ID!,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    allowDangerousEmailAccountLinking: true
  })
]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 5 * 24 * 60 * 60 // 5 days in seconds
  },
  pages: {
    signIn: "/signin",
    signOut: '/signout'
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the id on the session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async authorized({ auth }) {

      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },


  },
})