// pages/auth/error.js

import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const errorMessages = {
  OAuthSignin:      "Échec de la connexion OAuth.",
  OAuthCallback:    "Échec du callback OAuth.",
  OAuthCreateAccount: "Impossible de créer un compte OAuth.",
  EmailCreateAccount: "Impossible de créer un compte par email.",
  Callback:         "Erreur lors du callback de connexion.",
  OAuthAccountNotLinked: "Ce compte email est déjà utilisé avec un autre fournisseur.",
  EmailSignin:      "Échec de l'envoi de l'email de connexion.",
  CredentialsSignin:"Identifiants invalides.",
  SessionRequired:  "Session requise pour accéder à cette page.",
  Default:          "Une erreur inconnue est survenue."
}

export default function AuthError() {
  const { query } = useRouter()
  const errorType = query.error
  const message = errorMessages[errorType] ?? errorMessages.Default

  return (
    <>
      <Head>
        <title>Erreur de connexion – FLIT</title>
      </Head>
      <div className="container">
        <h1>Oups…</h1>
        <p className="message">{message}</p>
        <Link href="/auth/signin">
          <a className="link">Réessayer de se connecter</a>
        </Link>
      </div>
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 4rem auto;
          padding: 2rem;
          border: 1px solid #f5c6cb;
          background: #f8d7da;
          border-radius: 8px;
          text-align: center;
        }
        h1 {
          margin-bottom: 1rem;
          color: #721c24;
        }
        .message {
          margin-bottom: 2rem;
          color: #721c24;
        }
        .link {
          display: inline-block;
          padding: 0.6rem 1rem;
          background: #721c24;
          color: #fff;
          border-radius: 4px;
          text-decoration: none;
        }
        .link:hover {
          background: #501217;
        }
      `}</style>
    </>
  )
}
