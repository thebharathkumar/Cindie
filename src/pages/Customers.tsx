import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Users, Mail, Phone, Edit, Trash2, Download } from 'lucide-react'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CustomerModal from '@/components/customers/CustomerModal'

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const customers = useLiveQuery(() => db.customers.orderBy('createdAt').reverse().toArray())

  const handleEdit = (id: number) => {
    setEditingCustomer(id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await db.customers.delete(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleExportCSV = () => {
    if (!customers || customers.length === 0) return

    const headers = ['Name', 'Email', 'Phone', 'Preferences', 'Total Purchases', 'Notes']
    const rows = customers.map((c) => [
      c.name,
      c.email,
      c.phone || '',
      c.preferences || '',
      c.totalPurchases.toString(),
      c.notes || '',
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredCustomers = customers?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Customer Directory 👥
        </h1>
        <p className="text-lg text-gray-600">
          Build and manage your customer relationships
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{customers?.length || 0}</p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Email Subscribers</p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {customers?.filter((c) => c.email).length || 0}
          </p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">With Phone Numbers</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {customers?.filter((c) => c.phone).length || 0}
          </p>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
        <Button
          variant="outline"
          onClick={handleExportCSV}
          icon={<Download className="w-4 h-4" />}
        >
          Export CSV
        </Button>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Customer
        </Button>
      </div>

      {/* Customers List */}
      {!filteredCustomers || filteredCustomers.length === 0 ? (
        <Card variant="gradient">
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No customers yet</p>
            <p className="text-gray-400 mt-2">Add your first customer to get started</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {customer.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${customer.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {customer.email}
                      </a>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${customer.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {customer.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  {customer.preferences && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Preferences:</strong> {customer.preferences}
                    </p>
                  )}
                  {customer.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">{customer.notes}</p>
                  )}
                  <p className="text-sm text-green-600 mt-2">
                    ${customer.totalPurchases.toFixed(2)} in total purchases
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(customer.id!)}
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id!)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customerId={editingCustomer}
      />
    </div>
  )
}
