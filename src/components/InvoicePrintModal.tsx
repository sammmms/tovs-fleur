'use strict';
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Printer, 
  Download, 
  MessageCircle, 
  X, 
  CheckCircle, 
  Calendar, 
  User, 
  Heart,
  Flower2,
  ArrowLeft
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatRupiah, generateInvoiceWhatsAppMessage } from '@/lib/storage';
import { BRAND } from '@/lib/constants';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  onClose,
}) => {
  // Listen for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const waMsg = generateInvoiceWhatsAppMessage(invoice);
    const targetPhone = (invoice.customerPhone || '').replace(/^0/, '62').replace(/[^0-9]/g, '');
    const waUrl = targetPhone 
      ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${waMsg}`
      : `https://api.whatsapp.com/send?text=${waMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-2 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-3xl my-4 sm:my-8 flex flex-col shadow-2xl border border-[#D8C3B1] overflow-hidden relative">
        {/* Top Control Bar (Sticky & Hidden when printing) */}
        <div className="sticky top-0 z-20 no-print px-4 sm:px-6 py-3.5 bg-[#FAF6F0] border-b border-[#EADBCE] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#7A5239] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="hidden xs:flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2C1F17]">
                Faktur #{invoice.invoiceNumber}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Kirim WA</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EADBCE]/60 text-[#7A5239] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet (Matching /Users/sam/Downloads/2026-10-15 TF_Samuel Onasis_1.pdf format) */}
        <div id="printable-invoice" className="p-6 sm:p-10 bg-white text-[#2C1F17] print-container">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#7A5239] pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D8C3B1] bg-[#FAF6F0] p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Tov's Fleur Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-[#2C1F17] leading-tight">
                  TOV’S FLEUR
                </h1>
                <p className="text-xs text-[#7A5239] font-medium tracking-wide">
                  Boutique Florist • Medan & Lubuk Pakam
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  WA: {BRAND.whatsappNumber} • IG: {BRAND.instagramHandle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded-lg bg-[#FAF6F0] border border-[#EADBCE] text-right mb-1">
                <span className="text-[10px] uppercase font-bold text-[#7A5239] block">
                  INVOICE PESANAN
                </span>
                <span className="font-mono font-bold text-sm sm:text-base text-[#2C1F17]">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
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

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#EADBCE] text-xs">
            <div>
              <span className="text-zinc-500 block">Tanggal Pesan:</span>
              <span className="font-semibold text-[#2C1F17]">{invoice.orderDate}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Tanggal Bayar:</span>
              <span className="font-semibold text-[#2C1F17]">{invoice.paymentDate || '-'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Metode Pembayaran:</span>
              <span className="font-semibold text-[#2C1F17]">{invoice.paymentMethod || 'Transfer Bank'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Status:</span>
              <span className="font-semibold text-emerald-700">{invoice.paymentStatus}</span>
            </div>
          </div>

          {/* Customer & Product Information (Replicating exact PDF rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-[#EADBCE] text-xs">
            {/* Left: Pemesan & Penerima */}
            <div className="space-y-2 bg-[#FAF6F0]/60 p-3.5 rounded-xl border border-[#EADBCE]">
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Nama Pemesan :</span>
                <span className="font-bold text-[#2C1F17]">{invoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Jenis Kelamin Pemesan :</span>
                <span className="font-semibold">{invoice.customerGender}</span>
              </div>
              <div className="border-t border-[#EADBCE]/60 pt-1.5 flex justify-between">
                <span className="text-[#7A5239] font-medium">Nama Penerima :</span>
                <span className="font-bold text-[#2C1F17]">{invoice.recipientName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Jenis Kelamin Penerima :</span>
                <span className="font-semibold">{invoice.recipientGender}</span>
              </div>
            </div>

            {/* Right: Spesifikasi Bunga & Ukuran */}
            <div className="space-y-2 bg-[#FAF6F0]/60 p-3.5 rounded-xl border border-[#EADBCE]">
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Nama Produk :</span>
                <span className="font-bold text-[#2C1F17] text-right">{invoice.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Jenis Bunga :</span>
                <span className="font-semibold">{invoice.flowerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239] font-medium">Ukuran :</span>
                <span className="font-semibold">{invoice.size}</span>
              </div>
              <div className="border-t border-[#EADBCE]/60 pt-1.5 flex justify-between">
                <span className="text-[#7A5239] font-medium">Skema Warna :</span>
                <span className="font-semibold text-right">{invoice.colorScheme || '-'}</span>
              </div>
            </div>
          </div>

          {/* Greeting Card & Notes Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-[#EADBCE]">
            {/* Teks Kartu Ucapan */}
            <div className="p-3.5 rounded-xl border-2 border-dashed border-[#C48B71]/70 bg-[#FAF6F0]/40">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A85842] block mb-1">
                💌 Teks Kartu Ucapan:
              </span>
              <p className="font-serif italic text-sm text-[#2C1F17] whitespace-pre-line leading-relaxed">
                {invoice.greetingCard || '-'}
              </p>
            </div>

            {/* Catatan Pemesan */}
            <div className="p-3.5 rounded-xl border border-[#EADBCE] bg-[#FAF6F0]/30 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5239] block mb-1">
                📝 Catatan Pemesan:
              </span>
              <p className="text-zinc-700 whitespace-pre-line leading-relaxed">
                {invoice.notes || '-'}
              </p>
            </div>
          </div>

          {/* Itemized Price Table (Perincian Harga) */}
          <div className="py-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#7A5239] mb-2">
              Perincian Harga (Rp)
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-[#7A5239] text-[#7A5239]">
                  <th className="py-2 text-left font-bold w-12">No.</th>
                  <th className="py-2 text-left font-bold">Keterangan / Item</th>
                  <th className="py-2 text-right font-bold w-36">Harga (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADBCE]">
                {invoice.items.map((item, idx) => {
                  const isDiscount = item.price < 0;
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF6F0]/50">
                      <td className="py-2.5 text-zinc-500 font-medium">{idx + 1}</td>
                      <td className="py-2.5 font-medium text-[#2C1F17]">
                        {item.name}
                      </td>
                      <td className={`py-2.5 text-right font-semibold ${isDiscount ? 'text-rose-600' : 'text-[#2C1F17]'}`}>
                        {formatRupiah(item.price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#7A5239] text-sm">
                  <td colSpan={2} className="py-3 text-right font-bold text-[#2C1F17]">
                    Total Harga (Rp) :
                  </td>
                  <td className="py-3 text-right font-serif font-bold text-lg text-[#A85842]">
                    {formatRupiah(invoice.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Store Signature */}
          <div className="pt-6 mt-4 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <div className="text-center sm:text-left">
              <p className="font-serif italic text-sm text-[#7A5239]">
                “Thank you for ordering with Tov’s Fleur!”
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Rangkaian bunga dirangkai penuh kasih dan ketelitian.
              </p>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] font-bold text-[#2C1F17] block">
                Tov’s Fleur Florist Team
              </span>
              <span className="text-[10px] text-zinc-400">
                Medan & Lubuk Pakam, Sumatera Utara
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar (Hidden when printing) */}
        <div className="no-print px-6 py-3.5 bg-[#FAF6F0] border-t border-[#EADBCE] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#7A5239] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim WA</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
