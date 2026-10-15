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
  LogOut,
  ShieldCheck
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
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EADBCE] no-print transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('bio')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
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
              <span className="text-[#A85842] text-[10px] sm:text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-[#EADBCE]/70">
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
            onClick={() => handleTabClick('bio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bio Link</span>
          </button>

          <button
            onClick={() => handleTabClick('catalog')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog Drive</span>
          </button>

          <button
            onClick={() => handleTabClick('create-invoice')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create-invoice'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            {isAuthenticated ? (
              <PlusCircle className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Buat Invoice</span>
          </button>

          <button
            onClick={() => handleTabClick('invoices')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            {isAuthenticated ? (
              <FileText className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Daftar Invoice</span>
          </button>

          <button
            onClick={() => handleTabClick('cards')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#7A5239] text-[#FAF6F0] shadow-sm'
                : 'text-[#6B4E3D] hover:bg-[#EADBCE]/50'
            }`}
          >
            {isAuthenticated ? (
              <Printer className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Cetak Kartu</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Florist Login/Logout Toggle */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Florist Admin</span>
              </span>
              <button
                onClick={onRequestLogout}
                className="p-2 rounded-full border border-[#D8C3B1] bg-white hover:bg-rose-50 text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Keluar Akun Florist"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-full border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-[#7A5239] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Masuk sebagai Tim Florist"
            >
              <Lock className="w-3.5 h-3.5 text-[#A85842]" />
              <span className="hidden sm:inline">Login Florist</span>
            </button>
          )}

          {deferredPrompt && (
            <button
              onClick={onInstallPwa}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] border border-[#7A5239] text-[#7A5239] hover:bg-[#EADBCE]/50 transition-colors"
              title="Install Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-linear-to-r from-[#A85842] to-[#7A5239] text-white shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pesan WA</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#EADBCE]/60 bg-[#FAF6F0] px-2 py-2 overflow-x-auto text-[11px] font-medium text-[#7A5239]">
        <button
          onClick={() => handleTabClick('bio')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
            activeTab === 'bio' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Bio</span>
        </button>

        <button
          onClick={() => handleTabClick('catalog')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
            activeTab === 'catalog' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog</span>
        </button>

        <button
          onClick={() => handleTabClick('create-invoice')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
            activeTab === 'create-invoice' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          {isAuthenticated ? (
            <PlusCircle className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4 text-zinc-400" />
          )}
          <span>Buat Inv</span>
        </button>

        <button
          onClick={() => handleTabClick('invoices')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
            activeTab === 'invoices' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          {isAuthenticated ? (
            <FileText className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4 text-zinc-400" />
          )}
          <span>Invoices</span>
        </button>

        <button
          onClick={() => handleTabClick('cards')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
            activeTab === 'cards' ? 'text-[#A85842] font-bold bg-[#EADBCE]/50' : 'text-[#6B4E3D]'
          }`}
        >
          {isAuthenticated ? (
            <Printer className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4 text-zinc-400" />
          )}
          <span>Kartu</span>
        </button>
      </div>
    </header>
  );
};
