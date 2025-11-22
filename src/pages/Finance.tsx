
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import FinanceTabs from '@/components/finance/FinanceTabs'

export default function Finance() {
  const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().toArray())
  const income = useLiveQuery(() => db.income.orderBy('date').reverse().toArray())
  const sales = useLiveQuery(() => db.sales.toArray())

  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Monthly calculations
  const monthExpenses =
    expenses?.filter((e) => {
      const expenseDate = new Date(e.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    }).reduce((acc, e) => acc + e.amount, 0) || 0

  const monthIncome =
    income?.filter((i) => {
      const incomeDate = new Date(i.date)
      return incomeDate >= monthStart && incomeDate <= monthEnd
    }).reduce((acc, i) => acc + i.amount, 0) || 0

  const monthSalesRevenue =
    sales?.filter((s) => {
      const saleDate = new Date(s.saleDate)
      return saleDate >= monthStart && saleDate <= monthEnd
    }).reduce((acc, s) => acc + s.totalAmount, 0) || 0

  const monthTotalIncome = monthIncome + monthSalesRevenue
  const monthProfit = monthTotalIncome - monthExpenses

  // Yearly calculations
  const yearExpenses = expenses?.reduce((acc, e) => acc + e.amount, 0) || 0
  const yearIncome = income?.reduce((acc, i) => acc + i.amount, 0) || 0
  const yearSalesRevenue = sales?.reduce((acc, s) => acc + s.totalAmount, 0) || 0
  const yearTotalIncome = yearIncome + yearSalesRevenue
  const yearProfit = yearTotalIncome - yearExpenses

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Finance & Tax Basics 💰
        </h1>
        <p className="text-lg text-slate-600">
          Track income, expenses, and stay tax-ready
        </p>
      </motion.div>

      {/* Monthly Stats */}
      <div>
        <h2 className="text-sm font-medium text-slate-600 mb-3">
          This Month ({format(currentDate, 'MMMM yyyy')})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="glass">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-slate-600">Total Income</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${monthTotalIncome.toFixed(2)}
            </p>
          </Card>

          <Card variant="glass">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <p className="text-sm text-slate-600">Total Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ${monthExpenses.toFixed(2)}
            </p>
          </Card>

          <Card variant="glass">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-slate-600">Net Profit</p>
            </div>
            <p
              className={`text-3xl font-bold ${
                monthProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${monthProfit.toFixed(2)}
            </p>
          </Card>

          <Card variant="glass">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-slate-600">Profit Margin</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {monthTotalIncome > 0
                ? ((monthProfit / monthTotalIncome) * 100).toFixed(1)
                : '0'}
              %
            </p>
          </Card>
        </div>
      </div>

      {/* Yearly Stats */}
      <div>
        <h2 className="text-sm font-medium text-slate-600 mb-3">
          Year to Date ({format(currentDate, 'yyyy')})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="gradient">
            <p className="text-sm text-slate-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${yearTotalIncome.toFixed(2)}
            </p>
          </Card>

          <Card variant="gradient">
            <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${yearExpenses.toFixed(2)}
            </p>
          </Card>

          <Card variant="gradient">
            <p className="text-sm text-slate-600 mb-1">Net Profit</p>
            <p
              className={`text-2xl font-bold ${
                yearProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${yearProfit.toFixed(2)}
            </p>
          </Card>

          <Card variant="gradient">
            <p className="text-sm text-slate-600 mb-1">Profit Margin</p>
            <p className="text-2xl font-bold text-purple-600">
              {yearTotalIncome > 0
                ? ((yearProfit / yearTotalIncome) * 100).toFixed(1)
                : '0'}
              %
            </p>
          </Card>
        </div>
      </div>

      {/* Finance Tabs */}
      <FinanceTabs />

      {/* Tax Reminder */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Quarterly Tax Reminder
            </h3>
            <p className="text-slate-600 mb-3">
              Don't forget to set aside funds for quarterly estimated taxes. Consult
              with a tax professional for personalized advice.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white text-amber-700 text-sm font-medium rounded-full">
                Q1: April 15
              </span>
              <span className="px-3 py-1 bg-white text-amber-700 text-sm font-medium rounded-full">
                Q2: June 15
              </span>
              <span className="px-3 py-1 bg-white text-amber-700 text-sm font-medium rounded-full">
                Q3: Sept 15
              </span>
              <span className="px-3 py-1 bg-white text-amber-700 text-sm font-medium rounded-full">
                Q4: Jan 15
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
