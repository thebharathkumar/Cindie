import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Check } from 'lucide-react'
import { db } from '@/lib/db'
import { CraftFair, ChecklistItem } from '@/types'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  fairId: number | null
}

export default function CraftFairModal({ isOpen, onClose, fairId }: Props) {
  const existingFair = useLiveQuery(
    () => (fairId ? db.craftFairs.get(fairId) : undefined),
    [fairId]
  )

  const [formData, setFormData] = useState<Partial<CraftFair>>({
    eventName: '',
    location: '',
    boothFee: 0,
    eventDate: new Date(),
    notes: '',
    checklist: [],
  })

  const [newChecklistItem, setNewChecklistItem] = useState('')

  useEffect(() => {
    if (existingFair) {
      setFormData(existingFair)
    } else {
      setFormData({
        eventName: '',
        location: '',
        boothFee: 0,
        eventDate: new Date(),
        notes: '',
        checklist: [],
      })
    }
  }, [existingFair])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.eventName || !formData.location) return

    const fairData: CraftFair = {
      ...formData,
      createdAt: existingFair?.createdAt || new Date(),
    } as CraftFair

    if (fairId) {
      await db.craftFairs.update(fairId, fairData)
    } else {
      await db.craftFairs.add(fairData)
    }

    onClose()
  }

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem,
      completed: false,
    }

    setFormData({
      ...formData,
      checklist: [...(formData.checklist || []), newItem],
    })
    setNewChecklistItem('')
  }

  const removeChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist?.filter((item) => item.id !== id) || [],
    })
  }

  const toggleChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist:
        formData.checklist?.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ) || [],
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fairId ? 'Edit Craft Fair' : 'New Craft Fair'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {fairId ? 'Update' : 'Create'} Fair
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Name *"
          placeholder="e.g., Summer Craft Market"
          value={formData.eventName}
          onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location *"
            placeholder="City, State"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <Input
            label="Booth Fee ($)"
            type="number"
            min="0"
            step="0.01"
            value={formData.boothFee}
            onChange={(e) =>
              setFormData({ ...formData, boothFee: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Event Date *"
            type="date"
            value={
              formData.eventDate
                ? new Date(formData.eventDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setFormData({ ...formData, eventDate: new Date(e.target.value) })
            }
            required
          />

          <Input
            label="Setup Time"
            type="time"
            value={formData.setupTime}
            onChange={(e) => setFormData({ ...formData, setupTime: e.target.value })}
          />
        </div>

        <Textarea
          label="Notes"
          placeholder="Additional details..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        {/* Checklist */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Checklist
          </label>
          <div className="space-y-2">
            {formData.checklist?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-slate-300 hover:border-green-400'
                  }`}
                >
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span
                  className={`flex-1 ${
                    item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="p-1.5 rounded hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Add checklist item..."
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
            />
            <Button
              type="button"
              onClick={addChecklistItem}
              icon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
