'use strict';
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  Printer, 
  Download,
  PlusCircle,
  MessageCircle,
  Lock,
  LogOut
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface NavbarProps {
  activeTab: 'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards';
  setActiveTab: (tab: 'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards') => void;
  onOpenOrderModal: () => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
  isAuthenticated: boolean;
  onOpenLogin: () => void;
  onRequestLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenOrderModal,
  deferredPrompt,
  onInstallPwa,
  isAuthenticated,
  onOpenLogin,
  onRequestLogout,
}) => {
  const handleTabClick = (tab: 'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards') => {
    const isProtected = tab === 'create-invoice' || tab === 'invoices' || tab === 'cards';
    if (isProtected && !isAuthenticated) {
      onOpenLogin();
      return;
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EADBCE] shadow-2xs no-print transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('bio')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D8C3B1] shadow-2xs group-hover:scale-105 transition-transform bg-[#EDE4D8] shrink-0">
            <Image
              src="/logo.png"
              alt="Tov's Fleur Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-base sm:text-lg tracking-[0.08em] text-[#2C1F17]">
                TOV’S FLEUR
              </span>
              <span className="text-[#A85842] text-[9px] uppercase tracking-wider font-sans font-bold px-1.5 py-0.5 rounded-md bg-[#EADBCE]/70">
                Florist
              </span>
            </div>
            <p className="text-[10px] text-[#7A5239] font-medium tracking-tight mt-1 hidden sm:block">
              {BRAND.location}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop / Tablet Segmented Control - Single Row Horizontal) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F1EAE2] p-1 rounded-2xl border border-[#E2D5C8] shadow-inner/5 shrink-0">
          <button
            onClick={() => handleTabClick('bio')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-white text-[#2C1F17] font-bold shadow-xs border border-[#DFD1C4]'
                : 'text-[#6B4E3D] hover:text-[#2C1F17] hover:bg-white/60 font-medium'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'bio' ? 'text-[#A85842]' : 'text-[#7A5239]'}`} />
            <span>Bio Link</span>
          </button>

          <button
            onClick={() => handleTabClick('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-[#2C1F17] font-bold shadow-xs border border-[#DFD1C4]'
                : 'text-[#6B4E3D] hover:text-[#2C1F17] hover:bg-white/60 font-medium'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'catalog' ? 'text-[#A85842]' : 'text-[#7A5239]'}`} />
            <span>Katalog</span>
          </button>

          <button
            onClick={() => handleTabClick('create-invoice')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create-invoice'
                ? 'bg-white text-[#2C1F17] font-bold shadow-xs border border-[#DFD1C4]'
                : 'text-[#6B4E3D] hover:text-[#2C1F17] hover:bg-white/60 font-medium'
            }`}
          >
            {isAuthenticated ? (
              <PlusCircle className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'create-invoice' ? 'text-[#A85842]' : 'text-[#7A5239]'}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            )}
            <span>Buat Invoice</span>
          </button>

          <button
            onClick={() => handleTabClick('invoices')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-white text-[#2C1F17] font-bold shadow-xs border border-[#DFD1C4]'
                : 'text-[#6B4E3D] hover:text-[#2C1F17] hover:bg-white/60 font-medium'
            }`}
          >
            {isAuthenticated ? (
              <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'invoices' ? 'text-[#A85842]' : 'text-[#7A5239]'}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            )}
            <span>Daftar Invoice</span>
          </button>

          <button
            onClick={() => handleTabClick('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-white text-[#2C1F17] font-bold shadow-xs border border-[#DFD1C4]'
                : 'text-[#6B4E3D] hover:text-[#2C1F17] hover:bg-white/60 font-medium'
            }`}
          >
            {isAuthenticated ? (
              <Printer className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'cards' ? 'text-[#A85842]' : 'text-[#7A5239]'}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            )}
            <span>Cetak Kartu</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Florist Admin & Logout Unified Badge */}
          {isAuthenticated ? (
            <div className="flex items-center bg-white border border-[#EADBCE] rounded-full py-1 pl-2.5 pr-1.5 shadow-2xs gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="hidden lg:inline text-[11px] font-bold text-[#2C1F17] tracking-tight">
                Florist Admin
              </span>
              <button
                onClick={onRequestLogout}
                className="p-1 rounded-full text-[#7A5239] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Keluar Akun Florist"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-full border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-[#7A5239] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Masuk sebagai Tim Florist"
            >
              <Lock className="w-3.5 h-3.5 text-[#A85842]" />
              <span className="hidden sm:inline">Login Florist</span>
            </button>
          )}

          {deferredPrompt && (
            <button
              onClick={onInstallPwa}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] border border-[#7A5239] text-[#7A5239] hover:bg-[#EADBCE]/50 transition-colors"
              title="Install Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#7A5239] hover:bg-[#5C3D2E] text-white shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pesan WA</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#EADBCE]/60 bg-[#FAF6F0] px-2 py-1.5 text-[11px] font-medium text-[#7A5239]">
        <button
          onClick={() => handleTabClick('bio')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'bio' ? 'text-[#2C1F17] font-bold bg-white shadow-2xs border border-[#EADBCE]' : 'text-[#7A5239]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A85842]" />
          <span>Bio</span>
        </button>

        <button
          onClick={() => handleTabClick('catalog')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'catalog' ? 'text-[#2C1F17] font-bold bg-white shadow-2xs border border-[#EADBCE]' : 'text-[#7A5239]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A85842]" />
          <span>Katalog</span>
        </button>

        <button
          onClick={() => handleTabClick('create-invoice')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'create-invoice' ? 'text-[#2C1F17] font-bold bg-white shadow-2xs border border-[#EADBCE]' : 'text-[#7A5239]'
          }`}
        >
          {isAuthenticated ? (
            <PlusCircle className="w-3.5 h-3.5 text-[#A85842]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>Buat Inv</span>
        </button>

        <button
          onClick={() => handleTabClick('invoices')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'invoices' ? 'text-[#2C1F17] font-bold bg-white shadow-2xs border border-[#EADBCE]' : 'text-[#6B4E3D]'
          }`}
        >
          {isAuthenticated ? (
            <FileText className="w-3.5 h-3.5 text-[#A85842]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>Invoices</span>
        </button>

        <button
          onClick={() => handleTabClick('cards')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'cards' ? 'text-[#2C1F17] font-bold bg-white shadow-2xs border border-[#EADBCE]' : 'text-[#6B4E3D]'
          }`}
        >
          {isAuthenticated ? (
            <Printer className="w-3.5 h-3.5 text-[#A85842]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>Kartu</span>
        </button>
      </div>
    </header>
  );
};
