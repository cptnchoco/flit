// pages/api/flit.js
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { SpeedInsights } from "@vercel/speed-insights/next"

// côté serveur avec les droits Service Role
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ success:false, error:'Non authentifié' })

  const { action, item, qty, targetId } = req.body
  const uid = session.user.id

  try {
    switch (action) {
      case 'logs': {
        const { data, error } = await supabaseAdmin
          .from('inventory_logs')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        if (error) throw error
        return res.json({ success:true, data })
      }
      case 'ajout': {
        await supabaseAdmin
          .from('inventory_items')
          .insert({ user_id: uid, item, qty })
        await supabaseAdmin
          .from('inventory_logs')
          .insert({ user_id: uid, action:'ajout', item, qty })
        return res.json({ success:true, data:{ message:'Item ajouté' } })
      }
      case 'retrait': {
        await supabaseAdmin
          .from('inventory_items')
          .update({ qty: qty * -1 })  // ou logic plus fine
          .match({ user_id: uid, item })
        await supabaseAdmin
          .from('inventory_logs')
          .insert({ user_id: uid, action:'retrait', item, qty })
        return res.json({ success:true, data:{ message:'Item retiré' } })
      }
      case 'transfert': {
        // décrémente pour l’émetteur
        await supabaseAdmin
          .from('inventory_items')
          .update({ qty: qty * -1 })
          .match({ user_id: uid, item })
        // incrémente pour le destinataire
        await supabaseAdmin
          .from('inventory_items')
          .upsert({ user_id: targetId, item, qty }, { onConflict:['user_id','item'] })
        // log global
        await supabaseAdmin
          .from('inventory_logs')
          .insert({ user_id: uid, action:'transfert', item, qty, target_id: targetId })
        return res.json({ success:true, data:{ message:'Transfert effectué' } })
      }
      default:
        return res.status(400).json({ success:false, error:'Action inconnue' })
    }
  } catch (error) {
    return res.status(500).json({ success:false, error: error.message })
  }
}
