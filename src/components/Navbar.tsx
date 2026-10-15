'use strict';
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  Layers, 
  Printer, 
  Download,
  PlusCircle,
  MessageCircle
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface NavbarProps {
  activeTab: 'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards';
  setActiveTab: (tab: 'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards') => void;
  onOpenOrderModal: () => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenOrderModal,
  deferredPrompt,
  onInstallPwa,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#EADBCE]/80 no-print transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('bio')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#D8C3B1] shadow-xs group-hover:scale-105 transition-transform bg-[#EDE4D8]">
            <Image
              src="/logo.png"
              alt="Tov's Fleur Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg sm:text-2xl tracking-wide text-[#2C1F17] flex items-center gap-1.5 leading-none">
              <span>TOV’S FLEUR</span>
              <span className="text-[#A85842] text-xs sm:text-sm font-sans font-normal px-2 py-0.5 rounded-full bg-[#EADBCE]/60">
                Florist
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-[#7A5239] font-medium tracking-tight mt-0.5 hidden xs:block">
              {BRAND.location}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop / Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5EFEB] p-1.5 rounded-full border border-[#EADBCE]">
          <button
            onClick={() => setActiveTab('bio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'bio'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bio Link</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('create-invoice')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'create-invoice'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Daftar Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {deferredPrompt && (
            <button
              onClick={onInstallPwa}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] border border-[#7A5239] text-[#7A5239] hover:bg-[#EADBCE]/50 transition-colors"
              title="Install Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-linear-to-r from-[#A85842] to-[#7A5239] text-white shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pesan / Tanya WA</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#EADBCE]/60 bg-[#FAF6F0] px-2 py-2 overflow-x-auto text-[11px] font-medium text-[#7A5239]">
        <button
          onClick={() => setActiveTab('bio')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors ${
            activeTab === 'bio' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors ${
            activeTab === 'catalog' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('create-invoice')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors ${
            activeTab === 'create-invoice' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Inv</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors ${
            activeTab === 'invoices' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors ${
            activeTab === 'cards' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Kartu</span>
        </button>
      </div>
    </header>
  );
};
