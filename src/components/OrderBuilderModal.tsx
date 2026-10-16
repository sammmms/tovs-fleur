'use strict';
'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Flower2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Heart,
  Palette
} from 'lucide-react';
import { OrderFormValues, FlowerType, BouquetSize } from '@/types';
import { generateOrderWhatsAppUrl } from '@/lib/storage';
import { ConfirmModal } from './ConfirmModal';

interface OrderBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: FlowerType;
}

export const OrderBuilderModal: React.FC<OrderBuilderModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Fresh Flowers',
}) => {
  const [form, setForm] = useState<OrderFormValues>({
    customerName: '',
    customerPhone: '',
    recipientName: '',
    flowerCategory: defaultCategory,
    size: 'M',
    colorScheme: 'Soft Pink & Cream',
    notes: '',
    greetingCard: '',
    deliveryDate: '',
    location: 'Medan',
  });
  const [validationAlert, setValidationAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) {
      setValidationAlert('Mohon isi nama Anda terlebih dahulu sebelum mengirim pesanan ke WhatsApp!');
      return;
    }
    const url = generateOrderWhatsAppUrl(form);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[84vh] max-h-[620px] flex flex-col shadow-2xl border border-[#D8C3B1] overflow-hidden animate-in fade-in relative">
        {/* Header */}
        <div className="shrink-0 px-6 py-3.5 bg-[#FAF6F0] border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EADBCE] flex items-center justify-center text-[#7A5239]">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1F17]">
                Pesan Buket Custom
              </h3>
              <p className="text-[11px] text-[#7A5239]">
                Pemesanan resmi langsung terhubung ke WhatsApp Tov’s Fleur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EADBCE]/60 text-[#7A5239] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Customer & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Nama Anda (Pemesan) *
              </label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                placeholder="cth: Samuel Onasis"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Nomor WhatsApp Anda
              </label>
              <input
                type="text"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                placeholder="0812..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Nama Penerima Buket
            </label>
            <input
              type="text"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
              placeholder="cth: Naomi Prisella, S. Kom."
            />
          </div>

          {/* Category & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Kategori Pilihan
              </label>
              <select
                value={form.flowerCategory}
                onChange={(e) => setForm({ ...form, flowerCategory: e.target.value as FlowerType })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
              >
                <option value="Fresh Flowers">Fresh Flowers (Bunga Segar)</option>
                <option value="Artificial">Artificial Flowers (Wisuda / Awet)</option>
                <option value="Preserved">Preserved Flowers</option>
                <option value="Glass Dome">Glass Dome (Kubah Kaca)</option>
                <option value="Bloom Box">Bloom Box (Kotak Bunga)</option>
                <option value="Modifikasi Uang">Buket Uang (Money Bouquet)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Ukuran Buket
              </label>
              <select
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value as BouquetSize })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
              >
                <option value="S">Small (S)</option>
                <option value="M">Medium (M - Standar)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="Custom">Custom Request</option>
              </select>
            </div>
          </div>

          {/* Color & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Preferensi Warna
              </label>
              <input
                type="text"
                value={form.colorScheme}
                onChange={(e) => setForm({ ...form, colorScheme: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
                placeholder="Pink, White/Blue, Red, Earthy..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                Lokasi Pengantaran / Ambil
              </label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
              >
                <option value="Medan">Kota Medan (Pick-up / Delivery)</option>
                <option value="Lubuk Pakam">Lubuk Pakam (L.Pakam)</option>
                <option value="Luar Kota">Luar Kota (Khusus Preserved / Dried)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Tanggal Diperlukan
            </label>
            <input
              type="text"
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
              placeholder="cth: Besok pagi jam 10.00 WIB / 15 Oktober 2026"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Pesan untuk Kartu Ucapan
            </label>
            <textarea
              rows={2}
              value={form.greetingCard}
              onChange={(e) => setForm({ ...form, greetingCard: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none font-serif"
              placeholder="Tulis pesan untuk disematkan di buket..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Catatan Khusus Bunga
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
              placeholder="cth: Hindari rose romantis, mau bunga ramai baby breath..."
            />
            </div>
          </div>

          {/* Sticky Submit Footer */}
          <div className="shrink-0 p-4 bg-[#FAF6F0] border-t border-[#EADBCE] space-y-1.5">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Format Pesanan ke WhatsApp Tov’s Fleur</span>
            </button>
            <p className="text-[10px] text-zinc-400 text-center">
              WhatsApp otomatis terbuka dengan rincian yang sudah rapi terformat.
            </p>
          </div>
        </form>
      </div>

      {/* Custom Designed Validation Alert Modal */}
      {validationAlert && (
        <ConfirmModal
          isOpen={!!validationAlert}
          type="alert"
          title="Informasi Diperlukan"
          message={validationAlert}
          confirmText="Mengerti"
          onConfirm={() => setValidationAlert(null)}
          onCancel={() => setValidationAlert(null)}
        />
      )}
    </div>
  );
};
