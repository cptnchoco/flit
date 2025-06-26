// pages/retrait.js

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Form from '../components/Form'

export default function Retrait() {
  const { data: session, status: authStatus } = useSession()
  const [message, setMessage] = useState('')

  // 1. Affichage pendant vérification de la session
  if (authStatus === 'loading') {
    return (
      <Layout>
        <p>Chargement…</p>
      </Layout>
    )
  }

  // 2. Forcer la connexion
  if (!session) {
    return (
      <Layout>
        <p>⚠️ Vous devez être connecté·e pour retirer un item.</p>
      </Layout>
    )
  }

  // 3. Handler de retrait
  const handleSubmit = async ({ item, qty }) => {
    setMessage('') // reset précédent
    const payload = {
      action: 'retrait',
      userId: session.user.id,
      item,
      qty
    }

    const res  = await fetch('/api/flit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const json = await res.json()

    if (!res.ok || json.success === false) {
      throw new Error(json.error || 'Erreur lors du retrait')
    }
    setMessage(`Retrait de ${qty} × ${item} effectué !`)
  }

  return (
    <Layout>
      <h2>Retirer un item de votre inventaire</h2>

      <Form
        onSubmit={handleSubmit}
        submitLabel="Retirer"
      />

      {message && (
        <p
          style={{
            marginTop: '1rem',
            padding: '.6rem 1rem',
            background: '#fff4e5',
            border: '1px solid #ffd8a8',
            borderRadius: 4,
            color: '#9c4221'
          }}
        >
          ⚠️ {message}
        </p>
      )}
    </Layout>
  )
}
