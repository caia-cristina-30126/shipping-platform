
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
      return { id: providerData.id, name: providerData.name}
    } else {
      return { id: provider.id, name: provider.name}
    }
  })

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt',
    maxAge: 5 * 24 * 60 * 60 // 5 days in seconds
  },
  pages: {
    signIn: "/signin",
    signOut:'/signout'
  },
  providers,
  callbacks: {
    authorized: async ({ auth }) => {
      console.log("auth in callbacks", auth)
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})