// pages/ajout.js

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Form from '../components/Form'

export default function Ajout() {
  const { data: session, status: authStatus } = useSession()
  const [message, setMessage] = useState('')

  // 1. Afficher un loader tant que NextAuth vérifie la session
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
        <p>⚠️ Vous devez être connecté·e pour ajouter un item.</p>
      </Layout>
    )
  }

  // 3. Soumettre l’ajout
  const handleSubmit = async ({ item, qty }) => {
    const payload = {
      action: 'ajout',
      userId: session.user.id,
      item,
      qty
    }

    const res = await fetch('/api/flit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const json = await res.json()

    // Gérer les erreurs
    if (!res.ok || json.success === false) {
      throw new Error(json.error || 'Erreur lors de l’ajout')
    }

    // Afficher un message de succès
    setMessage(json.data.message || 'Item ajouté avec succès !')
  }

  return (
    <Layout>
      <h2>Ajouter un item à votre inventaire</h2>

      <Form
        onSubmit={handleSubmit}
        submitLabel="Ajouter"
      />

      {message && (
        <p
          style={{
            marginTop: '1rem',
            padding: '.6rem 1rem',
            background: '#e6ffed',
            border: '1px solid #a3f7b5',
            borderRadius: 4,
            color: '#2e7d32'
          }}
        >
          ✅ {message}
        </p>
      )}
    </Layout>
  )
}
