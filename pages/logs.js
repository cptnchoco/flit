// pages/logs.js

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

// 1) Server‐side session check & redirect if not signed in
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

  return {
    props: { session }
  }
}

export default function Logs({ session }) {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // 2) Fetch logs once session is guaranteed
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
            { key: 'item',        label: 'Item' },
            { key: 'qty',         label: 'Quantité' },
            { key: 'inserted_at', label: 'Date' }
          ]}
        />
      )}
    </Layout>
  )
}
