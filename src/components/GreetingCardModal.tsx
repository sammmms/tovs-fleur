'use strict';
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Printer, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Cake, 
  PartyPopper,
  Flower2,
  X,
  Palette
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

type CardTheme = 'minimalist' | 'graduation' | 'birthday' | 'romance' | 'congratulations' | 'botanical';

interface GreetingCardModalProps {
  initialGreeting?: string;
  initialRecipient?: string;
  onClose?: () => void;
}

export const GreetingCardModal: React.FC<GreetingCardModalProps> = ({
  initialGreeting = 'Wisudatulation\nNaomi Prisella, S. Kom.',
  initialRecipient = 'Naomi Prisella, S. Kom.',
  onClose,
}) => {
  const [theme, setTheme] = useState<CardTheme>('minimalist');
  const [headline, setHeadline] = useState('Wisudatulation');
  const [recipient, setRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState('Semoga ilmunya berkah dan sukses selalu menanti di langkah selanjutnya! ✨');
  const [sender, setSender] = useState('Samuel Onasis');

  const applyPreset = (
    thm: CardTheme,
    head: string, 
    msg: string
  ) => {
    setTheme(thm);
    setHeadline(head);
    setMessage(msg);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="greeting-card-modal-root w-full max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE] no-print">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A85842]">
            Florist Utility
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1F17] mt-0.5">
            Cetak Kartu Ucapan Buket Eksklusif
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5239]">
            Pilih tema estetik untuk disematkan di buket Tov’s Fleur. Otomatis hemat tinta printer dengan format kartu buket (10cm × 7cm).
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Kartu Sekarang</span>
        </button>
      </div>

      {/* Ink Saving Notice */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs no-print">
        <span className="text-base shrink-0">🖨️</span>
        <div className="leading-relaxed">
          <strong>Mode Cetak Hemat Tinta:</strong> Saat dicetak ke printer, background gelap/warna otomatis diubah menjadi <strong>putih bersih (Zero Ink Waste)</strong> dengan ukuran standar buket bunga <strong>10 cm × 7 cm</strong> dan panduan garis potong rapi tanpa buang-buang tinta printer.
        </div>
      </div>

      <div className="greeting-card-modal-grid grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {/* Editor Form (5 Cols) */}
        <div className="md:col-span-5 space-y-4 no-print">
          <div className="bg-white rounded-2xl p-5 border border-[#EADBCE] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#2C1F17] flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#A85842]" />
              <span>1. Pilih Tema & Preset Momen</span>
            </h3>
            
            {/* Presets */}
            <div className="space-y-2">
              {/* Minimalist Putih (Hemat Tinta / Karton Putih) */}
              <button
                type="button"
                onClick={() => applyPreset('minimalist', 'Especially For You', 'Semoga hari-harimu selalu bahagia dan penuh kehangatan.')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'minimalist'
                    ? 'border-[#7A5239] bg-white text-[#2C1F17] shadow-xs ring-2 ring-[#7A5239]/20'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">🖨️</span>
                  <div>
                    <span className="block font-bold">Minimalist Putih (Hemat Tinta)</span>
                    <span className="text-[10px] opacity-80 font-normal">Karton Putih • Garis Elegan • Zero Ink Waste</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#7A5239]" />
              </button>

              {/* Graduation */}
              <button
                type="button"
                onClick={() => applyPreset('graduation', 'Wisudatulation', 'Selamat atas kelulusanmu! Sukses selalu dalam karier dan karya terbaikmu.')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'graduation'
                    ? 'border-zinc-800 bg-zinc-900 text-amber-200 shadow-xs'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300">🎓</span>
                  <div>
                    <span className="block font-bold">Wisudatulation (Graduation)</span>
                    <span className="text-[10px] opacity-80 font-normal">Black Gold Luxury • Crest Mahasiswa</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>

              {/* Birthday */}
              <button
                type="button"
                onClick={() => applyPreset('birthday', 'Happy Birthday!', 'May your birthday bloom with joy, radiant laughter, and unforgettable moments!')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'birthday'
                    ? 'border-pink-400 bg-pink-50 text-pink-900 shadow-xs'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-pink-100 text-pink-500">🎂</span>
                  <div>
                    <span className="block font-bold">Happy Birthday (Ulang Tahun)</span>
                    <span className="text-[10px] opacity-80 font-normal">Pastel Blush • Floral Confetti</span>
                  </div>
                </div>
                <Cake className="w-4 h-4 text-pink-500" />
              </button>

              {/* Romance & Anniversary */}
              <button
                type="button"
                onClick={() => applyPreset('romance', 'Happy Anniversary', 'Every moment with you is my favorite memory. Cheers to our everlasting love!')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'romance'
                    ? 'border-rose-700 bg-[#3D141E] text-rose-100 shadow-xs'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-rose-200/20 text-rose-300">💖</span>
                  <div>
                    <span className="block font-bold">Romance & Anniversary</span>
                    <span className="text-[10px] opacity-80 font-normal">Burgundy Rose • Elegant Filigree</span>
                  </div>
                </div>
                <Heart className="w-4 h-4 text-rose-300" />
              </button>

              {/* Congratulations */}
              <button
                type="button"
                onClick={() => applyPreset('congratulations', 'Congratulations!', 'Warmest congratulations on your wonderful achievement! Wishing you continuous success.')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'congratulations'
                    ? 'border-emerald-800 bg-[#0E2C22] text-emerald-100 shadow-xs'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-emerald-200/20 text-emerald-300">🎉</span>
                  <div>
                    <span className="block font-bold">Congratulations / Opening</span>
                    <span className="text-[10px] opacity-80 font-normal">Emerald Prestige • Laurel Border</span>
                  </div>
                </div>
                <PartyPopper className="w-4 h-4 text-emerald-300" />
              </button>

              {/* Botanical Minimalist */}
              <button
                type="button"
                onClick={() => applyPreset('botanical', 'Especially For You', 'Semoga hari-harimu selalu seindah bunga-bunga ini. Salam hangat penuh cinta.')}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'botanical'
                    ? 'border-[#7A5239] bg-[#EDE4D8] text-[#2C1F17] shadow-xs'
                    : 'border-[#D8C3B1] bg-[#FAF6F0] text-[#6B4E3D] hover:bg-[#EADBCE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-[#D8C3B1]/50 text-[#7A5239]">🌿</span>
                  <div>
                    <span className="block font-bold">Tov’s Signature Botanical</span>
                    <span className="text-[10px] opacity-80 font-normal">Linen Minimalist • Olive Branch</span>
                  </div>
                </div>
                <Flower2 className="w-4 h-4 text-[#7A5239]" />
              </button>
            </div>

            <div className="pt-2 space-y-2.5 border-t border-[#F5ECE1]">
              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Judul Ucapan
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8C3B1] text-xs font-serif"
                  placeholder="Wisudatulation"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8C3B1] text-xs font-semibold"
                  placeholder="Naomi Prisella, S. Kom."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Pesan Khusus
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8C3B1] text-xs"
                  placeholder="Tulis ucapan..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
                  Nama Pengirim (From)
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8C3B1] text-xs"
                  placeholder="Samuel Onasis"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Card Preview (7 Cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center greeting-card-print-area">
          <div className="print-card-wrapper w-full flex flex-col items-center justify-center">
            {/* Cutting Guide Line (Print Only) */}
            <div className="print-only print-cutting-guide">
              ✂ - - - - - - - - - - Garis Potong Kartu Buket Tov’s Fleur (10 cm × 7 cm) - - - - - - - - - - ✂
            </div>

            {/* Card Frame based on Theme */}
            <div
              id="printable-greeting-card"
              className={`w-full max-w-md aspect-[1.4/1] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden text-center transition-all ${
                theme === 'minimalist'
                  ? 'bg-white text-[#2C1F17] border-4 border-[#7A5239]'
                  : theme === 'graduation'
                  ? 'bg-zinc-950 text-white border-4 border-amber-400'
                  : theme === 'birthday'
                  ? 'bg-gradient-to-br from-[#FFF5F7] via-[#FFF0F4] to-[#FFE8EE] text-[#4A202A] border-4 border-pink-300'
                  : theme === 'romance'
                  ? 'bg-gradient-to-br from-[#2D0A13] via-[#3B0E1B] to-[#25070F] text-rose-50 border-4 border-[#C48B71]'
                  : theme === 'congratulations'
                  ? 'bg-gradient-to-br from-[#07241B] via-[#0E3528] to-[#082018] text-emerald-50 border-4 border-amber-300'
                  : 'bg-[#FAF6F0] text-[#2C1F17] border-4 border-[#D8C3B1]'
              }`}
            >
              {/* Inner Border */}
              <div className={`card-inner-border absolute inset-2.5 rounded-xl pointer-events-none border ${
                theme === 'minimalist'
                  ? 'border-[#7A5239]/40 border-dashed'
                  : theme === 'graduation'
                  ? 'border-amber-400/40'
                  : theme === 'birthday'
                  ? 'border-pink-300/60'
                  : theme === 'romance'
                  ? 'border-[#C48B71]/40'
                  : theme === 'congratulations'
                  ? 'border-amber-300/40'
                  : 'border-[#D8C3B1]/80'
              }`} />

              {/* Corner Ornamental Accents */}
              <div className="card-flourish absolute top-2 left-2 text-xs select-none opacity-60">❦</div>
              <div className="card-flourish absolute top-2 right-2 text-xs select-none opacity-60">❧</div>
              <div className="card-flourish absolute bottom-2 left-2 text-xs select-none opacity-60">❧</div>
              <div className="card-flourish absolute bottom-2 right-2 text-xs select-none opacity-60">❦</div>

              {/* Top Logo Badge */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-current/30 p-0.5 bg-white/10 mb-0.5">
                  <Image
                    src="/logo.png"
                    alt="Tov's Fleur Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className={`card-brand-title font-serif tracking-[0.25em] text-[9px] uppercase font-bold ${
                  theme === 'minimalist' ? 'text-[#7A5239]' : theme === 'graduation' ? 'text-amber-300' : theme === 'birthday' ? 'text-pink-600' : theme === 'romance' ? 'text-rose-300' : theme === 'congratulations' ? 'text-amber-300' : 'text-[#7A5239]'
                }`}>
                  TOV’S FLEUR
                </span>
              </div>

              {/* Card Main Body */}
              <div className="my-auto py-1 space-y-1">
                <h4 className={`card-headline font-serif italic text-2xl sm:text-3xl font-bold leading-tight ${
                  theme === 'minimalist'
                    ? 'text-[#2C1F17]'
                    : theme === 'graduation'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100'
                    : theme === 'birthday'
                    ? 'text-pink-700'
                    : theme === 'romance'
                    ? 'text-rose-200'
                    : theme === 'congratulations'
                    ? 'text-amber-200'
                    : 'text-[#2C1F17]'
                }`}>
                  {headline}
                </h4>

                <p className={`card-recipient font-sans font-bold text-sm sm:text-base tracking-wide ${
                  theme === 'minimalist'
                    ? 'text-[#A85842]'
                    : theme === 'graduation'
                    ? 'text-amber-100'
                    : theme === 'birthday'
                    ? 'text-[#6A2B3D]'
                    : theme === 'romance'
                    ? 'text-white'
                    : theme === 'congratulations'
                    ? 'text-white'
                    : 'text-[#A85842]'
                }`}>
                  {recipient}
                </p>

                {message && (
                  <p className="card-message font-serif text-xs sm:text-sm italic max-w-xs mx-auto px-2 line-clamp-2 opacity-90">
                    "{message}"
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="card-sender text-right pr-2">
                {sender && (
                  <p className="text-[11px] font-medium italic opacity-85">
                    With Love, <span className="font-bold not-italic">{sender}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-[#7A5239] no-print">
            <p className="font-semibold">
              📏 Ukuran kartu standar buket bunga (10cm × 7cm).
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Siap cetak ke kertas karton/glossy untuk disematkan di pita buket.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
