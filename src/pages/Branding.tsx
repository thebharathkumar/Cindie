import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Type, Image, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import BrandColors from '@/components/branding/BrandColors'
import BrandFonts from '@/components/branding/BrandFonts'
import Moodboard from '@/components/branding/Moodboard'
import Templates from '@/components/branding/Templates'

type Tab = 'colors' | 'fonts' | 'moodboard' | 'templates'

export default function Branding() {
  const [activeTab, setActiveTab] = useState<Tab>('colors')

  const tabs = [
    { id: 'colors' as Tab, label: 'Brand Colors', icon: Palette },
    { id: 'fonts' as Tab, label: 'Brand Fonts', icon: Type },
    { id: 'moodboard' as Tab, label: 'Moodboard', icon: Image },
    { id: 'templates' as Tab, label: 'Templates', icon: FileText },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Branding Helper 🎨
        </h1>
        <p className="text-lg text-slate-600">
          Keep your visual identity consistent across all products
        </p>
      </motion.div>

      {/* Tabs */}
      <Card variant="glass">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'colors' && <BrandColors />}
          {activeTab === 'fonts' && <BrandFonts />}
          {activeTab === 'moodboard' && <Moodboard />}
          {activeTab === 'templates' && <Templates />}
        </motion.div>
      </Card>
    </div>
  )
}
