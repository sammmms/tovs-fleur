'use strict';
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  MessageCircle, 
  Sparkles, 
  Heart, 
  MapPin, 
  Clock, 
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  Flower2
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface BioCardViewProps {
  onGoToCatalog: () => void;
  onGoToInvoice: () => void;
  onOpenOrderModal: () => void;
}

export const BioCardView: React.FC<BioCardViewProps> = ({
  onGoToCatalog,
  onGoToInvoice,
  onOpenOrderModal,
}) => {
  const [openStatus, setOpenStatus] = React.useState(true);

  React.useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const hour = now.getHours();
    setOpenStatus(day !== 0 && hour >= 8 && hour < 18);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-3 sm:px-4">
      {/* Background ambient decorative shapes */}
      <div className="relative w-full max-w-md">
        {/* The Card - Matching Milkshake Aesthetic from Image 1 */}
        <div className="relative bg-[#D5C2B1]/35 rounded-[38px] p-4 sm:p-6 shadow-xl border border-[#D5C2B1]/80 overflow-hidden backdrop-blur-xs">
          {/* Subtle inner floral background overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-[#F5ECE1]/90 via-[#FAF6F0]/95 to-[#EDE4D8]/90 -z-10" />

          {/* Top Info Header */}
          <div className="text-center pt-2 pb-4">
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#7A5239] font-bold px-3 py-1 rounded-full bg-[#EADBCE]/80 border border-[#D8C3B1]/60 mb-2">
              Boutique Florist
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.12em] text-[#2C1F17] underline decoration-[#C48B71] underline-offset-8">
              TOVS.FLEUR
            </h2>
            
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A5239] font-medium mt-3">
              <MapPin className="w-3.5 h-3.5 text-[#A85842]" />
              <span>Based in Medan & L.Pakam</span>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-[11px] font-medium text-[#4A3528] border border-[#EADBCE]">
                <Clock className="w-3 h-3 text-[#7A5239]" />
                <span>Mon - Sat 08.00 - 18.00</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                openStatus 
                  ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100/90 text-amber-800 border border-amber-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${openStatus ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                {openStatus ? 'Buka Sekarang' : 'Buka 08.00 WIB'}
              </span>
            </div>
          </div>

          {/* Centerpiece: Logo Image with Floral Script Typography (Image 3) */}
          <div className="my-3 flex flex-col items-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-md border-2 border-[#D8C3B1]/90 bg-[#FAF6F0] p-1 flex items-center justify-center group hover:scale-[1.02] transition-transform">
              <Image
                src="/logo.png"
                alt="Tov's Fleur Script Brand"
                width={200}
                height={200}
                className="w-full h-full object-contain"
                priority
              />
              <div className="absolute inset-0 bg-radial from-transparent to-[#EDE4D8]/20 pointer-events-none" />
            </div>
            <p className="font-serif italic text-xs text-[#7A5239] mt-2.5 tracking-wide text-center">
              “Share some blooms and happiness 🌸✨”
            </p>
          </div>

          {/* Action Link Buttons - Matching Image 1 Button Style */}
          <div className="space-y-3 px-2 sm:px-4 mt-4">
            {/* WhatsApp Button */}
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#2C1F17] hover:bg-[#FAF6F0] shadow-sm hover:shadow-md border border-[#EADBCE] font-medium text-sm sm:text-base flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  💌
                </span>
                <span className="font-semibold text-[#3C2A20]">Whatsapp</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A47551] group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Pricelist / Catalog Button */}
            <button
              onClick={onGoToCatalog}
              className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#2C1F17] hover:bg-[#FAF6F0] shadow-sm hover:shadow-md border border-[#EADBCE] font-medium text-sm sm:text-base flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-lg">
                  💖
                </span>
                <span className="font-semibold text-[#3C2A20]">Pricelist & Katalog</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#A85842] bg-[#F5ECE1] px-2 py-0.5 rounded-full">
                  5 Koleksi
                </span>
                <ChevronRight className="w-4 h-4 text-[#A47551] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* TikTok Button */}
            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#2C1F17] hover:bg-[#FAF6F0] shadow-sm hover:shadow-md border border-[#EADBCE] font-medium text-sm sm:text-base flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center text-lg">
                  ✨
                </span>
                <span className="font-semibold text-[#3C2A20]">Tiktok</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#7A5239]">
                <span>{BRAND.tiktokHandle}</span>
                <ChevronRight className="w-4 h-4 text-[#A47551] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Interactive Order Builder CTA */}
            <button
              onClick={onOpenOrderModal}
              className="w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-[#8B5E3C] to-[#6B4E3D] text-[#FAF6F0] shadow-md hover:shadow-lg font-semibold text-sm sm:text-base flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Flower2 className="w-5 h-5 text-amber-200 animate-spin-slow" />
                <span>Format Order Buket Custom</span>
              </div>
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:scale-125 transition-transform" />
            </button>
          </div>

          {/* Social Media Circular Icons (Instagram & TikTok) */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[#D8C3B1]/60">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#7A5239] hover:text-[#A85842] flex items-center justify-center shadow-xs border border-[#EADBCE] transition-all hover:scale-110"
              title="Instagram @tovs.fleur"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#7A5239] hover:text-[#2C1F17] flex items-center justify-center shadow-xs border border-[#EADBCE] transition-all hover:scale-110"
              title="TikTok @tovs.fleur1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.81c1.23.88 2.73 1.4 4.35 1.45V6.75a4.8 4.8 0 0 1-.44-.06z"/>
              </svg>
            </a>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-emerald-600 flex items-center justify-center shadow-xs border border-[#EADBCE] transition-all hover:scale-110"
              title="Chat WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Quick Florist Admin Tools Shortcut */}
          <div className="mt-5 p-3 rounded-2xl bg-[#EADBCE]/50 border border-[#D8C3B1]/50 text-center">
            <p className="text-[11px] text-[#7A5239] font-medium mb-1.5">
              👑 Menu Khusus Pemilik & Florist Tov’s Fleur:
            </p>
            <button
              onClick={onGoToInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#7A5239] text-xs font-semibold hover:bg-[#FAF6F0] shadow-2xs border border-[#D8C3B1] cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#A85842]" />
              <span>Ganti Excel Manual ➔ Buat Invoice Cepat</span>
            </button>
          </div>
        </div>

        {/* Product Specialties pill footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#7A5239] font-medium">
            Available: Fresh Flowers • Artificial • Preserved • Glass Dome • Bloom Box
          </p>
        </div>
      </div>
    </div>
  );
};
