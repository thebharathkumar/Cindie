export interface BrandColor {
  id?: number
  name: string
  hex: string
  createdAt: Date
}

export interface BrandFont {
  id?: number
  name: string
  fontFamily: string
  url?: string
  createdAt: Date
}

export interface MoodboardImage {
  id?: number
  productLine: string
  imageUrl: string
  description?: string
  createdAt: Date
}

export interface Commission {
  id?: number
  clientName: string
  clientContact: string
  description: string
  referenceImages: string[]
  price: number
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  usageRights: 'personal' | 'commercial'
  revisionRounds: number
  currentRevision: number
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  dueDate: Date
  createdAt: Date
  completedAt?: Date
  portfolioSave: boolean
  notes?: string
}

export interface CraftFair {
  id?: number
  eventName: string
  location: string
  boothFee: number
  eventDate: Date
  applicationDeadline?: Date
  setupTime?: string
  notes?: string
  checklist: ChecklistItem[]
  createdAt: Date
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Product {
  id?: number
  name: string
  type: 'journal' | 'candle' | 'card' | 'print' | 'sticker' | 'other'
  photos: string[]
  materials: Material[]
  timeSpent: number
  retailPrice: number
  quantityMade: number
  quantitySold: number
  createdAt: Date
  updatedAt: Date
}

export interface Material {
  name: string
  cost: number
}

export interface Sale {
  id?: number
  productId: number
  productName: string
  quantity: number
  paymentMethod: 'cash' | 'card' | 'digital'
  totalAmount: number
  taxAmount?: number
  fairId?: number
  fairName?: string
  customerId?: number
  saleDate: Date
  notes?: string
}

export interface Customer {
  id?: number
  name: string
  email: string
  phone?: string
  notes?: string
  preferences?: string
  createdAt: Date
  totalPurchases: number
}

export interface Expense {
  id?: number
  category: 'materials' | 'printing' | 'booth-fee' | 'packaging' | 'marketing' | 'shipping' | 'other'
  description: string
  amount: number
  date: Date
  receiptUrl?: string
  notes?: string
}

export interface Income {
  id?: number
  source: 'commission' | 'product-sale' | 'other'
  description: string
  amount: number
  date: Date
  invoiceUrl?: string
  notes?: string
}

export interface Template {
  id?: number
  name: string
  type: 'label' | 'thank-you-card' | 'price-tag' | 'packaging'
  previewUrl: string
  config: TemplateConfig
  createdAt: Date
}

export interface TemplateConfig {
  width: number
  height: number
  backgroundColor?: string
  brandColors?: string[]
  brandFonts?: string[]
  elements: TemplateElement[]
}

export interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  content?: string
  style?: Record<string, string>
}

export interface Reminder {
  id?: number
  type: 'commission-due' | 'fair-upcoming' | 'low-stock' | 'payment-due' | 'tax-quarter'
  title: string
  message: string
  date: Date
  read: boolean
  relatedId?: number
  relatedType?: string
  createdAt: Date
}
