export interface InvoiceItem {
  id: string;
  name: string;
  price: number;
}

export type PaymentStatus = 'LUNAS' | 'DP' | 'PENDING';
export type FlowerType = 'Artificial' | 'Fresh Flowers' | 'Preserved' | 'Glass Dome' | 'Bloom Box' | 'Modifikasi Uang' | 'Lainnya';
export type BouquetSize = 'S' | 'M' | 'L' | 'XL' | 'Custom';
export type Gender = 'Laki-Laki' | 'Perempuan';

export interface Invoice {
  id: string; // e.g. TF-20261015-01
  invoiceNumber: string;
  orderDate: string; // e.g. 15 Oktober 2026
  paymentDate: string; // e.g. 15 Oktober 2026
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  
  customerName: string;
  customerGender: Gender;
  customerPhone?: string;
  
  recipientName: string;
  recipientGender: Gender;
  
  productName: string;
  flowerType: FlowerType;
  size: BouquetSize;
  
  colorScheme?: string;
  notes?: string;
  greetingCard?: string;
  
  items: InvoiceItem[];
  totalAmount: number;
  createdAt: number;
}

export interface CatalogItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  driveUrl: string;
  category: FlowerType;
  description: string;
  iconName: string;
}

export interface OrderFormValues {
  customerName: string;
  customerPhone: string;
  recipientName: string;
  flowerCategory: FlowerType;
  size: BouquetSize;
  colorScheme: string;
  notes: string;
  greetingCard: string;
  deliveryDate: string;
  location: 'Medan' | 'Lubuk Pakam' | 'Luar Kota';
}
