// pages/retrait.js

import { useState } from 'react'
import Layout       from '../components/Layout'
import Form         from '../components/Form'
import { getServerSession } from 'next-auth/next'
import { authOptions }      from './api/auth/[...nextauth]'

// 1) Redirige côté serveur si pas connecté
export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  return { props: {} }
}

export default function Retrait() {
  const [message, setMessage] = useState('')

  // 2) Envoie l’action 'retrait' à ton API
  const handleSubmit = async ({ item, qty }) => {
    setMessage('')
    try {
      const res = await fetch('/api/flit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'retrait', item, qty }),
      })
      const { success, data, error } = await res.json()
      if (!success) throw new Error(error || 'Erreur lors du retrait')
      setMessage(data.message || `✅ Retrait de ${qty} × ${item} effectué !`)
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    }
  }

  return (
    <Layout>
      <h2>Retirer un item de votre inventaire</h2>

      <Form onSubmit={handleSubmit} submitLabel="Retirer" />

      {message && (
        <p
          style={{
            marginTop: '1rem',
            padding: '.6rem 1rem',
            background: message.startsWith('❌') ? '#ffe6e6' : '#fff4e5',
            border: '1px solid',
            borderColor: message.startsWith('❌') ? '#f7b5b5' : '#ffd8a8',
            borderRadius: 4,
            color: message.startsWith('❌') ? '#c62828' : '#9c4221',
          }}
        >
          {message}
        </p>
      )}
    </Layout>
  )
}
