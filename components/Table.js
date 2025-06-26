export default function Table({ data, columns }) {
    if (!data || data.length === 0) {
      return <p>Aucune donnée à afficher</p>
    }
  
    // Colonnes inférées ou passées en prop
    const cols = columns ?? Object.keys(data[0])
  
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map(col => (
              <th
                key={col}
                style={{
                  borderBottom: '2px solid #ddd',
                  padding: '.6rem',
                  textAlign: 'left'
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {cols.map(col => (
                <td
                  key={col}
                  style={{
                    borderBottom: '1px solid #eee',
                    padding: '.5rem'
                  }}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  
  