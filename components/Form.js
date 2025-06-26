// components/Form.js
import { useState, useEffect } from 'react'

export default function Form({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Envoyer'
}) {
  // 1. Champs par défaut
  const defaultFields = [
    { label: 'Nom de l’item', name: 'item', type: 'text' },
    { label: 'Quantité',      name: 'qty',  type: 'number' }
  ]
  const formFields = fields ?? defaultFields

  // 2. Initialiser les valeurs (vide ou depuis initialValues)
  const makeEmptyValues = () =>
    formFields.reduce(
      (acc, f) => ({ ...acc, [f.name]: initialValues[f.name] ?? '' }),
      {}
    )

  const [values, setValues]     = useState(makeEmptyValues())
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  // 3. Réinit si formFields / initialValues changent
  useEffect(() => {
    setValues(makeEmptyValues())
  }, [fields, JSON.stringify(initialValues)])

  // 4. Écoute des changements
  const handleChange = e => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // 5. Soumission
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Coercition des nombres
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => {
        const field = formFields.find(f => f.name === k)
        return [k, field?.type === 'number' ? Number(v) : v]
      })
    )

    try {
      await onSubmit(payload)
      // reset
      setValues(makeEmptyValues())
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={loading}
      aria-live="polite"
      style={{ maxWidth: 400 }}
    >
      {formFields.map(f => (
        <div key={f.name} style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={f.name}
            style={{ display: 'block', marginBottom: '.3rem' }}
          >
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            value={values[f.name]}
            onChange={handleChange}
            required
            aria-describedby={error ? `${f.name}-error` : undefined}
            style={{
              padding: '.5rem',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '.6rem 1.2rem',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'En cours…' : submitLabel}
      </button>

      {error && (
        <p
          id="form-error"
          role="alert"
          style={{ color: 'red', marginTop: '1rem' }}
        >
          {error}
        </p>
      )}
    </form>
  )
}
