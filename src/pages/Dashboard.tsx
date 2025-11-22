import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Package,
  Briefcase,
  Calendar,
  DollarSign,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { format, isAfter, isBefore, addDays } from 'date-fns'

export default function Dashboard() {
  const commissions = useLiveQuery(() => db.commissions.toArray())
  const products = useLiveQuery(() => db.products.toArray())
  const craftFairs = useLiveQuery(() => db.craftFairs.toArray())
  const sales = useLiveQuery(() => db.sales.toArray())

  const stats = [
    {
      label: 'Active Commissions',
      value: commissions?.filter((c) => c.status === 'in-progress').length || 0,
      icon: Briefcase,
      color: 'primary',
      link: '/commissions',
    },
    {
      label: 'Products in Stock',
      value:
        products?.reduce((acc, p) => acc + (p.quantityMade - p.quantitySold), 0) || 0,
      icon: Package,
      color: 'primary',
      link: '/products',
    },
    {
      label: 'Upcoming Fairs',
      value:
        craftFairs?.filter((f) => isAfter(f.eventDate, new Date())).length || 0,
      icon: Calendar,
      color: 'green-600',
      link: '/craft-fairs',
    },
    {
      label: 'Total Sales (This Month)',
      value: `$${(sales?.filter((s) => {
        const saleMonth = new Date(s.saleDate).getMonth()
        const currentMonth = new Date().getMonth()
        return saleMonth === currentMonth
      }).reduce((acc, s) => acc + s.totalAmount, 0) || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'orange-600',
      link: '/sales',
    },
  ]

  const upcomingDeadlines = [
    ...(commissions
      ?.filter((c) => c.status !== 'completed' && c.status !== 'cancelled')
      .map((c) => ({
        type: 'commission',
        title: `${c.clientName} - Commission Due`,
        date: c.dueDate,
        link: '/commissions',
      })) || []),
    ...(craftFairs
      ?.filter((f) => isAfter(f.eventDate, new Date()))
      .map((f) => ({
        type: 'fair',
        title: f.eventName,
        date: f.eventDate,
        link: '/craft-fairs',
      })) || []),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const lowStockProducts =
    products
      ?.filter((p) => {
        const remaining = p.quantityMade - p.quantitySold
        return remaining > 0 && remaining < 5
      })
      .slice(0, 5) || []

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back! ✨
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your creative business today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Link to={stat.link}>
              <Card
                variant="glass"
                hover
                className="group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                  View details
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/commissions">
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                >
                  New Commission
                </Button>
              </Link>
              <Link to="/sales">
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Record Sale
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  className="w-full"
                  icon={<Package className="w-4 h-4" />}
                >
                  Add Product
                </Button>
              </Link>
              <Link to="/craft-fairs">
                <Button
                  variant="outline"
                  className="w-full"
                  icon={<Calendar className="w-4 h-4" />}
                >
                  Add Fair
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </h2>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No upcoming deadlines
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <Link key={index} to={deadline.link}>
                    <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {deadline.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(deadline.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            isBefore(new Date(deadline.date), addDays(new Date(), 7))
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {isBefore(new Date(deadline.date), addDays(new Date(), 7))
                            ? 'Soon'
                            : 'Upcoming'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Low Stock Alert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-orange-50 border border-orange-200"
                >
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Only {product.quantityMade - product.quantitySold} left
                  </p>
                </div>
              ))}
            </div>
            <Link to="/products">
              <Button variant="outline" className="mt-4">
                Manage Inventory
              </Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
