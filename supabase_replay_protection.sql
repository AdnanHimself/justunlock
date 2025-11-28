create table if not exists used_transactions (
  tx_hash text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table used_transactions enable row level security;

-- Only service role can insert/read (for API usage)
create policy "Service role can do everything"
  on used_transactions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
