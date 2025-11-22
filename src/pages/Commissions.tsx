import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Calendar, List } from 'lucide-react'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CommissionList from '@/components/commissions/CommissionList'
import CommissionCalendar from '@/components/commissions/CommissionCalendar'
import CommissionModal from '@/components/commissions/CommissionModal'

type View = 'list' | 'calendar'

export default function Commissions() {
  const [view, setView] = useState<View>('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCommission, setEditingCommission] = useState<number | null>(null)

  const commissions = useLiveQuery(() => db.commissions.toArray())

  const handleEdit = (id: number) => {
    setEditingCommission(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCommission(null)
  }

  const stats = {
    total: commissions?.length || 0,
    pending: commissions?.filter((c) => c.status === 'pending').length || 0,
    inProgress: commissions?.filter((c) => c.status === 'in-progress').length || 0,
    completed: commissions?.filter((c) => c.status === 'completed').length || 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Art Commission Tracker 🎨
        </h1>
        <p className="text-lg text-gray-600">
          Manage EP artwork, album covers, and individual commissions
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </Card>
      </div>

      {/* Controls */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                view === 'list'
                  ? 'bg-gradient-to-r primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                view === 'calendar'
                  ? 'bg-gradient-to-r primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar View
            </button>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Commission
          </Button>
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {view === 'list' ? (
            <CommissionList
              commissions={commissions || []}
              onEdit={handleEdit}
            />
          ) : (
            <CommissionCalendar
              commissions={commissions || []}
              onEdit={handleEdit}
            />
          )}
        </motion.div>
      </Card>

      {/* Commission Modal */}
      <CommissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        commissionId={editingCommission}
      />
    </div>
  )
}
