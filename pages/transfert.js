// pages/transfert.js
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Form from '../components/Form'

export default function Transfert() {
  const { data: session } = useSession()
  const [status, setStatus] = useState(null)

  // Définis les champs du formulaire
  const transferFields = [
    { label: "Nom de l’item",      name: "item",     type: "text"   },
    { label: "Quantité",           name: "qty",      type: "number" },
    { label: "ID Discord cible",   name: "targetId", type: "text"   }
  ]

  // Fonction appelée au submit
  const handleTransfer = async (values) => {
    if (!session?.user?.id) {
      setStatus("Erreur : non connecté")
      return
    }
    const payload = {
      action:   "transfert",
      userId:   session.user.id,
      ...values
    }
    try {
      const res = await fetch('/api/flit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (res.ok) setStatus(json.message)
      else       setStatus(json.error || "Erreur serveur")
    } catch (err) {
      setStatus(err.message)
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
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </Layout>
  )
}

