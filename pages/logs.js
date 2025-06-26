// pages/logs.js

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Table from '../components/Table'

export default function Logs() {
  const { data: session, status } = useSession()
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // 1. Affichage pendant la vérification de la session
  if (status === 'loading') {
    return (
      <Layout>
        <p>Chargement…</p>
      </Layout>
    )
  }

  // 2. Bloquer l’accès si non connecté
  if (!session) {
    return (
      <Layout>
        <p>⚠️ Connectez-vous pour voir vos logs.</p>
      </Layout>
    )
  }

  // 3. Récupérer les logs au chargement
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/flit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logs' })
        })
        const json = await res.json()
        if (!res.ok || json.success === false) {
          throw new Error(json.error || 'Erreur de récupération des logs')
        }
        setLogs(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <Layout>
      <h2>Logs d’inventaire</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Chargement des logs…</p>
      ) : (
        <Table
          data={logs}
          columns={[
            { key: 'item',       label: 'Item' },
            { key: 'qty',        label: 'Quantité' },
            { key: 'inserted_at', label: 'Date' }
          ]}
        />
      )}
    </Layout>
  )
}
