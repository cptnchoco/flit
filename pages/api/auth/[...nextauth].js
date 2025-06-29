// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import DiscordProvider from 'next-auth/providers/discord'


export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // ============================
      // On force l’URL et le scope
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: { scope: 'identify email' }
      },
      // ============================
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        }
      }
    })
  ],

  // 1) Adapter Supabase avec config – c'est ici qu'on passe URL & Service Key
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),

  // 2) Providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        }
      }
    })
  ],

  // 3) Session en base de données
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },

  // 4) Callbacks
  callbacks: {
    async session({ session, user }) {
      session.user.id    = user.id
      session.user.image = user.image
      return session
    },
    async signIn({ user, account, profile }) {
      return true
    }
  },

  // 5) Pages custom
  pages: {
    signIn: '/auth/signin',
    error:  '/auth/error'
  },

  // 6) Secret & cookies
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}

// 7) Default export
export default NextAuth(authOptions)
