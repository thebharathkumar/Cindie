import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { Commission } from '@/types'

interface Props {
  commissions: Commission[]
  onEdit: (id: number) => void
}

export default function CommissionCalendar({ commissions, onEdit }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getCommissionsForDay = (day: Date) => {
    return commissions.filter((c) => isSameDay(new Date(c.dueDate), day))
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayCommissions = getCommissionsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={index}
              className={`min-h-24 p-2 rounded-xl border transition-all ${
                isCurrentMonth
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-slate-100'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                } ${isToday ? 'text-blue-600' : ''}`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayCommissions.map((commission) => (
                  <button
                    key={commission.id}
                    onClick={() => onEdit(commission.id!)}
                    className="w-full text-left p-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {commission.clientName}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      ${commission.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
