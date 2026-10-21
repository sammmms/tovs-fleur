-- ====================================================================
-- MIGRATION: RENAME INVOICES TO TOVS_FLEUR_INVOICES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ====================================================================

-- 1. Rename existing invoices table to tovs_fleur_invoices if it exists
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'invoices') then
    alter table public.invoices rename to tovs_fleur_invoices;
  end if;
end $$;

-- 2. If table does not exist at all, create it
create table if not exists public.tovs_fleur_invoices (
  id text primary key,
  invoice_number text not null,
  order_date text not null,
  payment_date text,
  payment_method text not null default 'Transfer Bank (BCA)',
  payment_status text not null default 'LUNAS',
  customer_name text not null,
  customer_gender text not null default 'Laki-Laki',
  customer_phone text,
  recipient_name text not null,
  recipient_gender text not null default 'Perempuan',
  product_name text not null,
  flower_type text not null default 'Artificial',
  size text not null default 'M',
  color_scheme text,
  notes text,
  greeting_card text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.tovs_fleur_invoices enable row level security;

-- 4. Enable Anon Policy
drop policy if exists "Enable all access for anon" on public.tovs_fleur_invoices;
create policy "Enable all access for anon" on public.tovs_fleur_invoices
  for all using (true) with check (true);

-- 5. Enable Realtime
alter publication supabase_realtime add table public.tovs_fleur_invoices;

-- 6. Backwards compatibility view (for older clients or webhooks)
create or replace view public.invoices as
  select * from public.tovs_fleur_invoices;
