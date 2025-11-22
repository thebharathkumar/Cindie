import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Package, TrendingUp, AlertCircle } from 'lucide-react'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProductGrid from '@/components/products/ProductGrid'
import ProductModal from '@/components/products/ProductModal'

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<number | null>(null)

  const products = useLiveQuery(() => db.products.toArray())

  const handleEdit = (id: number) => {
    setEditingProduct(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const totalInventory =
    products?.reduce((acc, p) => acc + (p.quantityMade - p.quantitySold), 0) || 0
  const totalRevenue = products?.reduce((acc, p) => acc + p.retailPrice * p.quantitySold, 0) || 0
  const lowStockCount =
    products?.filter((p) => {
      const remaining = p.quantityMade - p.quantitySold
      return remaining > 0 && remaining < 5
    }).length || 0
  const bestSeller = products?.sort((a, b) => b.quantitySold - a.quantitySold)[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Product & Inventory Manager 📦
        </h1>
        <p className="text-lg text-slate-600">
          Track journals, candles, cards, prints, stickers, and more
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-slate-600">Total Inventory</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalInventory}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-slate-600">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-slate-600">Low Stock Items</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-slate-600">Best Seller</p>
          </div>
          <p className="text-lg font-semibold text-slate-900 truncate">
            {bestSeller?.name || 'N/A'}
          </p>
        </Card>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <ProductGrid products={products || []} onEdit={handleEdit} />

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={editingProduct}
      />
    </div>
  )
}
