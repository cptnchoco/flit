// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. React strict mode
  reactStrictMode: true,

  // 2. Remove obsolete SWC minify flag (enabled by default in Next.js 15+)
  // swcMinify: true,

  // 3. Masquer l’entête X-Powered-By (sécurité)
  poweredByHeader: false,

  // 4. Domaines autorisés pour <Image> et chargement externe
  images: {
    domains: [
      'cdn.discordapp.com',
      // supabase URL sans protocole
      process.env.SUPABASE_URL?.replace(/^https?:\/\//, '') || ''
    ]
  },

  // 5. Variables d’environnement accessibles au build
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  },

  // 6. i18n (FR par défaut)
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr'
  },

  // 7. En-têtes HTTP globaux pour renforcer la sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'geolocation=(), microphone=(), camera=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https://cdn.discordapp.com https://ton-projet.supabase.co",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://ton-projet.supabase.co https://discord.com",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
