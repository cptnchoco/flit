-- sql/schema.sql

-- 1) Table des utilisateurs (gérée par NextAuth/Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id        TEXT      PRIMARY KEY,              -- correspond à auth.uid()
  username  TEXT      NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Table d’inventaire
CREATE TABLE IF NOT EXISTS public.inventory (
  id           SERIAL        PRIMARY KEY,
  user_id      TEXT          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item         TEXT          NOT NULL,
  qty          INTEGER       NOT NULL CHECK (qty >= 0),
  inserted_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 3) Contrainte d’unicité pour upsert (un même item par utilisateur)
CREATE UNIQUE INDEX IF NOT EXISTS
  idx_inventory_user_item
ON public.inventory(user_id, item);
