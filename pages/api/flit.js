// pages/api/flit.js

import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import fetch from 'node-fetch'

// On utilise la Service Role Key côté serveur (jamais versionnée côté client)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // 1) Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  // 2) Vérifier que l'utilisateur est authentifié
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Authentification requise' })
  }
  const userId = session.user.id

  // 3) Récupérer et valider le payload
  const { action, item, qty: rawQty, targetId } = req.body
  const qty = Number(rawQty)
  if (!action || !['ajout','retrait','transfert','logs'].includes(action)) {
    return res.status(400).json({ error: 'Action invalide' })
  }
  if (action !== 'logs') {
    if (!item || typeof item !== 'string') {
      return res.status(400).json({ error: 'Item invalide' })
    }
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Quantité invalide' })
    }
    if (action === 'transfert' && (!targetId || typeof targetId !== 'string')) {
      return res.status(400).json({ error: 'TargetId invalide' })
    }
  }

  try {
    let responseData

    switch (action) {
      // 4a) AJOUTER de la quantité (création ou merge si déjà existant)
      case 'ajout': {
        const { error } = await supabase
          .from('inventory')
          .upsert(
            [{ user_id: userId, item, qty }],
            { onConflict: ['user_id', 'item'], merge: true }
          )
        if (error) throw error
        responseData = { message: 'Ajout effectué', item, qty }
        break
      }

      // 4b) RETRAIT de la quantité (vérification solde)
      case 'retrait': {
        const { data: existing, error: e1 } = await supabase
          .from('inventory')
          .select('qty')
          .eq('user_id', userId)
          .eq('item', item)
          .single()
        if (e1) throw e1
        if (!existing || existing.qty < qty) {
          return res.status(400).json({ error: 'Quantité insuffisante' })
        }
        const newQty = existing.qty - qty
        const { error } = await supabase
          .from('inventory')
          .update({ qty: newQty })
          .eq('user_id', userId)
          .eq('item', item)
        if (error) throw error
        responseData = { message: 'Retrait effectué', item, qty, newQty }
        break
      }

      // 4c) TRANSFERT entre deux users
      case 'transfert': {
        // 1. vérifier le solde source
        const { data: src, error: e2 } = await supabase
          .from('inventory')
          .select('qty')
          .eq('user_id', userId)
          .eq('item', item)
          .single()
        if (e2) throw e2
        if (!src || src.qty < qty) {
          return res.status(400).json({ error: 'Quantité insuffisante pour transfert' })
        }
        // 2. décrémenter la source
        const newSrcQty = src.qty - qty
        const { error: e3 } = await supabase
          .from('inventory')
          .update({ qty: newSrcQty })
          .eq('user_id', userId)
          .eq('item', item)
        if (e3) throw e3
        // 3. incrémenter la cible (upsert pour créer si besoin)
        const { error: e4 } = await supabase
          .from('inventory')
          .upsert(
            [{ user_id: targetId, item, qty }],
            { onConflict: ['user_id', 'item'], merge: true }
          )
        if (e4) throw e4

        responseData = {
          message: 'Transfert effectué',
          item,
          qty,
          from: userId,
          to: targetId
        }
        break
      }

      // 4d) LISTER les logs d’inventaire de l’utilisateur
      case 'logs': {
        const { data, error } = await supabase
          .from('inventory')
          .select('id, item, qty, inserted_at')
          .eq('user_id', userId)
          .order('inserted_at', { ascending: false })
        if (error) throw error
        responseData = data
        break
      }
    }

    // 5) Envoi facultatif de webhook Discord pour actions critiques
    if (
      ['ajout', 'retrait', 'transfert'].includes(action) &&
      process.env.DISCORD_WEBHOOK_URL
    ) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**${session.user.name}** (${userId}) a fait : **${action}** – ${qty} × ${item}`
            + (action === 'transfert' ? ` → <@${targetId}>` : '')
        })
      })
    }

    // 6) Réponse standard
    return res.status(200).json({ success: true, data: responseData })
  } catch (err) {
    console.error('API FLIT Error:', err)
    return res
      .status(500)
      .json({ success: false, error: err.message || 'Erreur serveur' })
  }
}
