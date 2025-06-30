// pages/index.js
import Link              from 'next/link'
import Layout            from '../components/Layout'
import { signIn, signOut } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions }     from './api/auth/[...nextauth]'

export default function Home({ session }) {
  return (
    <Layout>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        {session ? (
          <>
            <p>
              Bienvenue, <strong>{session.user.name}</strong> !
            </p>
            <button
              onClick={() => signOut()}
              style={{
                padding: '.5rem 1rem',
                background: '#e53e3e',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <p>Vous n’êtes pas connecté.</p>
            <button
              onClick={() => signIn('discord')}
              style={{
                padding: '.5rem 1rem',
                background: '#7289da',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Se connecter avec Discord
            </button>
          </>
        )}
      </header>

      <main style={{ textAlign: 'center' }}>
        <h1>FLIT – Gestion d’inventaire Star Citizen</h1>
        <p>
          Gérez votre inventaire et vos logs de vol depuis Discord et une UI web Next.js.
        </p>

        <nav style={{ marginTop: '2rem', display: 'grid', gap: '1rem', maxWidth: 400, margin: '2rem auto' }}>
          <Link href="/ajout">
            <a
              style={{
                display: 'block',
                padding: '1rem',
                background: '#3182ce',
                color: '#fff',
                borderRadius: 4,
                textDecoration: 'none'
              }}
            >
              ➕ Ajouter un item
            </a>
          </Link>
          <Link href="/retrait">
            <a
              style={{
                display: 'block',
                padding: '1rem',
                background: '#dd6b20',
                color: '#fff',
                borderRadius: 4,
                textDecoration: 'none'
              }}
            >
              ➖ Retirer un item
            </a>
          </Link>
          <Link href="/transfert">
            <a
              style={{
                display: 'block',
                padding: '1rem',
                background: '#38a169',
                color: '#fff',
                borderRadius: 4,
                textDecoration: 'none'
              }}
            >
              🔄 Transférer un item
            </a>
          </Link>
          <Link href="/logs">
            <a
              style={{
                display: 'block',
                padding: '1rem',
                background: '#805ad5',
                color: '#fff',
                borderRadius: 4,
                textDecoration: 'none'
              }}
            >
              📜 Voir les logs
            </a>
          </Link>
        </nav>
      </main>
    </Layout>
  )
}

// SSR Fetch de la session pour qu'elle soit dispo au build
export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  return {
    props: { session }
  }
}
