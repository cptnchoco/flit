// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'

export const authOptions = {
  // 1. Provider Discord
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

  // 2. Adapter Supabase avec schéma et noms de tables explicites
  adapter: SupabaseAdapter({
    url:    process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    schema: 'public',
    tableNames: {
      users: 'nextauth_users',
      accounts: 'nextauth_accounts',
      sessions: 'nextauth_sessions',
      verificationTokens: 'nextauth_verification_tokens'
    }
  }),

  // 3. Sessions stockées en base
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,   // 30 jours
    updateAge: 24 * 60 * 60      // 24h
  },

  // 4. Pages personnalisées
  pages: {
    signIn: '/auth/signin',
    error:  '/auth/error'
  },

  // 5. Callbacks
  callbacks: {
    async session({ session, user }) {
      session.user.id    = user.id
      session.user.image = user.image
      return session
    }
  },

  // 6. Secret pour sécuriser les tokens
  secret: process.env.NEXTAUTH_SECRET,

  // 7. Debug pour voir les erreurs dans les logs Vercel
  debug: true
}

export default NextAuth(authOptions)
