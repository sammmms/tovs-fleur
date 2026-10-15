-- ==========================================================
-- TOV'S FLEUR - DATABASE MIGRATION SCRIPT FOR SUPABASE
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==========================================================

-- 1. Create Invoices Table
create table if not exists public.invoices (
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

-- 2. Enable Row Level Security (RLS)
alter table public.invoices enable row level security;

-- 3. Create Policy allowing full read & write for anon client
drop policy if exists "Enable all access for anon" on public.invoices;
create policy "Enable all access for anon" on public.invoices
  for all
  using (true)
  with check (true);

-- 4. Enable Realtime cross-device updates
alter publication supabase_realtime add table public.invoices;

-- 5. Seed Initial Real Orders (Samuel Onasis Sample Orders)
insert into public.invoices (
  id, invoice_number, order_date, payment_date, payment_method, payment_status,
  customer_name, customer_gender, customer_phone,
  recipient_name, recipient_gender,
  product_name, flower_type, size, color_scheme, notes, greeting_card,
  items, total_amount
) values
(
  'seed-inv-1',
  'TF-20261015-01',
  '15 Oktober 2026',
  '15 Oktober 2026',
  'Transfer Bank (BCA)',
  'LUNAS',
  'Samuel Onasis',
  'Laki-Laki',
  '+628123456789',
  'Naomi Prisella, S. Kom.',
  'Perempuan',
  'Artificial Graduation Bouquet (Custom Price)',
  'Artificial',
  'M',
  'Pink',
  'Skema Warna: Pink. Bunga: Hindari rose, fokus ke bunga ramai, kayak hyd, baby breath, pokonya hindari romantic.',
  'Wisudatulation\nNaomi Prisella, S. Kom.',
  '[{"id":"1","name":"Bouquet","price":180000},{"id":"2","name":"Graduation Doll (Coklat)","price":50000}]'::jsonb,
  230000
),
(
  'seed-inv-2',
  'TF-20261015-02',
  '15 Oktober 2026',
  '15 Oktober 2026',
  'Transfer Bank (BCA)',
  'LUNAS',
  'Samuel Onasis',
  'Laki-Laki',
  '+628123456789',
  'Flarenshya Clearesta, S. Kom.',
  'Perempuan',
  'Artificial Graduation Bouquet (Custom Price)',
  'Artificial',
  'M',
  'White/Blue',
  'Color scheme bunga 2 : White/Blue. Bunga : Fokus ke lily, sisanya pemanis',
  'Wisudatulation\nFlarenshya Clearesta, S. Kom.',
  '[{"id":"1","name":"Bouquet","price":180000},{"id":"2","name":"Graduation Doll (Coklat)","price":50000}]'::jsonb,
  230000
),
(
  'seed-inv-3',
  'TF-20261015-03',
  '15 Oktober 2026',
  '15 Oktober 2026',
  'Transfer Bank (BCA)',
  'LUNAS',
  'Samuel Onasis',
  'Laki-Laki',
  '+628123456789',
  'Giovanny Halimko, S. Kom.',
  'Perempuan',
  'Money Bouquet Graduation 30 Lembar (Custom Modif)',
  'Artificial',
  'L',
  'Navy/Gold',
  'Buket uang 30 lembar. Modifikasi bunga nuansa navy & gold mewah.',
  'Wisudatulation\nGiovanny Halimko, S. Kom.',
  '[{"id":"1","name":"Bouquet Dasar","price":200000},{"id":"2","name":"Biaya Modifikasi & Slot Uang 30 lbr","price":150000}]'::jsonb,
  350000
)
on conflict (id) do nothing;
