// pages/ajout.js

import { useState }             from 'react'
import Layout                   from '../components/Layout'
import Form                     from '../components/Form'
import { getServerSession }     from 'next-auth/next'
import { authOptions }          from './api/auth/[...nextauth]'

// 1) Vérifier la session en SSR et rediriger si non connecté
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
  return { props: {} }
}

export default function Ajout() {
  const [message, setMessage] = useState('')

  // 2) Envoi l'action "ajout" à ton API
  const handleSubmit = async ({ item, qty }) => {
    setMessage('')
    try {
      const res = await fetch('/api/flit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'ajout', item, qty })
      })
      const { success, data, error } = await res.json()
      if (!success) throw new Error(error || 'Erreur lors de l’ajout')
      setMessage(data.message || 'Item ajouté avec succès !')
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
