import { createClient } from '@supabase/supabase-js'
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  const { action, userId, item, qty, targetId } = req.body
  let query

  switch (action) {
    case 'ajout':
      query = `insert into inventory (user_id,item,qty)
               values ('${userId}','${item}',${qty})`
      break
    case 'retrait':
      query = `update inventory set qty = qty - ${qty}
               where user_id='${userId}' and item='${item}';`
      break
    case 'transfert':
      query = `
        update inventory set qty = qty - ${qty}
        where user_id='${userId}' and item='${item}';
        insert into inventory (user_id,item,qty)
        values ('${targetId}','${item}',${qty});
      `
      break
    case 'logs':
      query = `select * from inventory where user_id='${userId}'`
      break
    default:
      return res.status(400).json({ error: 'Action inconnue' })
  }

  const { data, error } = await supa.rpc('exec_sql', { query })
  if (error) return res.status(500).json({ error: error.message })

  // TODO : envoyer webhook Discord ici

  res.json({ data, message: `${action} exécuté` })
}
