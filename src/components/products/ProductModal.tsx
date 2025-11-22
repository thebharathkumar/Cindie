import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Calculator } from 'lucide-react'
import { db } from '@/lib/db'
import { Product } from '@/types'
import { useStore } from '@/store/useStore'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  productId: number | null
}

export default function ProductModal({ isOpen, onClose, productId }: Props) {
  const existingProduct = useLiveQuery(
    () => (productId ? db.products.get(productId) : undefined),
    [productId]
  )

  const { markupFactor } = useStore()

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: 'other',
    photos: [],
    materials: [],
    timeSpent: 0,
    retailPrice: 0,
    quantityMade: 0,
    quantitySold: 0,
  })

  const [newMaterial, setNewMaterial] = useState({ name: '', cost: 0 })

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct)
    } else {
      setFormData({
        name: '',
        type: 'other',
        photos: [],
        materials: [],
        timeSpent: 0,
        retailPrice: 0,
        quantityMade: 0,
        quantitySold: 0,
      })
    }
  }, [existingProduct])

  const calculateSuggestedPrice = () => {
    const materialsCost =
      formData.materials?.reduce((acc, m) => acc + m.cost, 0) || 0
    const laborCost = (formData.timeSpent || 0) * 15 // $15/hour estimate
    return (materialsCost + laborCost) * markupFactor
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) return

    const productData: Product = {
      ...formData,
      createdAt: existingProduct?.createdAt || new Date(),
      updatedAt: new Date(),
    } as Product

    if (productId) {
      await db.products.update(productId, productData)
    } else {
      await db.products.add(productData)
    }

    onClose()
  }

  const addMaterial = () => {
    if (!newMaterial.name.trim() || newMaterial.cost <= 0) return

    setFormData({
      ...formData,
      materials: [...(formData.materials || []), { ...newMaterial }],
    })
    setNewMaterial({ name: '', cost: 0 })
  }

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials?.filter((_, i) => i !== index) || [],
    })
  }

  const applySuggestedPrice = () => {
    setFormData({ ...formData, retailPrice: calculateSuggestedPrice() })
  }

  const suggestedPrice = calculateSuggestedPrice()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productId ? 'Edit Product' : 'New Product'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {productId ? 'Update' : 'Create'} Product
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name *"
            placeholder="e.g., Gothic Floral Journal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Product Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as Product['type'] })
            }
            options={[
              { value: 'journal', label: '📔 Journal' },
              { value: 'candle', label: '🕯️ Candle' },
              { value: 'card', label: '💌 Card' },
              { value: 'print', label: '🖼️ Print' },
              { value: 'sticker', label: '✨ Sticker' },
              { value: 'other', label: '🎨 Other' },
            ]}
          />
        </div>

        {/* Materials */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materials & Costs
          </label>
          <div className="space-y-2 mb-3">
            {formData.materials?.map((material, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-1 text-gray-900">{material.name}</span>
                <span className="text-gray-600">${material.cost.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="p-1.5 rounded hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Material name"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, name: e.target.value })
              }
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Cost"
              value={newMaterial.cost || ''}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, cost: parseFloat(e.target.value) })
              }
              className="w-32"
            />
            <Button
              type="button"
              onClick={addMaterial}
              icon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>
        </div>

        <Input
          label="Time Spent (hours)"
          type="number"
          min="0"
          step="0.25"
          value={formData.timeSpent}
          onChange={(e) =>
            setFormData({ ...formData, timeSpent: parseFloat(e.target.value) })
          }
        />

        {/* Price Calculator */}
        <div className="p-4 bg-gray-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Price Calculator</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Materials Cost:</span>
              <span className="font-medium">
                $
                {(formData.materials?.reduce((acc, m) => acc + m.cost, 0) || 0).toFixed(
                  2
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Labor Cost ($15/hr):</span>
              <span className="font-medium">
                ${((formData.timeSpent || 0) * 15).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Markup Factor:</span>
              <span className="font-medium">{markupFactor}x</span>
            </div>
            <div className="pt-2 border-t border-blue-200 flex justify-between">
              <span className="font-semibold text-gray-900">Suggested Price:</span>
              <span className="font-bold text-blue-600">
                ${suggestedPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-3"
            onClick={applySuggestedPrice}
          >
            Apply Suggested Price
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Retail Price ($) *"
            type="number"
            min="0"
            step="0.01"
            value={formData.retailPrice}
            onChange={(e) =>
              setFormData({ ...formData, retailPrice: parseFloat(e.target.value) })
            }
            required
          />

          <Input
            label="Quantity Made"
            type="number"
            min="0"
            value={formData.quantityMade}
            onChange={(e) =>
              setFormData({ ...formData, quantityMade: parseInt(e.target.value) })
            }
          />

          <Input
            label="Quantity Sold"
            type="number"
            min="0"
            max={formData.quantityMade}
            value={formData.quantitySold}
            onChange={(e) =>
              setFormData({ ...formData, quantitySold: parseInt(e.target.value) })
            }
          />
        </div>
      </form>
    </Modal>
  )
}
