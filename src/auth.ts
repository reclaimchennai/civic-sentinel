import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Reddit from "next-auth/providers/reddit"
import Twitter from "next-auth/providers/twitter"
import Apple from "next-auth/providers/apple"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

// All OAuth providers use auto-inferred env vars:
//   AUTH_{PROVIDER}_ID and AUTH_{PROVIDER}_SECRET
// See .env.example and docs/AUTH_SETUP.md for setup instructions.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Reddit({
      // Reddit requires explicit authorization params for token duration
      authorization: {
        params: {
          duration: "permanent",
        },
      },
    }),
    Twitter,
    Apple,
    Facebook,
    Credentials({
      name: "Demo User",
      credentials: {
        username: { label: "Username", type: "text" }
      },
      async authorize() {
        return {
          id: "demo-user-001",
          name: "CivicHero_Demo",
          email: "demo@chennaicivic.com",
          image: "https://placehold.co/400x400/png?text=Demo",
          role: "admin",
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
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
      }
      return token;
    }
  }
})
