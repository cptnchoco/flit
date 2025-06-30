// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Ces vars doivent exister en build et être préfixées NEXT_PUBLIC_
// NEXT_PUBLIC_SUPABASE_URL  et NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
