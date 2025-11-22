import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Expense } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  expenseId: number | null
}

export default function ExpenseModal({ isOpen, onClose, expenseId }: Props) {
  const existingExpense = useLiveQuery(
    () => (expenseId ? db.expenses.get(expenseId) : undefined),
    [expenseId]
  )

  const [formData, setFormData] = useState<Partial<Expense>>({
    category: 'materials',
    description: '',
    amount: 0,
    date: new Date(),
    notes: '',
  })

  useEffect(() => {
    if (existingExpense) {
      setFormData(existingExpense)
    } else {
      setFormData({
        category: 'materials',
        description: '',
        amount: 0,
        date: new Date(),
        notes: '',
      })
    }
  }, [existingExpense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount) return

    const expenseData: Expense = formData as Expense

    if (expenseId) {
      await db.expenses.update(expenseId, expenseData)
    } else {
      await db.expenses.add(expenseData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseId ? 'Edit Expense' : 'Add Expense'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {expenseId ? 'Update' : 'Add'} Expense
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category *"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as Expense['category'],
            })
          }
          options={[
            { value: 'materials', label: 'Materials' },
            { value: 'printing', label: 'Printing' },
            { value: 'booth-fee', label: 'Booth Fee' },
            { value: 'packaging', label: 'Packaging' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'shipping', label: 'Shipping' },
            { value: 'other', label: 'Other' },
          ]}
        />

        <Input
          label="Description *"
          placeholder="What was this expense for?"
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
