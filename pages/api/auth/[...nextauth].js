// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'

// Initialise le client Supabase avec ta Service Role Key
// (stockée en secret, ne jamais la versionner)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default NextAuth({
  // 1. Adapter Supabase => tables `users`, `accounts`, `sessions`, `verification_tokens`
  adapter: SupabaseAdapter(supabase),

  // 2. Providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        // Normalise le profil Discord
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email, // à demander via scope si besoin
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        }
      }
    })
  ],

  // 3. Stockage des sessions
  session: {
    strategy: 'database',       // sessions en base (pas JWT)
    maxAge: 30 * 24 * 60 * 60,  // 30 jours
    updateAge: 24 * 60 * 60     // rafraîchissement quotidien
  },

  // 4. Callbacks pour enrichir `session` et sécuriser le flow
  callbacks: {
    // Expose user.id et user.image dans session.user
    async session({ session, user }) {
      session.user.id    = user.id
      session.user.image = user.image
      return session
    },
    // Optionnel : contrôler l’accès au signIn
    async signIn({ user, account, profile }) {
      // Exemple : n’accepter que les membres d’un serveur Discord
      // if (!profile.guilds?.some(g => g.id === YOUR_GUILD_ID)) return false
      return true
    }
  },

  // 5. Pages personnalisées
  pages: {
    signIn:  '/auth/signin',  // crée cette page pour un UI custom
    error:   '/auth/error'    // page d’erreur OAuth
  },

  // 6. Sécurité & secrets
  secret: process.env.NEXTAUTH_SECRET,       // chaîne aléatoire longue
  // NEXTAUTH_URL doit être défini en prod (ex. https://mon-domaine.com)

  // 7. (Optionnel) Cookies
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
})
