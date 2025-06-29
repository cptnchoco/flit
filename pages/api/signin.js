// pages/auth/signin.js

import { getProviders, signIn } from 'next-auth/react'
import Head from 'next/head'

export default function SignIn({ providers }) {
  return (
    <>
      <Head>
        <title>Connexion – FLIT</title>
      </Head>
      <div className="container">
        <h1>Se connecter à FLIT</h1>
        <p>Choisissez un fournisseur pour vous identifier :</p>
        <div className="buttons">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Se connecter avec {provider.name}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 4rem auto;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-align: center;
        }
        h1 {
          margin-bottom: 1rem;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }
        button {
          padding: 0.6rem 1rem;
          background: #7289da;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover {
          background: #5b6eae;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers: providers ?? {} }
  }
}
