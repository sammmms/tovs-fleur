'use strict';
'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  MessageCircle, 
  Edit, 
  Copy, 
  Trash2, 
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  CheckSquare,
  Square
} from 'lucide-react';
import { Invoice, PaymentStatus } from '@/types';
import { formatRupiah, deleteInvoice, saveInvoice, resetToDefaultInvoices, generateInvoiceWhatsAppMessage } from '@/lib/storage';
import { ConfirmModal } from './ConfirmModal';

interface InvoiceListViewProps {
  invoices: Invoice[];
  onRefreshInvoices: () => void;
  onOpenPrint: (invoice: Invoice) => void;
  onOpenBatchPrint: (invoices: Invoice[]) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onGoToCreate: () => void;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = ({
  invoices,
  onRefreshInvoices,
  onOpenPrint,
  onOpenBatchPrint,
  onEditInvoice,
  onGoToCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');

  // Multi-select state for Batch Print
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog state (Replacing browser alert/confirm)
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<Invoice | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Stats calculation
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalLunas = invoices.filter((i) => i.paymentStatus === 'LUNAS').length;
  const totalPending = invoices.filter((i) => i.paymentStatus !== 'LUNAS').length;

  // Filtered list
  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((inv) => inv.id));
    }
  };

  const handleBatchPrintClick = () => {
    const toPrint = invoices.filter((inv) => selectedIds.includes(inv.id));
    if (toPrint.length > 0) {
      onOpenBatchPrint(toPrint);
    }
  };

  // Custom Delete Execution
  const executeDelete = () => {
    if (deleteTarget) {
      deleteInvoice(deleteTarget.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      onRefreshInvoices();
    }
  };

  // Custom Duplicate Execution
  const executeDuplicate = () => {
    if (duplicateTarget) {
      const copy: Invoice = {
        ...duplicateTarget,
        id: `TF-${Date.now().toString().slice(-6)}`,
        invoiceNumber: `TF-${Date.now().toString().slice(-6)}`,
        createdAt: Date.now(),
      };
      saveInvoice(copy);
      setDuplicateTarget(null);
      onRefreshInvoices();
    }
  };

  const executeReset = () => {
    resetToDefaultInvoices();
    setResetModalOpen(false);
    onRefreshInvoices();
  };

  const handleSendWa = (inv: Invoice) => {
    const waMsg = generateInvoiceWhatsAppMessage(inv);
    const targetPhone = (inv.customerPhone || '').replace(/^0/, '62').replace(/[^0-9]/g, '');
    const waUrl = targetPhone 
      ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${waMsg}`
      : `https://api.whatsapp.com/send?text=${waMsg}`;
    window.open(waUrl, '_blank');
  };

  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A85842]">
            Manajemen Invoice Florist
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1F17] mt-0.5">
            Daftar Faktur & Pesanan
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5239]">
            Kelola, cetak batch gabungan 1 PDF, atau kirim langsung ke WhatsApp customer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setResetModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#7A5239] border border-[#D8C3B1] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke data awal PDF Samuel Onasis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload Sample PDF</span>
          </button>

          <button
            onClick={onGoToCreate}
            className="px-4 py-2 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Invoice Baru</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs">
          <span className="text-[11px] font-semibold text-[#7A5239] uppercase tracking-wider block">
            Total Invoice
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1F17] mt-1 block">
            {invoices.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs">
          <span className="text-[11px] font-semibold text-[#7A5239] uppercase tracking-wider block">
            Total Nilai Transaksi
          </span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#A85842] mt-1 block truncate">
            Rp {formatRupiah(totalRevenue)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Lunas
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 block">
            {totalLunas}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Pending / DP
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-800 mt-1 block">
            {totalPending}
          </span>
        </div>
      </div>

      {/* Search, Filter & Batch Print Action Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EADBCE] space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#7A5239] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pemesan, penerima, produk..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'LUNAS', 'DP', 'PENDING'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#7A5239] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#7A5239] hover:bg-[#EADBCE]'
                }`}
              >
                {st === 'ALL' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Selection & Batch Print Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F5ECE1] text-xs">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 text-[#7A5239] hover:text-[#2C1F17] font-semibold cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-[#A85842]" />
            ) : (
              <Square className="w-4 h-4 text-zinc-400" />
            )}
            <span>Pilih Semua ({filtered.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-[#A85842] font-bold">
                {selectedIds.length} dipilih
              </span>
              <button
                type="button"
                onClick={handleBatchPrintClick}
                className="px-3.5 py-1.5 rounded-xl bg-[#A85842] hover:bg-[#7A5239] text-white font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>🖨️ Cetak {selectedIds.length} Invoice (Batch 1 PDF)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoices List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EADBCE]">
          <FileText className="w-12 h-12 text-[#D8C3B1] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#2C1F17]">
            Belum ada invoice yang sesuai
          </h3>
          <p className="text-xs text-[#7A5239] mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau buat invoice baru sekarang.
          </p>
          <button
            onClick={onGoToCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7A5239] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Invoice Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const isChecked = selectedIds.includes(inv.id);
            return (
              <div
                key={inv.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isChecked
                    ? 'border-[#A85842] shadow-sm bg-[#FAF6F0]/40 ring-1 ring-[#A85842]'
                    : 'border-[#EADBCE] shadow-xs hover:shadow-md'
                }`}
              >
                {/* Left Column: Checkbox & Details */}
                <div className="flex items-start gap-3">
                  {/* Select Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(inv.id)}
                    className="mt-1 p-0.5 text-[#7A5239] hover:text-[#A85842] cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#A85842]" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-300" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7A5239] bg-[#FAF6F0] px-2.5 py-0.5 rounded-md border border-[#EADBCE]">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500 font-medium">
                        {inv.orderDate}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inv.paymentStatus === 'LUNAS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.paymentStatus === 'DP'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-[#2C1F17] flex items-center gap-2">
                        <span>{inv.customerName} ({inv.customerGender === 'Laki-Laki' ? '👨' : '👩'})</span>
                        <span className="text-xs font-sans font-normal text-zinc-400">➔</span>
                        <span className="text-sm font-sans font-medium text-[#A85842]">
                          {inv.recipientName} ({inv.recipientGender === 'Laki-Laki' ? '👨' : '👩'})
                        </span>
                      </h4>
                      <p className="text-xs text-[#6B4E3D]">
                        {inv.productName} ({inv.flowerType} • Size {inv.size}) • {inv.paymentMethod || 'Transfer'}
                      </p>
                    </div>

                    {inv.notes && (
                      <p className="text-[11px] text-zinc-500 line-clamp-1 italic max-w-lg">
                        "{inv.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column: Price & Quick Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F5ECE1] shrink-0 gap-2 pl-8 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                      Total
                    </span>
                    <span className="font-serif font-bold text-lg text-[#2C1F17]">
                      Rp {formatRupiah(inv.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Print Modal */}
                    <button
                      onClick={() => onOpenPrint(inv)}
                      className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-[#7A5239] border border-[#D8C3B1] transition-colors cursor-pointer"
                      title="Cetak Faktur PDF Tunggal"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Send WA */}
                    <button
                      onClick={() => handleSendWa(inv)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                      title="Kirim ke WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditInvoice(inv)}
                      className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-[#7A5239] border border-[#D8C3B1] transition-colors cursor-pointer"
                      title="Edit Data"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Duplicate Trigger */}
                    <button
                      onClick={() => setDuplicateTarget(inv)}
                      className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-[#7A5239] border border-[#D8C3B1] transition-colors cursor-pointer"
                      title="Duplikat Faktur"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => setDeleteTarget(inv)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Hapus Faktur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        type="delete"
        title={`Hapus Faktur ${deleteTarget?.invoiceNumber}?`}
        message={`Apakah Anda yakin ingin menghapus faktur untuk pemesan ${deleteTarget?.customerName} (${deleteTarget?.recipientName})?\n\nTindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Faktur"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Custom Duplicate Confirmation Modal */}
      <ConfirmModal
        isOpen={!!duplicateTarget}
        type="duplicate"
        title={`Duplikat Faktur ${duplicateTarget?.invoiceNumber}?`}
        message={`Salinan faktur baru akan dibuat dengan detail produk ${duplicateTarget?.productName} untuk pemesan ${duplicateTarget?.customerName}.`}
        confirmText="Ya, Buat Salinan"
        onConfirm={executeDuplicate}
        onCancel={() => setDuplicateTarget(null)}
      />

      {/* Custom Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        type="duplicate"
        title="Muat Ulang 3 Sampel Invoice Samuel Onasis?"
        message="Data faktur contoh dari dokumen PDF resmi akan dipulihkan ke daftar faktur Anda."
        confirmText="Ya, Pulihkan Sampel"
        onConfirm={executeReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
