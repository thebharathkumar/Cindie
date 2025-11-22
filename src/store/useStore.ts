import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  sidebarOpen: boolean
  currentView: string
  markupFactor: number
  taxRate: number
  currency: string
  theme: 'light' | 'dark' | 'auto'

  setSidebarOpen: (open: boolean) => void
  setCurrentView: (view: string) => void
  setMarkupFactor: (factor: number) => void
  setTaxRate: (rate: number) => void
  setCurrency: (currency: string) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      currentView: 'dashboard',
      markupFactor: 2.5,
      taxRate: 0.08,
      currency: 'USD',
      theme: 'light',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      setMarkupFactor: (factor) => set({ markupFactor: factor }),
      setTaxRate: (rate) => set({ taxRate: rate }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'cindie-storage',
    }
  )
)
