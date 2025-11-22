import { Edit, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { db } from '@/lib/db'
import { Expense } from '@/types'

interface Props {
  expenses: Expense[]
  onEdit: (id: number) => void
}

export default function ExpenseList({ expenses, onEdit }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await db.expenses.delete(id)
    }
  }

  const getCategoryColor = (category: Expense['category']) => {
    const colors: Record<string, string> = {
      materials: 'from-blue-600 to-indigo-600',
      printing: 'from-purple-600 to-pink-600',
      'booth-fee': 'from-green-600 to-emerald-600',
      packaging: 'from-orange-600 to-red-600',
      marketing: 'from-yellow-600 to-amber-600',
      shipping: 'from-cyan-600 to-blue-600',
      other: 'from-slate-600 to-gray-600',
    }
    return colors[category] || colors.other
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No expenses recorded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getCategoryColor(
                    expense.category
                  )} text-white text-sm font-medium capitalize`}
                >
                  {expense.category.replace('-', ' ')}
                </div>
                <h4 className="font-semibold text-slate-900">{expense.description}</h4>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </div>
              {expense.notes && (
                <p className="text-sm text-slate-500 mt-2 italic">{expense.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <p className="text-xl font-bold text-red-600">
                ${expense.amount.toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(expense.id!)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(expense.id!)}
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
