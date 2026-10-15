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
   - Buat faktur pesanan dalam hitungan detik.
   - Itemized pricing (Bouquet, Boneka Wisuda, Biaya Modifikasi Buket Uang, Diskon, Ongkir).
   - Perhitungan total otomatis.
   - Sudah terisi 3 data sampel pesanan nyata dari Samuel Onasis (Naomi Prisella, Flarenshya Clearesta, Giovanny Halimko).
   - Format cetak A4 resmi presisi dengan stylesheet print khusus.
   - Kirim rincian invoice langsung ke WhatsApp pemesan dengan 1 klik.

4. **🖨️ Cetak Kartu Ucapan Buket (Florist Utility)**
   - Cetak kartu ucapan mini standar buket bunga (Wisudatulation, Happy Birthday, Anniversary, Congratulation).
   - Desain ornamen floral elegan siap gunting/pasang di kartu holder.

5. **📱 Progressive Web App (PWA)**
   - Installable di Android, iOS (Add to Home Screen), dan Desktop.
   - Offline-capable dengan Service Worker & LocalStorage.

---

## 🚀 Cara Menjalankan Lokal

```bash
# Masuk ke direktori
cd /Users/sam/tovs-fleur

# Jalankan server
bun run start -p 3000
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚡ Cara Deploy Cepat (Gratis & Langsung Online)

### Opsi 1: Vercel (Paling Direkomendasikan - 2 Menit)
1. Push repository ini ke GitHub:
   ```bash
   git remote add origin https://github.com/<username>/tovs-fleur.git
   git branch -M main
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) lalu klik **Add New Project**.
3. Import repo `tovs-fleur` dan klik **Deploy**. Web app langsung online dengan HTTPS gratis!

### Opsi 2: Vercel CLI Langsung dari Terminal
```bash
npx vercel
```
Ikuti petunjuk di terminal, project akan langsung ter-deploy dalam beberapa detik.
