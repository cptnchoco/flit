// components/Table.js
import { useState, useMemo } from 'react'

export default function Table({ data, columns }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  // 1. Prépare la liste de colonnes { key, label }
  const cols = useMemo(() => {
    if (Array.isArray(columns) && columns.length > 0) {
      return columns.map(col =>
        typeof col === 'string'
          ? { key: col, label: capitalize(col) }
          : { key: col.key, label: col.label || capitalize(col.key) }
      )
    }
    if (data?.length) {
      return Object.keys(data[0]).map(key => ({ key, label: capitalize(key) }))
    }
    return []
  }, [columns, data])

  // 2. Trie les données en fonction de sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !data) return data
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal == null || bVal == null) return 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal
      }
      return String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    })
    if (sortConfig.direction === 'desc') sorted.reverse()
    return sorted
  }, [data, sortConfig])

  // 3. Gère le clic sur l’entête pour changer le tri
  const handleSort = key => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // cycle asc → desc → none
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: null }
      }
      return { key, direction: 'asc' }
    })
  }

  if (!data?.length) {
    return <p>Aucune donnée à afficher</p>
  }

  return (
    <>
      <table role="table">
        <thead>
          <tr>
            {cols.map(col => {
              const isSorted = sortConfig.key === col.key
              const ariaSort = isSorted
                ? sortConfig.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
              return (
                <th
                  key={col.key}
                  role="columnheader"
                  aria-sort={ariaSort}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer' }}
                >
                  {col.label}
                  {isSorted && (
                    <span aria-hidden="true" style={{ marginLeft: 4 }}>
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i}>
              {cols.map(col => (
                <td key={col.key} role="cell">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 0.6rem;
          text-align: left;
        }
        th:hover {
          background: #f9f9f9;
        }
        thead {
          background: #eee;
        }
        tr:nth-child(even) td {
          background: #fafafa;
        }
      `}</style>
    </>
  )
}

// Helper : transforme "user_id" → "User id"
function capitalize(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
