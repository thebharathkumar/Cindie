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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
          Product & Inventory Manager 📦
        </h1>
        <p className="text-base sm:text-lg text-zinc-400">
          Track journals, candles, cards, prints, stickers, and more
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" hover>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Package className="w-5 h-5 text-black" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">Total Inventory</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalInventory}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" hover>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">Total Revenue</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">${totalRevenue.toFixed(2)}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" hover>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-black" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">Low Stock Items</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400">{lowStockCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" hover>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">Best Seller</p>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white truncate">
              {bestSeller?.name || 'N/A'}
            </p>
          </Card>
        </motion.div>
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
