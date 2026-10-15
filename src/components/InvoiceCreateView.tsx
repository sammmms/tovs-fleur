'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Tag,
  Palette
} from 'lucide-react';
import { 
  Invoice, 
  InvoiceItem, 
  Gender, 
  PaymentStatus, 
  FlowerType, 
  BouquetSize 
} from '@/types';
import { 
  saveInvoice, 
  getStoredInvoices, 
  generateInvoiceNumber, 
  getTodayFormattedIndonesian, 
  formatRupiah,
  generateInvoiceWhatsAppMessage 
} from '@/lib/storage';

interface InvoiceCreateViewProps {
  onInvoiceCreated: (invoice: Invoice, openPrint?: boolean) => void;
  editingInvoice?: Invoice | null;
  onCancelEdit?: () => void;
}

export const InvoiceCreateView: React.FC<InvoiceCreateViewProps> = ({
  onInvoiceCreated,
  editingInvoice,
  onCancelEdit,
}) => {
  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('LUNAS');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');

  const [customerName, setCustomerName] = useState('');
  const [customerGender, setCustomerGender] = useState<Gender>('Laki-Laki');
  const [customerPhone, setCustomerPhone] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientGender, setRecipientGender] = useState<Gender>('Perempuan');

  const [productName, setProductName] = useState('Artificial Graduation Bouquet (Custom Price)');
  const [flowerType, setFlowerType] = useState<FlowerType>('Artificial');
  const [size, setSize] = useState<BouquetSize>('M');

  const [colorScheme, setColorScheme] = useState('Pink');
  const [notes, setNotes] = useState('Skema Warna: Pink. Bunga: Hindari rose, fokus ke bunga ramai, kayak hyd, baby breath, pokonya hindari romantic.');
  const [greetingCard, setGreetingCard] = useState('Wisudatulation\nNaomi Prisella, S. Kom.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'Bouquet', price: 180000 },
    { id: '2', name: 'Graduation Doll (Coklat)', price: 50000 },
  ]);

  // Initialize or populate for editing
  useEffect(() => {
    if (editingInvoice) {
      setInvoiceNumber(editingInvoice.invoiceNumber);
      setOrderDate(editingInvoice.orderDate);
      setPaymentDate(editingInvoice.paymentDate);
      setPaymentStatus(editingInvoice.paymentStatus);
      setPaymentMethod(editingInvoice.paymentMethod || 'Transfer Bank');
      setCustomerName(editingInvoice.customerName);
      setCustomerGender(editingInvoice.customerGender);
      setCustomerPhone(editingInvoice.customerPhone || '');
      setRecipientName(editingInvoice.recipientName);
      setRecipientGender(editingInvoice.recipientGender);
      setProductName(editingInvoice.productName);
      setFlowerType(editingInvoice.flowerType);
      setSize(editingInvoice.size);
      setColorScheme(editingInvoice.colorScheme || '');
      setNotes(editingInvoice.notes || '');
      setGreetingCard(editingInvoice.greetingCard || '');
      setItems(editingInvoice.items || []);
    } else {
      const today = getTodayFormattedIndonesian();
      const existing = getStoredInvoices();
      setInvoiceNumber(generateInvoiceNumber(existing.length));
      setOrderDate(today);
      setPaymentDate(today);
    }
  }, [editingInvoice]);

  // Calculate total
  const totalAmount = items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Line item helpers
  const handleAddItem = (name: string = '', price: number = 0) => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random().toString(36).substr(2, 4), name, price },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Preset product helpers
  const applyProductPreset = (prodName: string, type: FlowerType, defaultItems: { name: string; price: number }[]) => {
    setProductName(prodName);
    setFlowerType(type);
    setItems(defaultItems.map((it, idx) => ({ id: `${idx + 1}`, name: it.name, price: it.price })));
  };

  const handleSave = (openPrint: boolean = false, sendWa: boolean = false) => {
    if (!customerName.trim()) {
      alert('Mohon isi Nama Pemesan!');
      return;
    }

    const invoiceData: Invoice = {
      id: editingInvoice ? editingInvoice.id : invoiceNumber,
      invoiceNumber: invoiceNumber.trim() || `TF-${Date.now().toString().slice(-6)}`,
      orderDate: orderDate.trim() || getTodayFormattedIndonesian(),
      paymentDate: paymentDate.trim() || getTodayFormattedIndonesian(),
      paymentStatus,
      paymentMethod,
      customerName: customerName.trim(),
      customerGender,
      customerPhone: customerPhone.trim(),
      recipientName: recipientName.trim(),
      recipientGender,
      productName: productName.trim(),
      flowerType,
      size,
      colorScheme: colorScheme.trim(),
      notes: notes.trim(),
      greetingCard: greetingCard.trim(),
      items,
      totalAmount,
      createdAt: editingInvoice ? editingInvoice.createdAt : Date.now(),
    };

    saveInvoice(invoiceData);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A85842', '#C48B71', '#7A5239', '#F5ECE1'],
      });
    } catch (e) {}

    if (sendWa) {
      const waMsg = generateInvoiceWhatsAppMessage(invoiceData);
      const targetPhone = customerPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
      const waUrl = targetPhone 
        ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${waMsg}`
        : `https://api.whatsapp.com/send?text=${waMsg}`;
      window.open(waUrl, '_blank');
    }

    onInvoiceCreated(invoiceData, openPrint);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EADBCE]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A85842]">
            {editingInvoice ? 'Mode Edit Invoice' : 'Generator Invoice Otomatis'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1F17] mt-0.5">
            {editingInvoice ? `Edit Invoice: ${editingInvoice.invoiceNumber}` : 'Buat Invoice Tov’s Fleur'}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5239]">
            Solusi praktis pengganti Excel manual. Lengkapi data pemesanan lalu simpan, cetak PDF, atau kirim ke WhatsApp.
          </p>
        </div>

        {editingInvoice && onCancelEdit && (
          <button
            onClick={onCancelEdit}
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-[#D8C3B1] text-xs font-semibold text-[#7A5239] hover:bg-[#EADBCE]/50 cursor-pointer"
          >
            Batal Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Data Invoice & Transaksi */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2C1F17] flex items-center gap-2 border-b border-[#F5ECE1] pb-2">
              <Tag className="w-4 h-4 text-[#A85842]" />
              <span>1. Informasi Faktur & Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nomor Invoice
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="TF-20261015-01"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Tanggal Pesan
                </label>
                <input
                  type="text"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="15 Oktober 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Tanggal Bayar
                </label>
                <input
                  type="text"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="15 Oktober 2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Status Pembayaran
                </label>
                <div className="flex gap-2">
                  {(['LUNAS', 'DP', 'PENDING'] as PaymentStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPaymentStatus(st)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        paymentStatus === st
                          ? st === 'LUNAS'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : st === 'DP'
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-[#FAF6F0] border-[#D8C3B1] text-[#7A5239] hover:bg-[#EADBCE]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                >
                  <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                  <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                  <option value="QRIS">QRIS Tov’s Fleur</option>
                  <option value="Tunai / Cash">Tunai / Cash</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Pemesan & Penerima */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2C1F17] flex items-center gap-2 border-b border-[#F5ECE1] pb-2">
              <Sparkles className="w-4 h-4 text-[#A85842]" />
              <span>2. Informasi Pemesan & Penerima</span>
            </h3>

            {/* Pemesan */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nama Pemesan *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="Samuel Onasis"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Gender Pemesan
                </label>
                <select
                  value={customerGender}
                  onChange={(e) => setCustomerGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
                >
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  No. WhatsApp Pemesan
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
                  placeholder="0812..."
                />
              </div>
            </div>

            {/* Penerima */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="Naomi Prisella, S. Kom."
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Gender Penerima
                </label>
                <select
                  value={recipientGender}
                  onChange={(e) => setRecipientGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Spesifikasi Produk & Bunga */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5ECE1] pb-2">
              <h3 className="font-serif font-bold text-base text-[#2C1F17] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#A85842]" />
                <span>3. Spesifikasi Bunga & Request Khusus</span>
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              <span className="text-[11px] font-semibold text-[#7A5239] self-center mr-1">
                Preset Cepat:
              </span>
              <button
                type="button"
                onClick={() =>
                  applyProductPreset('Artificial Graduation Bouquet (Custom Price)', 'Artificial', [
                    { name: 'Bouquet', price: 180000 },
                    { name: 'Graduation Doll (Coklat)', price: 50000 },
                  ])
                }
                className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#EADBCE] text-[11px] font-medium text-[#7A5239] border border-[#D8C3B1] cursor-pointer"
              >
                🎓 Buket Wisuda + Boneka (Rp 230k)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyProductPreset('Modifikasi Buket Uang', 'Artificial', [
                    { name: 'Biaya Modifikasi', price: 150000 },
                    { name: 'Diskon', price: -30000 },
                  ])
                }
                className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#EADBCE] text-[11px] font-medium text-[#7A5239] border border-[#D8C3B1] cursor-pointer"
              >
                💸 Buket Uang (Rp 120k)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyProductPreset('Fresh Rose Bouquet (Rose Edition)', 'Fresh Flowers', [
                    { name: 'Fresh Rose Bouquet (10 Stems)', price: 250000 },
                    { name: 'Baby Breath Filler', price: 35000 },
                  ])
                }
                className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#EADBCE] text-[11px] font-medium text-[#7A5239] border border-[#D8C3B1] cursor-pointer"
              >
                🌹 Fresh Rose Classic (Rp 285k)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                  placeholder="Artificial Graduation Bouquet"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Jenis Bunga
                </label>
                <select
                  value={flowerType}
                  onChange={(e) => setFlowerType(e.target.value as FlowerType)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
                >
                  <option value="Artificial">Artificial</option>
                  <option value="Fresh Flowers">Fresh Flowers</option>
                  <option value="Preserved">Preserved Flowers</option>
                  <option value="Glass Dome">Glass Dome</option>
                  <option value="Bloom Box">Bloom Box</option>
                  <option value="Modifikasi Uang">Modifikasi Uang</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Ukuran Buket
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as BouquetSize)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm bg-white focus:outline-none"
                >
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                  <option value="Custom">Custom Size</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Skema Warna
                </label>
                <input
                  type="text"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
                  placeholder="Pink / White/Blue / Red / Pastel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Catatan Pemesan / Preferensi Bunga
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
                  placeholder="Hindari rose, fokus ke bunga ramai, kayak hyd, baby breath..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#6B4E3D]">
                  Teks Kartu Ucapan
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setGreetingCard(`Wisudatulation\n${recipientName || 'Nama Penerima, S. Kom.'}`)}
                    className="text-[10px] text-[#A85842] hover:underline"
                  >
                    Template Wisuda
                  </button>
                  <span className="text-[#D8C3B1]">•</span>
                  <button
                    type="button"
                    onClick={() => setGreetingCard(`Happy Birthday!\nMay all your wishes come true.`)}
                    className="text-[10px] text-[#A85842] hover:underline"
                  >
                    Template Ulang Tahun
                  </button>
                </div>
              </div>
              <textarea
                rows={2}
                value={greetingCard}
                onChange={(e) => setGreetingCard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none font-serif"
                placeholder="Wisudatulation Naomi Prisella, S. Kom."
              />
            </div>
          </div>

          {/* Card 4: Perincian Harga (Itemized Line Items) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5ECE1] pb-2">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2C1F17]">
                  4. Perincian Harga (Rp)
                </h3>
                <p className="text-xs text-[#7A5239]">
                  Ketik nama barang dan nominal harga. Nilai negatif akan otomatis dihitung sebagai diskon.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddItem('', 0)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-xs font-semibold text-[#7A5239] border border-[#D8C3B1] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris</span>
              </button>
            </div>

            {/* Quick add chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAddItem('Bouquet', 180000)}
                className="px-2 py-1 rounded-md bg-[#FAF6F0] text-[11px] text-[#7A5239] hover:bg-[#EADBCE] border border-[#D8C3B1]"
              >
                + Bouquet (180k)
              </button>
              <button
                type="button"
                onClick={() => handleAddItem('Graduation Doll (Coklat)', 50000)}
                className="px-2 py-1 rounded-md bg-[#FAF6F0] text-[11px] text-[#7A5239] hover:bg-[#EADBCE] border border-[#D8C3B1]"
              >
                + Boneka Wisuda (50k)
              </button>
              <button
                type="button"
                onClick={() => handleAddItem('Biaya Modifikasi', 150000)}
                className="px-2 py-1 rounded-md bg-[#FAF6F0] text-[11px] text-[#7A5239] hover:bg-[#EADBCE] border border-[#D8C3B1]"
              >
                + Biaya Modifikasi (150k)
              </button>
              <button
                type="button"
                onClick={() => handleAddItem('Diskon', -30000)}
                className="px-2 py-1 rounded-md bg-rose-50 text-[11px] text-rose-700 hover:bg-rose-100 border border-rose-200"
              >
                - Diskon (-30k)
              </button>
              <button
                type="button"
                onClick={() => handleAddItem('Ongkir Medan', 20000)}
                className="px-2 py-1 rounded-md bg-[#FAF6F0] text-[11px] text-[#7A5239] hover:bg-[#EADBCE] border border-[#D8C3B1]"
              >
                + Ongkir Medan (20k)
              </button>
            </div>

            {/* Table */}
            <div className="space-y-2 mt-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]"
                >
                  <span className="w-5 text-center text-xs text-[#7A5239] font-bold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none"
                    placeholder="Nama Item (cth: Bouquet)"
                  />
                  <div className="w-32 sm:w-40 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-[#7A5239]">Rp</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(idx, 'price', Number(e.target.value))}
                      className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-white border border-[#D8C3B1] text-xs sm:text-sm text-right focus:outline-none font-medium"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            <div className="pt-3 border-t border-[#EADBCE] flex items-center justify-between text-sm sm:text-base font-bold text-[#2C1F17]">
              <span>Total Harga:</span>
              <span className="text-xl sm:text-2xl text-[#A85842] font-serif">
                Rp {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Preview & Actions Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FAF6F0] rounded-2xl p-5 border-2 border-[#D8C3B1] shadow-md sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBCE] pb-2">
              <span className="text-xs uppercase font-bold text-[#7A5239] tracking-wider">
                Pratinjau Ringkasan
              </span>
              <span className="text-[10px] bg-[#EADBCE] text-[#4A3528] px-2 py-0.5 rounded-full font-semibold">
                {invoiceNumber || 'DRAFT'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#4A3528]">
              <div className="flex justify-between">
                <span className="text-[#7A5239]">Pemesan:</span>
                <span className="font-semibold text-right">{customerName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239]">Penerima:</span>
                <span className="font-semibold text-right">{recipientName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239]">Produk:</span>
                <span className="font-semibold text-right max-w-[180px] truncate">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239]">Ukuran / Bunga:</span>
                <span className="font-semibold text-right">{size} / {flowerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5239]">Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  paymentStatus === 'LUNAS' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : paymentStatus === 'DP'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {paymentStatus}
                </span>
              </div>

              {greetingCard && (
                <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#EADBCE]">
                  <span className="text-[10px] uppercase font-bold text-[#A85842] block mb-0.5">
                    Kartu Ucapan:
                  </span>
                  <p className="font-serif italic text-xs text-[#2C1F17] whitespace-pre-line">
                    "{greetingCard}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-[#EADBCE] flex justify-between items-center text-sm font-bold">
                <span>Total:</span>
                <span className="text-base text-[#A85842] font-serif">
                  Rp {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {/* Save & Print PDF */}
              <button
                type="button"
                onClick={() => handleSave(true, false)}
                className="w-full py-3 px-4 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Simpan & Cetak PDF (A4)</span>
              </button>

              {/* Save & Send WA */}
              <button
                type="button"
                onClick={() => handleSave(false, true)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Simpan & Kirim ke WhatsApp</span>
              </button>

              {/* Only Save */}
              <button
                type="button"
                onClick={() => handleSave(false, false)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5ECE1] text-[#7A5239] border border-[#D8C3B1] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Hanya Simpan Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
