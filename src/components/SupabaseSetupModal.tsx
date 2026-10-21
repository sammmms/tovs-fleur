'use strict';
'use client';

import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { syncLocalInvoicesToSupabase } from '@/lib/supabaseStorage';
import { getStoredInvoices } from '@/lib/storage';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isConnected: boolean;
}

const SQL_SCHEMA = `-- ==========================================================
-- TOV'S FLEUR - DATABASE SETUP SCRIPT (PREFIX: tovs_fleur_)
-- Paste this into Supabase SQL Editor and click "RUN"
-- ==========================================================

-- 1. Create Invoices Table with prefix
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

-- 2. Enable Row Level Security (RLS)
alter table public.tovs_fleur_invoices enable row level security;

-- 3. Policy: Allow full access for anon key
drop policy if exists "Enable all access for anon" on public.tovs_fleur_invoices;
create policy "Enable all access for anon" on public.tovs_fleur_invoices
  for all
  using (true)
  with check (true);

-- 4. Enable Realtime updates
alter publication supabase_realtime add table public.tovs_fleur_invoices;

-- 5. Backwards compatibility view
create or replace view public.invoices as
  select * from public.tovs_fleur_invoices;
`;

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
  isConnected,
}) => {
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setSyncStatus('Mengunggah data invoice lokal ke Supabase...');
    const local = getStoredInvoices();
    const res = await syncLocalInvoicesToSupabase(local);
    setIsMigrating(false);

    if (res.error) {
      setSyncStatus(`Gagal migrasi: ${res.error.message || 'Pastikan tabel invoices sudah dibuat di Supabase'}`);
    } else {
      setSyncStatus(`Berhasil! ${res.count} invoice telah tersinkron ke Cloud Supabase.`);
      onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#EADBCE] space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-[#FAF6F0] text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2C1F17]">
              Konfigurasi Cloud Database (Supabase)
            </h3>
            <p className="text-xs text-[#7A5239]">
              Sinkronisasi faktur real-time antar laptop & HP tim florist
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-500 block">Status Koneksi Supabase:</span>
            <span className="font-bold font-mono text-[#2C1F17]">
              https://ahxfeflxhpkxyfitarpn.supabase.co
            </span>
          </div>
          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
            isConnected
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {isConnected ? '✓ Cloud Aktif' : 'Tabel Belum Dibuat'}
          </span>
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-xs text-[#4A3528]">
          <h4 className="font-bold text-sm text-[#2C1F17] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#A85842]" />
            <span>Langkah 1x Setup Tabel di Supabase Dashboard:</span>
          </h4>

          <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
            <li>
              Buka link{' '}
              <a
                href="https://supabase.com/dashboard/project/ahxfeflxhpkxyfitarpn/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#A85842] underline inline-flex items-center gap-1 hover:text-[#5C3D2E]"
              >
                Supabase SQL Editor <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Klik tombol **Salin Kode SQL** di bawah ini.</li>
            <li>Tempel (Paste) di editor Supabase, lalu klik tombol **Run** (hijau).</li>
            <li>Selesai! Klik **Tes Ulang & Unggah Data** di bawah untuk sinkronisasi otomatis.</li>
          </ol>
        </div>

        {/* Code Box */}
        <div className="relative">
          <pre className="bg-zinc-900 text-zinc-100 p-3.5 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 border border-zinc-800">
            {SQL_SCHEMA}
          </pre>
          <button
            onClick={handleCopySql}
            className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode SQL</span>
              </>
            )}
          </button>
        </div>

        {syncStatus && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            syncStatus.includes('Berhasil') 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#F5ECE1]">
          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isMigrating ? 'animate-spin' : ''}`} />
            <span>{isMigrating ? 'Memproses...' : 'Tes Ulang & Unggah Data Lokal'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D8C3B1] text-xs font-semibold text-[#7A5239] hover:bg-[#FAF6F0] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
