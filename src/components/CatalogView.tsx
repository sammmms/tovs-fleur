'use strict';
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ExternalLink, 
  Eye, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft,
  X,
  FileText
} from 'lucide-react';
import { CATALOG_ITEMS, BRAND } from '@/lib/constants';
import { CatalogItem } from '@/types';

interface CatalogViewProps {
  onBackToBio: () => void;
  onSelectCategoryForOrder: (cat: CatalogItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onBackToBio,
  onSelectCategoryForOrder,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<CatalogItem | null>(null);

  // Convert Google Drive view URL to preview/embed URL
  const getEmbedUrl = (url: string) => {
    return url.replace('/view?usp=drive_link', '/preview');
  };

  const getWaUrlForCategory = (item: CatalogItem) => {
    const text = encodeURIComponent(
      `Halo Tov’s Fleur! 🌸 Saya tertarik melihat katalog *${item.title}*. Boleh tanya ketersediaan dan rekomendasinya?`
    );
    return `https://api.whatsapp.com/send?phone=${BRAND.whatsappRaw}&text=${text}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBackToBio}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7A5239] hover:text-[#A85842] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Bio Card</span>
        </button>
      </div>

      {/* Main Container - Card Style Inspired by Image 2 */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-lg border border-[#EADBCE] text-center relative overflow-hidden">
        {/* Top Round Badge Logo */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#D8C3B1] p-1 bg-[#F5ECE1] shadow-xs">
            <Image
              src="/logo.png"
              alt="Tov's Fleur Logo"
              width={130}
              height={130}
              className="w-full h-full object-contain rounded-full"
              priority
            />
          </div>

          <span className="text-[11px] uppercase tracking-[0.3em] text-[#7A5239] font-bold mt-4">
            PRICELIST & CATALOG
          </span>

          <h2 className="font-serif italic text-2xl sm:text-3xl text-[#2C1F17] mt-1 font-medium">
            Choose based on your preferences 💖
          </h2>

          <p className="text-xs text-[#7A5239] max-w-md mx-auto mt-2">
            Klik nama koleksi di bawah untuk membuka file PDF Pricelist resmi dari Google Drive, atau langsung hubungi kami via WhatsApp.
          </p>
        </div>

        {/* 5 Categories List - Matching Image 2 Style with Rich Features */}
        <div className="mt-8 space-y-4 max-w-xl mx-auto">
          {CATALOG_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className="group p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] hover:bg-[#F5ECE1] border border-[#EADBCE] transition-all hover:shadow-md text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EADBCE] text-[#7A5239] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <a
                    href={item.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif italic text-lg sm:text-xl font-medium text-[#2C1F17] underline decoration-[#C48B71] underline-offset-4 hover:text-[#A85842] transition-colors"
                  >
                    {item.title}
                  </a>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#7A5239] border border-[#EADBCE]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-[#6B4E3D] pl-8">
                  {item.tagline}
                </p>
              </div>

              {/* Actions for each item */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Preview in modal */}
                <button
                  onClick={() => setSelectedPreview(item)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#7A5239] border border-[#D8C3B1] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Lihat Pratinjau PDF"
                >
                  <Eye className="w-3.5 h-3.5 text-[#A85842]" />
                  <span className="hidden xs:inline">Preview</span>
                </button>

                {/* Open Drive Link */}
                <a
                  href={item.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Buka File Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka PDF</span>
                </a>

                {/* Direct Order WA */}
                <a
                  href={getWaUrlForCategory(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Tanya Koleksi Ini"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pesan</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Catalog Note */}
        <div className="mt-8 pt-6 border-t border-[#EADBCE] text-xs text-[#7A5239] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A85842]" />
            Harga dapat menyesuaikan request bunga khusus & custom wrapping
          </span>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A85842] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Hubungi WhatsApp Tov’s Fleur</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Google Drive PDF In-App Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#D8C3B1]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#FAF6F0] border-b border-[#EADBCE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A85842]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2C1F17]">
                    {selectedPreview.title}
                  </h3>
                  <p className="text-[11px] text-[#7A5239]">
                    Katalog Resmi Google Drive
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPreview.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#7A5239] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#5C3D2E]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>

                <button
                  onClick={() => setSelectedPreview(null)}
                  className="p-1.5 rounded-full hover:bg-[#EADBCE]/50 text-[#7A5239] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Google Drive Preview iframe */}
            <div className="flex-1 bg-zinc-100 relative">
              <iframe
                src={getEmbedUrl(selectedPreview.driveUrl)}
                className="w-full h-full border-none"
                title={selectedPreview.title}
                allow="autoplay"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF6F0] border-t border-[#EADBCE] flex items-center justify-between">
              <p className="text-xs text-[#7A5239]">
                Punya pertanyaan tentang model buket ini?
              </p>
              <a
                href={getWaUrlForCategory(selectedPreview)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
