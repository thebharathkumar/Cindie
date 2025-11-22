import { Edit, Trash2, DollarSign, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { db } from '@/lib/db'
import { Commission } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props {
  commissions: Commission[]
  onEdit: (id: number) => void
}

export default function CommissionList({ commissions, onEdit }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this commission?')) {
      await db.commissions.delete(id)
    }
  }

  const getStatusVariant = (status: Commission['status']) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'in-progress':
        return 'info'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getPaymentVariant = (status: Commission['paymentStatus']) => {
    switch (status) {
      case 'unpaid':
        return 'danger'
      case 'partial':
        return 'warning'
      case 'paid':
        return 'success'
      default:
        return 'default'
    }
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg">No commissions yet</p>
        <p className="text-slate-400 mt-2">Create your first commission to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {commissions.map((commission) => (
        <div
          key={commission.id}
          className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  {commission.clientName}
                </h3>
                <Badge variant={getStatusVariant(commission.status)}>
                  {commission.status}
                </Badge>
                <Badge variant={getPaymentVariant(commission.paymentStatus)}>
                  {commission.paymentStatus}
                </Badge>
              </div>
              <p className="text-slate-600 mb-2">{commission.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Due: {format(new Date(commission.dueDate), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${commission.price.toFixed(2)}
                </span>
                <span>
                  Revisions: {commission.currentRevision}/{commission.revisionRounds}
                </span>
                <span className="capitalize">{commission.usageRights} use</span>
              </div>
              {commission.notes && (
                <p className="text-sm text-slate-500 mt-2 italic">{commission.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onEdit(commission.id!)}
                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(commission.id!)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>
                {Math.round((commission.currentRevision / commission.revisionRounds) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                style={{
                  width: `${(commission.currentRevision / commission.revisionRounds) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
