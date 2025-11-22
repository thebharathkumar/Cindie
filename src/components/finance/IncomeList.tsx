import { Edit, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { db } from '@/lib/db'
import { Income } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props {
  income: Income[]
  onEdit: (id: number) => void
}

export default function IncomeList({ income, onEdit }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      await db.income.delete(id)
    }
  }

  const getSourceIcon = (source: Income['source']) => {
    const icons: Record<string, string> = {
      commission: '🎨',
      'product-sale': '🛍️',
      other: '💰',
    }
    return icons[source] || '💰'
  }

  if (income.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No income recorded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {income.map((entry) => (
        <div
          key={entry.id}
          className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getSourceIcon(entry.source)}</span>
                <h4 className="font-semibold text-gray-900">{entry.description}</h4>
                <Badge variant="success" className="capitalize">
                  {entry.source.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {format(new Date(entry.date), 'MMM d, yyyy')}
              </div>
              {entry.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">{entry.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <p className="text-xl font-bold text-green-600">
                ${entry.amount.toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(entry.id!)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id!)}
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
