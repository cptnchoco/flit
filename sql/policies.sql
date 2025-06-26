-- sql/policies.sql

-- 1. Active le Row-Level Security (RLS) sur la table inventory
ALTER TABLE public.inventory
  ENABLE ROW LEVEL SECURITY;

-- 2. Politique de SELECT : un utilisateur ne peut lire que ses propres lignes
CREATE POLICY select_own_inventory
  ON public.inventory
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Politique d’INSERT : un utilisateur ne peut insérer que des lignes dont user_id = auth.uid()
CREATE POLICY insert_own_inventory
  ON public.inventory
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Politique d’UPDATE : un utilisateur ne peut modifier que ses propres lignes,
--    et ne peut changer le user_id d’une ligne existante
CREATE POLICY update_own_inventory
  ON public.inventory
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Politique de DELETE (optionnelle) : un utilisateur ne peut supprimer que ses propres lignes
CREATE POLICY delete_own_inventory
  ON public.inventory
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. (Optionnel) Si tu as une table users ou profiles gérée par NextAuth/Supabase,
--    veille à définir des politiques similaires, par exemple :

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY select_own_user
--   ON public.users
--   FOR SELECT
--   USING (auth.uid() = id);

-- Remarque :
-- • Les policies INSERT/UPDATE avec CHECK garantissent que même via un Service Role
--   ou une fonction RPC, on ne peut pas écrire une ligne arbitraire (user_id doit correspondre).
-- • auth.uid() renvoie l’ID de l’utilisateur issu du JWT NextAuth/Supabase.
-- • Pense à recharger tes policies dans Supabase (SQL Editor → Run) après modifications.
