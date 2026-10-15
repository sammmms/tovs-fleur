'use strict';
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { 
  Printer, 
  ArrowLeft, 
  X, 
  FileText,
  Layers
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { BRAND } from '@/lib/constants';

interface BatchInvoicePrintModalProps {
  invoices: Invoice[];
  onClose: () => void;
}

export const BatchInvoicePrintModal: React.FC<BatchInvoicePrintModalProps> = ({
  invoices,
  onClose,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!invoices || invoices.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalSum = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-2 sm:p-6 overflow-y-auto">
      {/* Outer wrapper */}
      <div className="bg-white rounded-3xl w-full max-w-4xl my-4 sm:my-8 flex flex-col shadow-2xl border border-[#D8C3B1] overflow-hidden relative">
        {/* Top Control Bar (Sticky & Always Visible, Hidden when printing) */}
        <div className="sticky top-0 z-30 no-print px-4 sm:px-6 py-3.5 bg-[#FAF6F0] border-b border-[#EADBCE] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#7A5239] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="hidden sm:block">
              <h3 className="font-serif font-bold text-sm text-[#2C1F17] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#A85842]" />
                <span>Cetak Batch: {invoices.length} Faktur (1 File PDF)</span>
              </h3>
              <p className="text-[11px] text-[#7A5239]">
                Total Akumulasi: Rp {formatRupiah(totalSum)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Semua ({invoices.length} Halaman PDF)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EADBCE]/60 text-[#7A5239] transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Multi-Page Container */}
        <div className="p-4 sm:p-8 bg-white text-[#2C1F17] print-container space-y-12">
          {invoices.map((invoice, index) => (
            <div key={invoice.id} className="relative">
              {/* Screen page indicator (no-print) */}
              <div className="no-print flex items-center justify-between pb-3 mb-4 border-b border-dashed border-[#D8C3B1] text-xs text-[#7A5239]">
                <span className="font-bold">
                  📄 Halaman Faktur #{index + 1} dari {invoices.length}
                </span>
                <span className="font-mono">{invoice.invoiceNumber} • {invoice.recipientName}</span>
              </div>

              {/* Single Invoice Document */}
              <div className="p-4 sm:p-6 bg-white border border-[#EADBCE] rounded-2xl shadow-xs print:border-none print:p-0 print:shadow-none">
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-[#7A5239] pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#D8C3B1] bg-[#FAF6F0] p-1 flex items-center justify-center shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Tov's Fleur Logo"
                        width={60}
                        height={60}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="font-serif text-xl sm:text-2xl font-extrabold tracking-wider text-[#2C1F17] leading-tight">
                        TOV’S FLEUR
                      </h1>
                      <p className="text-xs text-[#7A5239] font-medium tracking-wide">
                        Boutique Florist • Medan & Lubuk Pakam
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        WA: {BRAND.whatsappNumber} • IG: {BRAND.instagramHandle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded-lg bg-[#FAF6F0] border border-[#EADBCE] text-right mb-1">
                      <span className="text-[9px] uppercase font-bold text-[#7A5239] block">
                        INVOICE PESANAN
                      </span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#2C1F17]">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        invoice.paymentStatus === 'LUNAS'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : invoice.paymentStatus === 'DP'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {invoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-b border-[#EADBCE] text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Tanggal Pesan:</span>
                    <span className="font-semibold text-[#2C1F17]">{invoice.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Tanggal Bayar:</span>
                    <span className="font-semibold text-[#2C1F17]">{invoice.paymentDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Metode Pembayaran:</span>
                    <span className="font-semibold text-[#2C1F17]">{invoice.paymentMethod || 'Transfer Bank'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Status:</span>
                    <span className="font-semibold text-emerald-700">{invoice.paymentStatus}</span>
                  </div>
                </div>

                {/* Customer & Product Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-b border-[#EADBCE] text-xs">
                  <div className="space-y-1.5 bg-[#FAF6F0]/60 p-3 rounded-xl border border-[#EADBCE]">
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Nama Pemesan :</span>
                      <span className="font-bold text-[#2C1F17]">{invoice.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Jenis Kelamin Pemesan :</span>
                      <span className="font-semibold">{invoice.customerGender}</span>
                    </div>
                    <div className="border-t border-[#EADBCE]/60 pt-1 flex justify-between">
                      <span className="text-[#7A5239]">Nama Penerima :</span>
                      <span className="font-bold text-[#2C1F17]">{invoice.recipientName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Jenis Kelamin Penerima :</span>
                      <span className="font-semibold">{invoice.recipientGender}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#FAF6F0]/60 p-3 rounded-xl border border-[#EADBCE]">
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Nama Produk :</span>
                      <span className="font-bold text-[#2C1F17] text-right">{invoice.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Jenis Bunga :</span>
                      <span className="font-semibold">{invoice.flowerType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5239]">Ukuran :</span>
                      <span className="font-semibold">{invoice.size}</span>
                    </div>
                    <div className="border-t border-[#EADBCE]/60 pt-1 flex justify-between">
                      <span className="text-[#7A5239]">Skema Warna :</span>
                      <span className="font-semibold text-right">{invoice.colorScheme || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Greeting & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-b border-[#EADBCE]">
                  <div className="p-3 rounded-xl border-2 border-dashed border-[#C48B71]/70 bg-[#FAF6F0]/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A85842] block mb-0.5">
                      💌 Teks Kartu Ucapan:
                    </span>
                    <p className="font-serif italic text-xs sm:text-sm text-[#2C1F17] whitespace-pre-line leading-relaxed">
                      {invoice.greetingCard || '-'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-[#EADBCE] bg-[#FAF6F0]/30 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5239] block mb-0.5">
                      📝 Catatan Pemesan:
                    </span>
                    <p className="text-zinc-700 whitespace-pre-line leading-relaxed text-[11px]">
                      {invoice.notes || '-'}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="py-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b-2 border-[#7A5239] text-[#7A5239]">
                        <th className="py-1.5 text-left font-bold w-10">No.</th>
                        <th className="py-1.5 text-left font-bold">Keterangan / Item</th>
                        <th className="py-1.5 text-right font-bold w-32">Harga (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADBCE]">
                      {invoice.items.map((item, idx) => {
                        const isDiscount = item.price < 0;
                        return (
                          <tr key={item.id}>
                            <td className="py-2 text-zinc-500 font-medium">{idx + 1}</td>
                            <td className="py-2 font-medium text-[#2C1F17]">
                              {item.name}
                            </td>
                            <td className={`py-2 text-right font-semibold ${isDiscount ? 'text-rose-600' : 'text-[#2C1F17]'}`}>
                              {formatRupiah(item.price)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#7A5239] text-xs sm:text-sm">
                        <td colSpan={2} className="py-2.5 text-right font-bold text-[#2C1F17]">
                          Total Harga (Rp) :
                        </td>
                        <td className="py-2.5 text-right font-serif font-bold text-base text-[#A85842]">
                          {formatRupiah(invoice.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#EADBCE] flex items-center justify-between text-[11px] text-zinc-500">
                  <p className="font-serif italic text-[#7A5239]">
                    “Thank you for ordering with Tov’s Fleur!”
                  </p>
                  <span className="font-semibold text-[#2C1F17]">
                    Tov’s Fleur Florist Team • Medan & L.Pakam
                  </span>
                </div>
              </div>

              {/* Page Break for Print */}
              {index < invoices.length - 1 && (
                <div className="page-break my-6 border-b-2 border-dashed border-[#D8C3B1] no-print text-center text-xs text-zinc-400 py-1" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Control Bar (Hidden when printing) */}
        <div className="no-print px-6 py-4 bg-[#FAF6F0] border-t border-[#EADBCE] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#7A5239] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Invoice</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Semua ({invoices.length} Halaman PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
