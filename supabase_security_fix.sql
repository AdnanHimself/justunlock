-- SECURITY FIX: Ensure target_url is NOT in the public links table
-- This prevents accidental leakage of secret content via public queries.

-- 1. Create secrets table if it doesn't exist (it should, but to be safe)
create table if not exists public.secrets (
  id uuid not null default uuid_generate_v4(),
  link_id text not null references public.links(id) on delete cascade,
  target_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Enable RLS on secrets
alter table public.secrets enable row level security;

-- 3. STRICT POLICY: No one can read secrets via API (Service Role only)
-- We drop any existing policies that might allow access
drop policy if exists "Public can read secrets" on public.secrets;
drop policy if exists "Users can read secrets" on public.secrets;
drop policy if exists "Anyone can insert secrets" on public.secrets;

-- Allow Service Role (backend) to do everything, but block public/anon/authenticated
-- By default, enabling RLS blocks everything unless a policy exists.
-- So we just need to make sure NO policy allows 'public' or 'anon' or 'authenticated' to SELECT.
-- We DO need to allow the backend to INSERT (via service role, which bypasses RLS).
-- Wait, Service Role bypasses RLS automatically. So we don't need ANY policies for it.
-- We just need to ensure NO policies exist that allow public access.

-- 4. Remove target_url from links table if it exists
-- This is the critical fix.
do $$
begin
  if exists(select 1 from information_schema.columns where table_name = 'links' and column_name = 'target_url') then
    alter table public.links drop column target_url;
  end if;
end $$;

-- 5. Ensure links table has RLS enabled
alter table public.links enable row level security;

-- 6. Allow public read access to links (metadata is public)
drop policy if exists "Public links are viewable by everyone" on public.links;
create policy "Public links are viewable by everyone"
  on public.links for select
  using ( true );

-- 7. Allow public insert to links (for creation)
drop policy if exists "Anyone can insert links" on public.links;
create policy "Anyone can insert links"
  on public.links for insert
  with check ( true );
