import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Customer } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  customerId: number | null
}

export default function CustomerModal({ isOpen, onClose, customerId }: Props) {
  const existingCustomer = useLiveQuery(
    () => (customerId ? db.customers.get(customerId) : undefined),
    [customerId]
  )

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    preferences: '',
    totalPurchases: 0,
  })

  useEffect(() => {
    if (existingCustomer) {
      setFormData(existingCustomer)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        notes: '',
        preferences: '',
        totalPurchases: 0,
      })
    }
  }, [existingCustomer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) return

    const customerData: Customer = {
      ...formData,
      createdAt: existingCustomer?.createdAt || new Date(),
    } as Customer

    if (customerId) {
      await db.customers.update(customerId, customerData)
    } else {
      await db.customers.add(customerData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerId ? 'Edit Customer' : 'New Customer'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {customerId ? 'Update' : 'Add'} Customer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          placeholder="Customer name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email *"
            type="email"
            placeholder="customer@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <Textarea
          label="Preferences"
          placeholder="e.g., loves gothic florals, requested tarot journal"
          rows={3}
          value={formData.preferences}
          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
        />

        <Textarea
          label="Notes"
          placeholder="Additional notes about this customer..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Use preferences to remember what styles and products
            this customer likes. Great for personalized marketing!
          </p>
        </div>
      </form>
    </Modal>
  )
}
