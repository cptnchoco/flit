create table users (
  id text primary key,
  username text
);
create table inventory (
  id serial primary key,
  user_id text references users(id),
  item text,
  qty integer
);
