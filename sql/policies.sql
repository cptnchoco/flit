-- Active RLS et restreint chaque user à ses propres lignes
alter table inventory enable row level security;
create policy "personnel" on inventory
  for all using ( auth.uid() = user_id );
