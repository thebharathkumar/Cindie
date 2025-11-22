import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ExpenseModal from './ExpenseModal'
import IncomeModal from './IncomeModal'
import ExpenseList from './ExpenseList'
import IncomeList from './IncomeList'

type Tab = 'expenses' | 'income'

export default function FinanceTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('expenses')
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<number | null>(null)
  const [editingIncome, setEditingIncome] = useState<number | null>(null)

  const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().toArray())
  const income = useLiveQuery(() => db.income.orderBy('date').reverse().toArray())

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'expenses'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'income'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
          </div>
          <Button
            onClick={() =>
              activeTab === 'expenses'
                ? setIsExpenseModalOpen(true)
                : setIsIncomeModalOpen(true)
            }
            icon={<Plus className="w-4 h-4" />}
          >
            Add {activeTab === 'expenses' ? 'Expense' : 'Income'}
          </Button>
        </div>

        {activeTab === 'expenses' ? (
          <ExpenseList
            expenses={expenses || []}
            onEdit={(id) => {
              setEditingExpense(id)
              setIsExpenseModalOpen(true)
            }}
          />
        ) : (
          <IncomeList
            income={income || []}
            onEdit={(id) => {
              setEditingIncome(id)
              setIsIncomeModalOpen(true)
            }}
          />
        )}
      </Card>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false)
          setEditingExpense(null)
        }}
        expenseId={editingExpense}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => {
          setIsIncomeModalOpen(false)
          setEditingIncome(null)
        }}
        incomeId={editingIncome}
      />
    </>
  )
}
