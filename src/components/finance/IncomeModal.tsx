import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Income } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  incomeId: number | null
}

export default function IncomeModal({ isOpen, onClose, incomeId }: Props) {
  const existingIncome = useLiveQuery(
    () => (incomeId ? db.income.get(incomeId) : undefined),
    [incomeId]
  )

  const [formData, setFormData] = useState<Partial<Income>>({
    source: 'commission',
    description: '',
    amount: 0,
    date: new Date(),
    notes: '',
  })

  useEffect(() => {
    if (existingIncome) {
      setFormData(existingIncome)
    } else {
      setFormData({
        source: 'commission',
        description: '',
        amount: 0,
        date: new Date(),
        notes: '',
      })
    }
  }, [existingIncome])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount) return

    const incomeData: Income = formData as Income

    if (incomeId) {
      await db.income.update(incomeId, incomeData)
    } else {
      await db.income.add(incomeData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={incomeId ? 'Edit Income' : 'Add Income'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {incomeId ? 'Update' : 'Add'} Income
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Source *"
          value={formData.source}
          onChange={(e) =>
            setFormData({
              ...formData,
              source: e.target.value as Income['source'],
            })
          }
          options={[
            { value: 'commission', label: '🎨 Commission' },
            { value: 'product-sale', label: '🛍️ Product Sale' },
            { value: 'other', label: '💰 Other' },
          ]}
        />

        <Input
          label="Description *"
          placeholder="What was this income from?"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount ($) *"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            required
          />

          <Input
            label="Date *"
            type="date"
            value={
              formData.date
                ? new Date(formData.date).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setFormData({ ...formData, date: new Date(e.target.value) })
            }
            required
          />
        </div>

        <Textarea
          label="Notes"
          placeholder="Additional details..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </form>
    </Modal>
  )
}
