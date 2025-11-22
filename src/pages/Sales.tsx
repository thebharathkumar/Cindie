import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, ShoppingCart, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SalesList from '@/components/sales/SalesList'
import SaleModal from '@/components/sales/SaleModal'

export default function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<number | null>(null)

  const sales = useLiveQuery(() => db.sales.orderBy('saleDate').reverse().toArray())
  const products = useLiveQuery(() => db.products.toArray())

  const handleEdit = (id: number) => {
    setEditingSale(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSale(null)
  }

  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  const monthSales = sales?.filter((s) => {
    const saleDate = new Date(s.saleDate)
    return saleDate >= monthStart && saleDate <= monthEnd
  }) || []

  const totalRevenue = sales?.reduce((acc, s) => acc + s.totalAmount, 0) || 0
  const monthRevenue = monthSales.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalTransactions = sales?.length || 0

  // Sales by product type
  const salesByProduct = products?.map((product) => {
    const productSales = sales?.filter((s) => s.productId === product.id) || []
    const revenue = productSales.reduce((acc, s) => acc + s.totalAmount, 0)
    return {
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      revenue,
      quantity: productSales.reduce((acc, s) => acc + s.quantity, 0),
    }
  }).filter((p) => p.quantity > 0) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Sales Tracker + POS 💳
        </h1>
        <p className="text-lg text-slate-600">
          Track sales and manage transactions
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <p className="text-sm text-slate-600">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-slate-600">This Month</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">${monthRevenue.toFixed(2)}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-slate-600">Transactions</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalTransactions}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-slate-600">Avg. Sale</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            ${totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
          </p>
        </Card>
      </div>

      {/* Sales Chart */}
      {salesByProduct.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Sales by Product
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByProduct}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Add Sale Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Record Sale
        </Button>
      </div>

      {/* Sales List */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Recent Transactions
        </h2>
        <SalesList sales={sales || []} onEdit={handleEdit} />
      </Card>

      {/* Sale Modal */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        saleId={editingSale}
      />
    </div>
  )
}
