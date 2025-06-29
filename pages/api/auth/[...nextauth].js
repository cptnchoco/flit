// pages/api/auth/[...nextauth].js
console.log('➤ SUPABASE_URL =', process.env.SUPABASE_URL)

import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'

// 1) Initialise le client Supabase avec ta Service Role Key (côté serveur)
const supabaseServerClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )  
  
// 2) Export nommé pour pouvoir le réutiliser ailleurs (API routes, getServerSideProps…)
export const authOptions = {
  adapter: SupabaseAdapter(supabaseServerClient),

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

  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },

  callbacks: {
    async session({ session, user }) {
      session.user.id    = user.id
      session.user.image = user.image
      return session
    },
    async signIn({ user, account, profile }) {
      // Exemple : n’accepter que les membres d’un serveur Discord
      // if (!profile.guilds?.some(g => g.id === YOUR_GUILD_ID)) return false
      return true
    }
  },

  pages: {
    signIn:  '/auth/signin',
    error:   '/auth/error'
  },

  // 3) Secrets & sécurité
  secret: process.env.NEXTAUTH_SECRET,
  // NEXTAUTH_URL doit être défini en prod : ex. https://ton-domaine.com

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

// 4) Default export pour NextAuth
export default NextAuth(authOptions)
