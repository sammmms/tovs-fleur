# Tov's Fleur - Boutique Florist & Smart Invoice PWA

A modern, responsive Progressive Web App (PWA) designed specifically for **Tov's Fleur** (Boutique Florist based in Medan & Lubuk Pakam).

Built to replace manual Excel invoices, automate WhatsApp ordering, display official Google Drive pricelists, and print elegant florist bouquet greeting cards.

---

## ✨ Fitur Utama

1. **🌸 Link in Bio & Digital Storefront (Milkshake Reimagined)**
   - Desain kartu floral elegan khas Tov's Fleur.
   - Status operasional otomatis ("Buka Sekarang" / "Buka 08.00 WIB").
   - Akses cepat WhatsApp resmi, TikTok (`@tovs.fleur1`), dan Instagram (`@tovs.fleur`).
   - Tombol interaktif pembuatan format order buket custom langsung ke WhatsApp.

2. **📖 5 Katalog Google Drive Terintegrasi**
   - **Fresh flowers (Rose edition)**
   - **Fresh flowers**
   - **Artificial flowers**
   - **Glass dome**
   - **Bloom box**
   - Dilengkapi pratinjau in-app, link langsung ke Google Drive, dan tombol order WhatsApp untuk tiap kategori.

3. **🧾 Smart Invoice Generator (Pengganti Excel Manual)**
   - Buat faktur pesanan dalam hitungan detik dengan penomoran urut otomatis data-driven (`TF-YYYYMMDD-01`, dst.).
   - Itemized pricing (Bouquet, Boneka Wisuda, Biaya Modifikasi Buket Uang, Diskon, Ongkir).
   - Selector metode pembayaran 2 level (Transfer Bank BCA/Mandiri/BRI/CIMB/BSI/Permata, QRIS Resmi/E-Wallet, Tunai).
   - Selector jenis kelamin dengan kartu ikon interaktif (`👨 Laki-Laki` / `👩 Perempuan`).
   - Format cetak A4 resmi presisi dengan stylesheet print khusus dan tombol kembali.
   - Kirim rincian invoice langsung ke WhatsApp pemesan dengan 1 klik.

4. **📚 Batch Invoice Print (Gabungan Multi-Page 1 PDF)**
   - Pilih beberapa invoice sekaligus dengan fitur *"Pilih Semua"*.
   - Cetak langsung seluruh invoice terpilih ke dalam **1 file PDF multi-halaman** dengan pemisahan halaman cetak otomatis (`@media print page-break`).

5. **🖨️ Cetak Kartu Ucapan Buket Eksklusif (5 Preset Desain)**
   - Desain kartu ukuran buket bunga standar (10cm × 7cm) siap cetak.
   - 5 Preset tema elegan:
     1. 🎓 **Wisudatulation** (Black Gold Luxury)
     2. 🎂 **Happy Birthday** (Pastel Blush)
     3. 💖 **Romance & Anniversary** (Burgundy Rose)
     4. 🌿 **Congratulations / Opening** (Emerald Prestige)
     5. 🌸 **Tov's Signature Botanical** (Linen Minimalist)

6. **☁️ Database Cloud Supabase & Realtime Synchronization**
   - Terintegrasi penuh dengan **Supabase PostgreSQL**.
   - Realtime WebSocket updates: data tersinkronisasi instan antar HP owner & laptop kasir tanpa perlu refresh halaman.
   - Skrip migrasi SQL siap pakai di `supabase/schema.sql`.
   - Tetap offline-capable dengan auto-fallback ke LocalStorage saat internet terputus.

7. **🔒 Florist Admin Authentication**
   - Halaman publik (Bio Link & Katalog Drive) dapat diakses bebas oleh semua pelanggan.
   - Manajemen invoice dan pencetakan kartu dilindungi login florist admin.

8. **📱 Progressive Web App (PWA)**
   - Installable di Android, iOS (Add to Home Screen), dan Desktop.
   - Network-First Service Worker dengan caching offline.

---

## ⚙️ Variabel Lingkungan (.env.local)

Buat file `.env.local` atau masukkan di pengaturan Environment Variables Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ahxfeflxhpkxyfitarpn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_4B_NhAHs7HK8MAn9S9K0Vg_cbl0oKX8
```

---

## 🚀 Cara Menjalankan Lokal

```bash
# Masuk ke direktori
cd /Users/sam/tovs-fleur

# Install dependensi
bun install # atau npm install

# Jalankan server
bun run dev # atau npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚡ Cara Deploy ke Vercel (Online Langsung)

1. Repo sudah siap di GitHub: [https://github.com/sammmms/tovs-fleur](https://github.com/sammmms/tovs-fleur)
2. Buka [vercel.com](https://vercel.com) lalu klik **Add New Project**.
3. Import repo `sammmms/tovs-fleur`.
4. Tambahkan Environment Variables dari `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Klik **Deploy**! Web app langsung live dengan HTTPS gratis.
