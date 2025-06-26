// components/Layout.js
import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>FLIT – Inventaire Star Citizen</title>
        <meta name="description" content="Gérez votre inventaire via Discord et une UI web Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/"><a>Accueil</a></Link>
          <Link href="/ajout"><a>Ajout</a></Link>
          <Link href="/retrait"><a>Retrait</a></Link>
          <Link href="/transfert"><a>Transfert</a></Link>
          <Link href="/logs"><a>Logs</a></Link>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} FLIT – Tous droits réservés</p>
      </footer>

      <style jsx>{`
        header {
          background: #0d0d0d;
          padding: 1rem 2rem;
        }
        nav {
          display: flex;
          gap: 1.5rem;
        }
        nav a {
          color: #fafafa;
          text-decoration: none;
          font-weight: 500;
        }
        nav a:hover {
          text-decoration: underline;
        }
        main {
          margin: 2rem auto;
          max-width: 800px;
          padding: 0 1rem;
        }
        footer {
          text-align: center;
          margin: 3rem 0 1rem;
          color: #888;
        }
      `}</style>
    </>
  )
}
