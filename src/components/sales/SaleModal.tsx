import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Sale } from '@/types'
import { useStore } from '@/store/useStore'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  saleId: number | null
}

export default function SaleModal({ isOpen, onClose, saleId }: Props) {
  const existingSale = useLiveQuery(
    () => (saleId ? db.sales.get(saleId) : undefined),
    [saleId]
  )

  const products = useLiveQuery(() => db.products.toArray())
  const craftFairs = useLiveQuery(() => db.craftFairs.toArray())
  const customers = useLiveQuery(() => db.customers.toArray())
  const { taxRate } = useStore()

  const [formData, setFormData] = useState<Partial<Sale>>({
    productId: 0,
    productName: '',
    quantity: 1,
    paymentMethod: 'cash',
    totalAmount: 0,
    saleDate: new Date(),
    notes: '',
  })

  useEffect(() => {
    if (existingSale) {
      setFormData(existingSale)
    } else {
      setFormData({
        productId: 0,
        productName: '',
        quantity: 1,
        paymentMethod: 'cash',
        totalAmount: 0,
        saleDate: new Date(),
        notes: '',
      })
    }
  }, [existingSale])

  const selectedProduct = products?.find((p) => p.id === formData.productId)

  useEffect(() => {
    if (selectedProduct && formData.quantity) {
      const subtotal = selectedProduct.retailPrice * formData.quantity
      const tax = subtotal * taxRate
      setFormData({
        ...formData,
        productName: selectedProduct.name,
        taxAmount: tax,
        totalAmount: subtotal + tax,
      })
    }
  }, [formData.productId, formData.quantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productId || !formData.quantity) return

    const saleData: Sale = {
      ...formData,
    } as Sale

    if (saleId) {
      await db.sales.update(saleId, saleData)
    } else {
      await db.sales.add(saleData)
    }

    // Update product sold quantity
    if (selectedProduct) {
      await db.products.update(formData.productId!, {
        quantitySold: selectedProduct.quantitySold + formData.quantity!,
      })
    }

    // Update customer total purchases if customer is selected
    if (formData.customerId) {
      const customer = await db.customers.get(formData.customerId)
      if (customer) {
        await db.customers.update(formData.customerId, {
          totalPurchases: customer.totalPurchases + formData.totalAmount!,
        })
      }
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={saleId ? 'Edit Sale' : 'Record Sale'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {saleId ? 'Update' : 'Record'} Sale
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Product *"
          value={formData.productId?.toString()}
          onChange={(e) =>
            setFormData({ ...formData, productId: parseInt(e.target.value) })
          }
          options={[
            { value: '0', label: 'Select a product...' },
            ...(products?.map((p) => ({
              value: p.id!.toString(),
              label: `${p.name} - $${p.retailPrice.toFixed(2)}`,
            })) || []),
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Quantity *"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            required
          />

          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentMethod: e.target.value as Sale['paymentMethod'],
              })
            }
            options={[
              { value: 'cash', label: '💵 Cash' },
              { value: 'card', label: '💳 Card' },
              { value: 'digital', label: '📱 Digital' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Craft Fair (Optional)"
            value={formData.fairId?.toString() || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                fairId: e.target.value ? parseInt(e.target.value) : undefined,
                fairName: craftFairs?.find((f) => f.id === parseInt(e.target.value))
                  ?.eventName,
              })
            }
            options={[
              { value: '', label: 'No fair' },
              ...(craftFairs?.map((f) => ({
                value: f.id!.toString(),
                label: f.eventName,
              })) || []),
            ]}
          />

          <Select
            label="Customer (Optional)"
            value={formData.customerId?.toString() || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerId: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            options={[
              { value: '', label: 'Walk-in customer' },
              ...(customers?.map((c) => ({
                value: c.id!.toString(),
                label: c.name,
              })) || []),
            ]}
          />
        </div>

        <Input
          label="Sale Date"
          type="date"
          value={
            formData.saleDate
              ? new Date(formData.saleDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            setFormData({ ...formData, saleDate: new Date(e.target.value) })
          }
        />

        <Textarea
          label="Notes"
          placeholder="Additional details..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        {/* Price Breakdown */}
        {selectedProduct && (
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-slate-900 mb-3">Sale Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Unit Price × {formData.quantity}:
                </span>
                <span className="font-medium">
                  $
                  {(
                    selectedProduct.retailPrice * (formData.quantity || 1)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax ({(taxRate * 100).toFixed(1)}%):</span>
                <span className="font-medium">${(formData.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-green-200 flex justify-between">
                <span className="font-semibold text-slate-900">Total:</span>
                <span className="font-bold text-green-600 text-lg">
                  ${(formData.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
