import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Calendar, MapPin, DollarSign, Edit, Trash2 } from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import CraftFairModal from '@/components/craftfairs/CraftFairModal'

export default function CraftFairs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFair, setEditingFair] = useState<number | null>(null)

  const fairs = useLiveQuery(() =>
    db.craftFairs.orderBy('eventDate').reverse().toArray()
  )

  const upcomingFairs =
    fairs?.filter((f) => isAfter(new Date(f.eventDate), new Date())) || []
  const pastFairs =
    fairs?.filter((f) => isBefore(new Date(f.eventDate), new Date())) || []

  const handleEdit = (id: number) => {
    setEditingFair(id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this craft fair?')) {
      await db.craftFairs.delete(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFair(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Craft Fair & Market Dashboard 🎪
        </h1>
        <p className="text-lg text-gray-600">
          Stay organized and prepared for your events
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Upcoming Fairs</p>
          <p className="text-3xl font-bold text-blue-600">{upcomingFairs.length}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Past Events</p>
          <p className="text-3xl font-bold text-gray-600">{pastFairs.length}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-600 mb-1">Total Investment</p>
          <p className="text-3xl font-bold text-green-600">
            ${fairs?.reduce((acc, f) => acc + f.boothFee, 0).toFixed(2) || '0.00'}
          </p>
        </Card>
      </div>

      {/* Add Fair Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Craft Fair
        </Button>
      </div>

      {/* Upcoming Fairs */}
      {upcomingFairs.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {upcomingFairs.map((fair) => (
              <Card key={fair.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {fair.eventName}
                      </h3>
                      {isBefore(new Date(fair.eventDate), addDays(new Date(), 7)) && (
                        <Badge variant="warning">Coming Soon</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(fair.eventDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {fair.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Booth Fee: ${fair.boothFee.toFixed(2)}
                      </div>
                    </div>
                    {fair.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{fair.notes}</p>
                    )}
                    {fair.checklist && fair.checklist.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Checklist ({fair.checklist.filter((i) => i.completed).length}/
                          {fair.checklist.length} completed)
                        </p>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r green-600 rounded-full"
                            style={{
                              width: `${
                                (fair.checklist.filter((i) => i.completed).length /
                                  fair.checklist.length) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(fair.id!)}
                      className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(fair.id!)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Fairs */}
      {pastFairs.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Past Events
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {pastFairs.map((fair) => (
              <Card key={fair.id} className="opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      {fair.eventName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{format(new Date(fair.eventDate), 'MMM d, yyyy')}</span>
                      <span>{fair.location}</span>
                      <span>${fair.boothFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(fair.id!)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!fairs || fairs.length === 0 && (
        <Card variant="gradient">
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No craft fairs scheduled</p>
            <p className="text-gray-400 mt-2 mb-6">
              Add your first event to get started
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Schedule Your First Fair
            </Button>
          </div>
        </Card>
      )}

      {/* Craft Fair Modal */}
      <CraftFairModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fairId={editingFair}
      />
    </div>
  )
}
