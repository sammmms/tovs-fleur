import { Invoice, OrderFormValues } from '@/types';
import { INITIAL_INVOICES, BRAND } from './constants';

const INVOICE_STORAGE_KEY = 'tovs_fleur_invoices_v1';

export function getStoredInvoices(): Invoice[] {
  if (typeof window === 'undefined') return INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_INVOICES;
  } catch (e) {
    console.error('Error reading stored invoices:', e);
    return INITIAL_INVOICES;
  }
}

export function saveInvoice(invoice: Invoice): Invoice[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredInvoices();
  const existsIndex = current.findIndex((item) => item.id === invoice.id);
  let updated: Invoice[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = invoice;
  } else {
    updated = [invoice, ...current];
  }
  localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteInvoice(id: string): Invoice[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredInvoices();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetToDefaultInvoices(): Invoice[] {
  if (typeof window === 'undefined') return INITIAL_INVOICES;
  localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
  return INITIAL_INVOICES;
}

export function formatRupiah(num: number): string {
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(abs);
  return isNegative ? `(${formatted})` : formatted;
}

export function getTodayFormattedIndonesian(): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

export function generateInvoiceNumber(existingCount: number = 0): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(existingCount + 1).padStart(2, '0');
  return `TF-${yyyy}${mm}${dd}-${seq}`;
}

export function generateInvoiceWhatsAppMessage(invoice: Invoice): string {
  const itemList = invoice.items
    .map(
      (item) =>
        `• ${item.name}: Rp ${formatRupiah(item.price)}`
    )
    .join('\n');

  return encodeURIComponent(
`🌸 *TOV’S FLEUR - INVOICE PESANAN* 🌸
=============================
*No. Invoice:* ${invoice.invoiceNumber}
*Tanggal Pesan:* ${invoice.orderDate}
*Status Pembayaran:* ${invoice.paymentStatus}
${invoice.paymentDate ? `*Tanggal Bayar:* ${invoice.paymentDate}\n` : ''}
*Pemesan:* ${invoice.customerName} (${invoice.customerGender})
*Penerima:* ${invoice.recipientName} (${invoice.recipientGender})
*Produk:* ${invoice.productName}
*Jenis Bunga:* ${invoice.flowerType} (Ukuran ${invoice.size})

📋 *Perincian Harga:*
${itemList}
-----------------------------
*Total Harga: Rp ${formatRupiah(invoice.totalAmount)}*

🏷️ *Skema Warna:* ${invoice.colorScheme || '-'}
💬 *Teks Kartu Ucapan:*
"${invoice.greetingCard || '-'}"

📝 *Catatan Pemesan:*
${invoice.notes || '-'}

=============================
Terima kasih telah mempercayakan momen spesial Anda bersama Tov’s Fleur! ✨
📍 Based in Medan & Lubuk Pakam`
  );
}

export function generateOrderWhatsAppUrl(order: OrderFormValues): string {
  const text = 
`Halo Tov’s Fleur! 🌸 Saya mau pesan bunga:

*Detail Pemesanan:*
• Nama Pemesan: ${order.customerName}
• No. WhatsApp: ${order.customerPhone || '-'}
• Nama Penerima: ${order.recipientName}
• Kategori Bunga: ${order.flowerCategory}
• Ukuran: ${order.size}
• Pilihan Skema Warna: ${order.colorScheme || '-'}
• Tanggal Pengiriman/Diambil: ${order.deliveryDate || '-'}
• Lokasi: ${order.location}

💌 *Teks Kartu Ucapan:*
"${order.greetingCard || '-'}"

📝 *Catatan Khusus:*
${order.notes || '-'}

Mohon info ketersediaan dan total perhitungannya ya. Terima kasih! ✨`;

  return `https://api.whatsapp.com/send?phone=${BRAND.whatsappRaw}&text=${encodeURIComponent(text)}`;
}
