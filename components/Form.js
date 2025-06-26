import { useState } from 'react'

export default function Form({ fields, onSubmit, submitLabel = 'Envoyer' }) {
  // Définit les champs par défaut si aucun n’est passé en prop
  const defaultFields = [
    { label: 'Nom de l’item', name: 'item', type: 'text' },
    { label: 'Quantité',      name: 'qty',  type: 'number' }
  ]
  const formFields = fields ?? defaultFields

  // État initial : une clé par champ, valeur vide
  const [values, setValues] = useState(
    formFields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})
  )

  const handleChange = e => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map(f => (
        <div key={f.name} style={{ marginBottom: '1rem' }}>
          <label htmlFor={f.name} style={{ display: 'block', marginBottom: '.3rem' }}>
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            value={values[f.name]}
            onChange={handleChange}
            required
            style={{ padding: '.5rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      ))}
      <button type="submit" style={{ padding: '.6rem 1.2rem' }}>
        {submitLabel}
      </button>
    </form>
  )
}
