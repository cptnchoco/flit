// pages/transfert.js

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

export default function Transfert({ session }) {
  const [message, setMessage] = useState('')

  const transferFields = [
    { label: "Nom de l’item",    name: "item",     type: "text"   },
    { label: "Quantité",         name: "qty",      type: "number" },
    { label: "ID Discord cible", name: "targetId", type: "text"   }
  ]

  // 2) Handler de transfert
  const handleTransfer = async ({ item, qty, targetId }) => {
    setMessage('')
    try {
      const res = await fetch('/api/flit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:   'transfert',
          userId:   session.user.id,
          item,
          qty,
          targetId
        })
      })
      const json = await res.json()
      if (!res.ok || json.success === false) {
        throw new Error(json.error || 'Erreur lors du transfert')
      }
      setMessage(`✅ ${json.data.message}`)
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
        <p style={{
          marginTop: '1rem',
          padding: '.6rem 1rem',
          background: message.startsWith('✅') ? '#e6ffed' : '#ffe6e6',
          border: message.startsWith('✅') ? '1px solid #a3f7b5' : '1px solid #f5c2c7',
          borderRadius: 4,
          color: message.startsWith('✅') ? '#2e7d32' : '#721c24'
        }}>
          {message}
        </p>
      )}
    </Layout>
  )
}
