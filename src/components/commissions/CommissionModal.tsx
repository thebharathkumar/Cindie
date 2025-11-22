import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Commission } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  commissionId: number | null
}

export default function CommissionModal({ isOpen, onClose, commissionId }: Props) {
  const existingCommission = useLiveQuery(
    () => (commissionId ? db.commissions.get(commissionId) : undefined),
    [commissionId]
  )

  const [formData, setFormData] = useState<Partial<Commission>>({
    clientName: '',
    clientContact: '',
    description: '',
    price: 0,
    paymentStatus: 'unpaid',
    usageRights: 'personal',
    revisionRounds: 3,
    currentRevision: 0,
    status: 'pending',
    dueDate: new Date(),
    portfolioSave: false,
    referenceImages: [],
    notes: '',
  })

  useEffect(() => {
    if (existingCommission) {
      setFormData(existingCommission)
    } else {
      setFormData({
        clientName: '',
        clientContact: '',
        description: '',
        price: 0,
        paymentStatus: 'unpaid',
        usageRights: 'personal',
        revisionRounds: 3,
        currentRevision: 0,
        status: 'pending',
        dueDate: new Date(),
        portfolioSave: false,
        referenceImages: [],
        notes: '',
      })
    }
  }, [existingCommission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientName || !formData.description) return

    const commissionData: Commission = {
      ...formData,
      createdAt: existingCommission?.createdAt || new Date(),
    } as Commission

    if (commissionId) {
      await db.commissions.update(commissionId, commissionData)
    } else {
      await db.commissions.add(commissionData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={commissionId ? 'Edit Commission' : 'New Commission'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {commissionId ? 'Update' : 'Create'} Commission
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name *"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
          />

          <Input
            label="Client Contact"
            placeholder="Email or phone"
            value={formData.clientContact}
            onChange={(e) =>
              setFormData({ ...formData, clientContact: e.target.value })
            }
          />
        </div>

        <Textarea
          label="Description *"
          placeholder="Describe the commission..."
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price ($) *"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            required
          />

          <Input
            label="Due Date *"
            type="date"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setFormData({ ...formData, dueDate: new Date(e.target.value) })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Commission['status'],
              })
            }
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />

          <Select
            label="Payment Status"
            value={formData.paymentStatus}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentStatus: e.target.value as Commission['paymentStatus'],
              })
            }
            options={[
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'partial', label: 'Partial' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Usage Rights"
            value={formData.usageRights}
            onChange={(e) =>
              setFormData({
                ...formData,
                usageRights: e.target.value as Commission['usageRights'],
              })
            }
            options={[
              { value: 'personal', label: 'Personal Use' },
              { value: 'commercial', label: 'Commercial Use' },
            ]}
          />

          <Input
            label="Revision Rounds"
            type="number"
            min="1"
            value={formData.revisionRounds}
            onChange={(e) =>
              setFormData({
                ...formData,
                revisionRounds: parseInt(e.target.value),
              })
            }
          />
        </div>

        <Input
          label="Current Revision"
          type="number"
          min="0"
          max={formData.revisionRounds}
          value={formData.currentRevision}
          onChange={(e) =>
            setFormData({
              ...formData,
              currentRevision: parseInt(e.target.value),
            })
          }
        />

        <Textarea
          label="Notes"
          placeholder="Additional notes..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            id="portfolioSave"
            checked={formData.portfolioSave}
            onChange={(e) =>
              setFormData({ ...formData, portfolioSave: e.target.checked })
            }
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="portfolioSave" className="text-sm text-gray-700">
            Save to portfolio when completed
          </label>
        </div>
      </form>
    </Modal>
  )
}
