'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BioCardView } from '@/components/BioCardView';
import { CatalogView } from '@/components/CatalogView';
import { InvoiceCreateView } from '@/components/InvoiceCreateView';
import { InvoiceListView } from '@/components/InvoiceListView';
import { InvoicePrintModal } from '@/components/InvoicePrintModal';
import { GreetingCardModal } from '@/components/GreetingCardModal';
import { OrderBuilderModal } from '@/components/OrderBuilderModal';
import { Invoice, CatalogItem } from '@/types';
import { getStoredInvoices } from '@/lib/storage';
import { BRAND } from '@/lib/constants';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bio' | 'catalog' | 'create-invoice' | 'invoices' | 'cards'>('bio');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Initialize data and register service worker for PWA
  useEffect(() => {
    setInvoices(getStoredInvoices());

    // Service Worker
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
    setInvoices(getStoredInvoices());
  };

  const handleInvoiceCreated = (invoice: Invoice, openPrint: boolean = false) => {
    setInvoices(getStoredInvoices());
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
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'bio' && (
          <BioCardView
            onGoToCatalog={() => setActiveTab('catalog')}
            onGoToInvoice={() => setActiveTab('create-invoice')}
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
            onEditInvoice={handleEditInvoice}
            onGoToCreate={() => {
              setEditingInvoice(null);
              setActiveTab('create-invoice');
            }}
          />
        )}

        {activeTab === 'cards' && (
          <GreetingCardModal />
        )}
      </main>

      {/* Printable Invoice Modal */}
      <InvoicePrintModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />

      {/* Customer Order Builder Modal */}
      <OrderBuilderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
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
