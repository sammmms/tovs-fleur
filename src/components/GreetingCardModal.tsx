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
  X
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

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
  const [headline, setHeadline] = useState('Wisudatulation');
  const [recipient, setRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState('Semoga ilmunya berkah dan sukses selalu menanti di langkah selanjutnya! ✨');
  const [sender, setSender] = useState('Samuel Onasis');
  const [cardStyle, setCardStyle] = useState<'botanical' | 'minimalist' | 'luxury'>('botanical');

  const applyPreset = (head: string, msg: string) => {
    setHeadline(head);
    setMessage(msg);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE] no-print">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A85842]">
            Florist Utility
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1F17] mt-0.5">
            Cetak Kartu Ucapan Buket
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5239]">
            Format kartu ucapan kecil estetik siap cetak untuk disematkan pada buket Tov’s Fleur.
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Kartu Sekarang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-white rounded-2xl p-5 border border-[#EADBCE] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#2C1F17]">
              Pilih Template Ucapan
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('Wisudatulation', 'Selamat atas kelulusanmu! Sukses selalu dalam karier dan masa depan.')}
                className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-left text-xs text-[#6B4E3D] font-medium border border-[#D8C3B1] flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#A85842]" />
                <span>Wisuda</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('Happy Birthday!', 'May your special day be filled with happiness, love, and wonderful blooms!')}
                className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-left text-xs text-[#6B4E3D] font-medium border border-[#D8C3B1] flex items-center gap-2 cursor-pointer"
              >
                <Cake className="w-4 h-4 text-pink-500" />
                <span>Ulang Tahun</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('Happy Anniversary', 'Thank you for every second of love. Cheers to forever together!')}
                className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-left text-xs text-[#6B4E3D] font-medium border border-[#D8C3B1] flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Anniversary</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('Congratulations!', 'Warmest congratulations on your wonderful achievement! So proud of you.')}
                className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBCE] text-left text-xs text-[#6B4E3D] font-medium border border-[#D8C3B1] flex items-center gap-2 cursor-pointer"
              >
                <PartyPopper className="w-4 h-4 text-amber-500" />
                <span>Selamat / Sukses</span>
              </button>
            </div>

            <div className="pt-2 space-y-2.5">
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
                  rows={3}
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
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Card Physical Container (10cm x 7cm ratio) */}
          <div
            id="printable-greeting-card"
            className="w-full max-w-md aspect-[1.4/1] rounded-2xl bg-white border-4 border-[#D8C3B1] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden text-center"
          >
            {/* Ornamental Corners */}
            <div className="absolute top-2 left-2 text-[#C48B71]/60 text-xs select-none">❧</div>
            <div className="absolute top-2 right-2 text-[#C48B71]/60 text-xs select-none">☙</div>
            <div className="absolute bottom-2 left-2 text-[#C48B71]/60 text-xs select-none">☙</div>
            <div className="absolute bottom-2 right-2 text-[#C48B71]/60 text-xs select-none">❧</div>

            {/* Inner Border */}
            <div className="absolute inset-3 border border-[#EADBCE] rounded-xl pointer-events-none" />

            {/* Card Header with small logo */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D8C3B1] mb-1">
                <Image
                  src="/logo.png"
                  alt="Tov's Fleur Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif tracking-[0.25em] text-[10px] uppercase text-[#7A5239] font-bold">
                TOV’S FLEUR
              </span>
            </div>

            {/* Center Content */}
            <div className="my-auto py-2 space-y-1">
              <h4 className="font-serif italic text-2xl sm:text-3xl text-[#2C1F17] font-semibold leading-tight">
                {headline}
              </h4>
              <p className="font-sans font-bold text-sm sm:text-base text-[#A85842] tracking-wide">
                {recipient}
              </p>
              {message && (
                <p className="font-serif text-xs sm:text-sm text-[#4A3528] italic max-w-xs mx-auto px-2 line-clamp-3">
                  "{message}"
                </p>
              )}
            </div>

            {/* Card Footer */}
            <div className="text-right pr-2">
              {sender && (
                <p className="text-[11px] text-[#7A5239] font-medium italic">
                  With Love, <span className="font-semibold not-italic">{sender}</span>
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-[#7A5239] mt-3 no-print">
            📏 Ukuran kartu standar buket bunga. Klik tombol cetak untuk mencetak langsung.
          </p>
        </div>
      </div>
    </div>
  );
};
