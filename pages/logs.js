// pages/logs.js
import { useState, useEffect }   from 'react'
import Layout                    from '../components/Layout'
import Table                     from '../components/Table'
import { getServerSession }      from 'next-auth/next'
import { authOptions }           from './api/auth/[...nextauth]'

// 1) SSR : redirige vers la page de connexion si pas de session
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

export default function Logs() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  // 2) Récupère les logs via ton API interne
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/flit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ action: 'logs' })
        })
        const { success, data, error } = await res.json()
        if (!success) throw new Error(error || 'Erreur de récupération')
        setLogs(data)
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
      <h2>Historique des actions</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Chargement des logs…</p>
      ) : (
        <Table
          data={logs}
          columns={[
            { key: 'action',     label: 'Action' },
            { key: 'item',       label: 'Item' },
            { key: 'qty',        label: 'Quantité' },
            { key: 'target_id',  label: 'Vers (ID destinataire)' },
            { key: 'created_at', label: 'Date' }
          ]}
        />
      )}
    </Layout>
  )
}
