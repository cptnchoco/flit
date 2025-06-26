// pages/index.js

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  const { data: session, status } = useSession()

  // 1. Affichage pendant la récupération de la session
  if (status === 'loading') {
    return (
      <Layout>
        <p>Chargement de votre session…</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <header style={{ marginBottom: '2rem' }}>
        {session ? (
          <>
            <p>
              Bienvenue, <strong>{session.user.name}</strong> !
            </p>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
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
              onClick={() => signIn('discord', { callbackUrl: '/' })}
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

      <h1>FLIT – Gestion d’inventaire Star Citizen</h1>
      <p>
        Gérez votre inventaire et vos logs de vol depuis Discord et une UI web Next.js.
      </p>

      <nav style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
        <Link href="/ajout">
          <a
            style={{
              padding: '1rem',
              background: '#3182ce',
              color: '#fff',
              borderRadius: 4,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            ➕ Ajouter un item
          </a>
        </Link>
        <Link href="/retrait">
          <a
            style={{
              padding: '1rem',
              background: '#dd6b20',
              color: '#fff',
              borderRadius: 4,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            ➖ Retirer un item
          </a>
        </Link>
        <Link href="/transfert">
          <a
            style={{
              padding: '1rem',
              background: '#38a169',
              color: '#fff',
              borderRadius: 4,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            🔄 Transférer un item
          </a>
        </Link>
        <Link href="/logs">
          <a
            style={{
              padding: '1rem',
              background: '#805ad5',
              color: '#fff',
              borderRadius: 4,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            📜 Voir les logs
          </a>
        </Link>
      </nav>
    </Layout>
  )
}
