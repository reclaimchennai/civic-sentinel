import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Reddit from "next-auth/providers/reddit"
import Twitter from "next-auth/providers/twitter"
import Apple from "next-auth/providers/apple"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Reddit,
    Twitter,
    Apple,
    Facebook,
    Credentials({
      name: "Demo User",
      credentials: {
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        // Always return the Demo User for this specific provider
        return {
          id: "demo-user-001",
          name: "CivicHero_Demo",
          email: "demo@chennaicivic.com",
          image: "https://placehold.co/400x400/png?text=Demo",
        }
      }
    })
  ],
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
})
