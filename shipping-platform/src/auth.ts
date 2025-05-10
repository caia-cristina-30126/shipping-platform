
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "./context";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt',
    maxAge: 5 * 24 * 60 * 60 // 5 days in seconds
  },
  providers: [GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET
  }),
  FacebookProvider({
    clientId: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET
  })],
  callbacks: {
    authorized: async ({ auth }) => {
      console.log("auth in callbacks", auth)
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})