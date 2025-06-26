import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <h1>Bienvenue sur FLIT</h1>
      <p>Gère ton inventaire Star Citizen depuis Discord</p>
    </Layout>
  )
}
import { useEffect, useState } from 'react'
import Table from '../components/Table'

export default function Logs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch('/api/flit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logs', userId: 'ton_id' })
    })
    .then(r => r.json())
    .then(({ data }) => setLogs(data))
  }, [])

  return (
    <div>
      <h2>Logs d’inventaire</h2>
      <Table data={logs} columns={['item', 'qty', 'user_id']} />
    </div>
  )
}
