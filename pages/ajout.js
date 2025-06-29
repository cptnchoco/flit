// pages/ajout.js

import { useState } from 'react'
import Layout from '../components/Layout'
import Form from '../components/Form'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

// 1) Vérification de session en SSR
export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }
  return { props: { session } }
}

export default function Ajout({ session }) {
  const [message, setMessage] = useState('')

  // 2) Soumettre l’ajout via l’API
  const handleSubmit = async ({ item, qty }) => {
    setMessage('') // reset
    try {
      const res = await fetch('/api/flit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ajout',
          userId: session.user.id,
          item,
          qty
        })
      })
      const json = await res.json()
      if (!res.ok || json.success === false) {
        throw new Error(json.error || 'Erreur lors de l’ajout')
      }
      setMessage(json.data.message || 'Item ajouté avec succès !')
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    }
  }

  return (
    <Layout>
      <h2>Ajouter un item à votre inventaire</h2>

      <Form onSubmit={handleSubmit} submitLabel="Ajouter" />

      {message && (
        <p
          style={{
            marginTop: '1rem',
            padding: '.6rem 1rem',
            background: message.startsWith('❌') ? '#ffe6e6' : '#e6ffed',
            border: '1px solid',
            borderColor: message.startsWith('❌') ? '#f7b5b5' : '#a3f7b5',
            borderRadius: 4,
            color: message.startsWith('❌') ? '#c62828' : '#2e7d32'
          }}
        >
          {message}
        </p>
      )}
    </Layout>
  )
}
