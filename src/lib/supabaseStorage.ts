import { createClient } from '@/utils/supabase/client';
import { Invoice } from '@/types';
import { getStoredInvoices, saveInvoice as saveLocalInvoice, deleteInvoice as deleteLocalInvoice } from './storage';

export interface SupabaseInvoiceRow {
  id: string;
  invoice_number: string;
  order_date: string;
  payment_date: string | null;
  payment_method: string;
  payment_status: string;
  customer_name: string;
  customer_gender: string;
  customer_phone: string | null;
  recipient_name: string;
  recipient_gender: string;
  product_name: string;
  flower_type: string;
  size: string;
  color_scheme: string | null;
  notes: string | null;
  greeting_card: string | null;
  items: any;
  total_amount: number;
  created_at?: string;
}

export function invoiceToRow(inv: Invoice): SupabaseInvoiceRow {
  return {
    id: inv.id,
    invoice_number: inv.invoiceNumber,
    order_date: inv.orderDate,
    payment_date: inv.paymentDate || null,
    payment_method: inv.paymentMethod || 'Transfer Bank',
    payment_status: inv.paymentStatus || 'LUNAS',
    customer_name: inv.customerName,
    customer_gender: inv.customerGender || 'Laki-Laki',
    customer_phone: inv.customerPhone || null,
    recipient_name: inv.recipientName,
    recipient_gender: inv.recipientGender || 'Perempuan',
    product_name: inv.productName,
    flower_type: inv.flowerType,
    size: inv.size,
    color_scheme: inv.colorScheme || null,
    notes: inv.notes ? inv.notes.replace(/\\n/g, '\n') : null,
    greeting_card: inv.greetingCard ? inv.greetingCard.replace(/\\n/g, '\n') : null,
    items: inv.items || [],
    total_amount: Number(inv.totalAmount) || 0,
    created_at: inv.createdAt ? new Date(inv.createdAt).toISOString() : new Date().toISOString(),
  };
}

export function rowToInvoice(row: SupabaseInvoiceRow): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    orderDate: row.order_date,
    paymentDate: row.payment_date || '',
    paymentMethod: row.payment_method || 'Transfer Bank',
    paymentStatus: (row.payment_status as any) || 'LUNAS',
    customerName: row.customer_name,
    customerGender: (row.customer_gender as any) || 'Laki-Laki',
    customerPhone: row.customer_phone || '',
    recipientName: row.recipient_name,
    recipientGender: (row.recipient_gender as any) || 'Perempuan',
    productName: row.product_name,
    flowerType: (row.flower_type as any) || 'Artificial',
    size: (row.size as any) || 'M',
    colorScheme: row.color_scheme || '',
    notes: (row.notes || '').replace(/\\n/g, '\n'),
    greetingCard: (row.greeting_card || '').replace(/\\n/g, '\n'),
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount) || 0,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  };
}

/**
 * Fetch all invoices from Supabase table 'invoices'.
 * If successful, syncs to localStorage cache and returns the invoices.
 */
export async function fetchInvoices(): Promise<{ data: Invoice[]; source: 'supabase' | 'local'; error?: any }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice (using local storage fallback):', error.message);
      return { data: getStoredInvoices(), source: 'local', error };
    }

    if (data && Array.isArray(data)) {
      const converted = data.map(rowToInvoice);
      // Sync to local cache
      if (typeof window !== 'undefined' && converted.length > 0) {
        localStorage.setItem('tovs_fleur_invoices_v1', JSON.stringify(converted));
      }
      return { data: converted, source: 'supabase' };
    }

    return { data: getStoredInvoices(), source: 'local' };
  } catch (err) {
    console.warn('Supabase fetch exception (using local storage fallback):', err);
    return { data: getStoredInvoices(), source: 'local', error: err };
  }
}

/**
 * Save / Upsert invoice to both Supabase and local cache.
 */
export async function saveInvoiceWithSync(invoice: Invoice): Promise<{ success: boolean; error?: any }> {
  // Always update local cache first for instant UI response
  saveLocalInvoice(invoice);

  try {
    const supabase = createClient();
    const row = invoiceToRow(invoice);
    const { error } = await supabase.from('invoices').upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert warning:', error.message);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase upsert exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Delete invoice from both Supabase and local cache.
 */
export async function deleteInvoiceWithSync(id: string): Promise<{ success: boolean; error?: any }> {
  deleteLocalInvoice(id);

  try {
    const supabase = createClient();
    const { error } = await supabase.from('invoices').delete().eq('id', id);

    if (error) {
      console.warn('Supabase delete warning:', error.message);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase delete exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Sync local invoices up to Supabase in bulk (useful for initial seed or migration).
 */
export async function syncLocalInvoicesToSupabase(localInvoices: Invoice[]): Promise<{ count: number; error?: any }> {
  try {
    const supabase = createClient();
    const rows = localInvoices.map(invoiceToRow);
    const { error } = await supabase.from('invoices').upsert(rows, { onConflict: 'id' });

    if (error) {
      return { count: 0, error };
    }

    return { count: rows.length };
  } catch (err) {
    return { count: 0, error: err };
  }
}

/**
 * Realtime listener for cross-device changes.
 */
export function subscribeToInvoiceChanges(onChange: () => void): () => void {
  try {
    const supabase = createClient();
    const channel = supabase
      .channel('public:invoices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return () => {};
  }
}
