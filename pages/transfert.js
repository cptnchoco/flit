// pages/transfert.js

import { useState }               from 'react'
import Layout                     from '../components/Layout'
import Form                       from '../components/Form'
import { getServerSession }       from 'next-auth/next'
import { authOptions }            from './api/auth/[...nextauth]'

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
  return { props: {} }
}

export default function Transfert() {
  const [message, setMessage] = useState('')

  // Définition des champs personnalisés pour le Form
  const transferFields = [
    { label: "Nom de l’item",    name: "item",     type: "text"   },
    { label: "Quantité",         name: "qty",      type: "number" },
    { label: "ID Discord cible", name: "targetId", type: "text"   }
  ]

  // 2) Envoi de l’action 'transfert' à l’API
  const handleTransfer = async ({ item, qty, targetId }) => {
    setMessage('')
    try {
      const res = await fetch('/api/flit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'transfert', item, qty, targetId })
      })
      const { success, data, error } = await res.json()
      if (!success) throw new Error(error || 'Erreur lors du transfert')
      setMessage(data.message || 'Transfert effectué !')
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    }
  }

  return (
    <Layout>
      <h2>Transférer un item</h2>

      <Form
        fields={transferFields}
        onSubmit={handleTransfer}
        submitLabel="Transférer"
      />

      {message && (
        <p
          style={{
            marginTop: '1rem',
            padding: '.6rem 1rem',
            background: message.startsWith('❌') ? '#ffe6e6' : '#e6ffed',
            border: message.startsWith('❌') ? '1px solid #f7b5b5' : '1px solid #a3f7b5',
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
