'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BioCardView } from '@/components/BioCardView';
import { CatalogView } from '@/components/CatalogView';
import { InvoiceCreateView } from '@/components/InvoiceCreateView';
import { InvoiceListView } from '@/components/InvoiceListView';
import { InvoicePrintModal } from '@/components/InvoicePrintModal';
import { BatchInvoicePrintModal } from '@/components/BatchInvoicePrintModal';
import { GreetingCardModal } from '@/components/GreetingCardModal';
import { OrderBuilderModal } from '@/components/OrderBuilderModal';
import { LoginModal } from '@/components/LoginModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SupabaseSetupModal } from '@/components/SupabaseSetupModal';
import { Invoice, CatalogItem } from '@/types';
import { getStoredInvoices } from '@/lib/storage';
import { fetchInvoices, subscribeToInvoiceChanges } from '@/lib/supabaseStorage';
import { BRAND } from '@/lib/constants';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards'>('bio');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dbSource, setDbSource] = useState<'supabase' | 'local'>('local');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Print modals
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedBatchInvoices, setSelectedBatchInvoices] = useState<Invoice[]>([]);

  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const loadInvoices = async () => {
    setIsSyncing(true);
    const res = await fetchInvoices();
    setInvoices(res.data);
    setDbSource(res.source);
    setIsSyncing(false);
  };

  // Initialize data and check auth
  useEffect(() => {
    setInvoices(getStoredInvoices());
    loadInvoices();

    // Realtime Supabase listener
    const unsubscribe = subscribeToInvoiceChanges(() => {
      loadInvoices();
    });

    // Check existing auth in localStorage
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('tovs_florist_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }

    // Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.log('Service Worker registration error:', err));
    }

    // PWA Install prompt listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      unsubscribe();
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleRefreshInvoices = () => {
    loadInvoices();
  };

  const handleInvoiceCreated = (invoice: Invoice, openPrint: boolean = false) => {
    loadInvoices();
    setEditingInvoice(null);
    if (openPrint) {
      setSelectedInvoiceForPrint(invoice);
    } else {
      setActiveTab('invoices');
    }
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setActiveTab('create-invoice');
  };

  const handleLogout = () => {
    localStorage.removeItem('tovs_florist_auth');
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    setActiveTab('bio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] selection:bg-[#EADBCE]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'create-invoice') setEditingInvoice(null);
          setActiveTab(tab);
        }}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        deferredPrompt={deferredPrompt}
        onInstallPwa={handleInstallPwa}
        isAuthenticated={isAuthenticated}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'bio' && (
          <BioCardView
            onGoToCatalog={() => setActiveTab('catalog')}
            onGoToInvoice={() => {
              if (isAuthenticated) {
                setActiveTab('create-invoice');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            onBackToBio={() => setActiveTab('bio')}
            onSelectCategoryForOrder={(item: CatalogItem) => {
              setIsOrderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'create-invoice' && (
          <InvoiceCreateView
            onInvoiceCreated={handleInvoiceCreated}
            editingInvoice={editingInvoice}
            onCancelEdit={() => {
              setEditingInvoice(null);
              setActiveTab('invoices');
            }}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceListView
            invoices={invoices}
            onRefreshInvoices={handleRefreshInvoices}
            onOpenPrint={(inv) => setSelectedInvoiceForPrint(inv)}
            onOpenBatchPrint={(batch) => setSelectedBatchInvoices(batch)}
            onEditInvoice={handleEditInvoice}
            onGoToCreate={() => {
              setEditingInvoice(null);
              setActiveTab('create-invoice');
            }}
            dbSource={dbSource}
            isSyncing={isSyncing}
            onOpenSetupModal={() => setIsSetupModalOpen(true)}
          />
        )}

        {activeTab === 'cards' && (
          <GreetingCardModal />
        )}
      </main>

      {/* Supabase Database Setup & Sync Modal */}
      <SupabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onRefresh={handleRefreshInvoices}
        isConnected={dbSource === 'supabase'}
      />

      {/* Single Printable Invoice Modal */}
      <InvoicePrintModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />

      {/* Batch Multi-Invoice Print Modal (Print beberapa invoice jadi 1 file PDF) */}
      <BatchInvoicePrintModal
        invoices={selectedBatchInvoices}
        onClose={() => setSelectedBatchInvoices([])}
      />

      {/* Customer Order Builder Modal */}
      <OrderBuilderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Login Florist Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          // If user was trying to go to an admin tab, stay there or open invoices
          if (activeTab === 'bio' || activeTab === 'catalog') {
            setActiveTab('invoices');
          }
        }}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        type="logout"
        title="Keluar dari Akun Florist?"
        message="Akses halaman faktur dan cetak kartu akan dikunci sampai Anda login kembali."
        confirmText="Ya, Keluar"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      {/* Bottom Footer (Hidden when printing) */}
      <footer className="no-print border-t border-[#EADBCE]/80 py-6 bg-[#FAF6F0] text-center text-xs text-[#7A5239]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif font-bold text-sm text-[#2C1F17]">
            TOV’S FLEUR • BOUTIQUE FLORIST
          </p>
          <p className="text-[11px] text-[#6B4E3D]">
            Medan & Lubuk Pakam • WhatsApp: {BRAND.whatsappNumber}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A85842] transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A85842] transition-colors"
            >
              TikTok
            </a>
            <span>•</span>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A85842] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
