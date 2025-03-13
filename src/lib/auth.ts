import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  logger: {
    error: (code, ...message) => {
      console.error(code, ...message)
    },
    warn: (code, ...message) => {
      console.warn(code, ...message)
    },
    debug: (code, ...message) => {
      console.debug(code, ...message)
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
        session.user.roles = token.roles as string[]
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles
      }
      return token
    },
  },
} 