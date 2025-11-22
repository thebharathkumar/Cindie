import Dexie, { Table } from 'dexie'
import type {
  BrandColor,
  BrandFont,
  MoodboardImage,
  Commission,
  CraftFair,
  Product,
  Sale,
  Customer,
  Expense,
  Income,
  Template,
  Reminder,
} from '@/types'

export class CindieDB extends Dexie {
  brandColors!: Table<BrandColor>
  brandFonts!: Table<BrandFont>
  moodboardImages!: Table<MoodboardImage>
  commissions!: Table<Commission>
  craftFairs!: Table<CraftFair>
  products!: Table<Product>
  sales!: Table<Sale>
  customers!: Table<Customer>
  expenses!: Table<Expense>
  income!: Table<Income>
  templates!: Table<Template>
  reminders!: Table<Reminder>

  constructor() {
    super('CindieDB')
    this.version(1).stores({
      brandColors: '++id, name, hex, createdAt',
      brandFonts: '++id, name, fontFamily, createdAt',
      moodboardImages: '++id, productLine, createdAt',
      commissions: '++id, clientName, status, dueDate, createdAt, paymentStatus',
      craftFairs: '++id, eventName, eventDate, createdAt',
      products: '++id, name, type, createdAt, updatedAt',
      sales: '++id, productId, saleDate, fairId, customerId',
      customers: '++id, name, email, createdAt',
      expenses: '++id, category, date, amount',
      income: '++id, source, date, amount',
      templates: '++id, name, type, createdAt',
      reminders: '++id, type, date, read, createdAt',
    })
  }
}

export const db = new CindieDB()
