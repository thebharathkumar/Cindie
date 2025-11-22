import { Edit, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { db } from '@/lib/db'
import { Sale } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props {
  sales: Sale[]
  onEdit: (id: number) => void
}

export default function SalesList({ sales, onEdit }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      await db.sales.delete(id)
    }
  }

  const getPaymentIcon = (method: Sale['paymentMethod']) => {
    switch (method) {
      case 'cash':
        return '💵'
      case 'card':
        return '💳'
      case 'digital':
        return '📱'
    }
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sales recorded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{sale.productName}</h4>
                <Badge variant="info">
                  Qty: {sale.quantity}
                </Badge>
                <span className="text-2xl">{getPaymentIcon(sale.paymentMethod)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                </span>
                <span className="capitalize">{sale.paymentMethod}</span>
                {sale.fairName && <span>@ {sale.fairName}</span>}
              </div>
              {sale.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">{sale.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ${sale.totalAmount.toFixed(2)}
                </p>
                {sale.taxAmount && (
                  <p className="text-xs text-gray-500">
                    Tax: ${sale.taxAmount.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(sale.id!)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(sale.id!)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
