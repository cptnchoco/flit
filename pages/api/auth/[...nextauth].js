// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'

export const authOptions = {
  // 1) Les providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: { scope: 'identify email' }
      },
      profile(profile) {
        return {
          id:    profile.id,
          name:  profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        }
      }
    })
  ],

  // 2) Persistance via Supabase
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    schema: 'public'
  }),
  

  // 3) Stockage de la session en base
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,   // 30 jours
    updateAge: 24 * 60 * 60       // 24 heures
  },

  // 4) Pages custom
  pages: {
    signIn: '/auth/signin',
    error:  '/auth/error'
  },

  // 5) Callbacks
  callbacks: {
    async session({ session, user }) {
      // injecte l’ID et l’image dans la session côté client
      session.user.id    = user.id
      session.user.image = user.image
      return session
    }
  },

  // 6) Secret pour chiffrer les tokens
  secret: process.env.NEXTAUTH_SECRET,

  // 7) Debug (désactive en prod si tu veux)
  debug: process.env.NODE_ENV !== 'production',
  debug: true,
}

export default NextAuth(authOptions)
