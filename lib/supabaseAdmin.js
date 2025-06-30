// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,      // URL de ton projet Supabase
  process.env.SUPABASE_SERVICE_ROLE_KEY      // Clé secrète (Service Role)
)
