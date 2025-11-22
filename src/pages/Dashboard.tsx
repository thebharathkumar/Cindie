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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Welcome back! ✨
        </motion.h1>
        <p className="text-base sm:text-lg text-zinc-400">
          Here's what's happening with your creative business today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={stat.link}>
              <Card
                variant="glass"
                hover
                className="group cursor-pointer relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-zinc-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-xs sm:text-sm text-zinc-400 mb-2">{stat.label}</p>
                    <motion.p
                      className="text-2xl sm:text-3xl font-bold text-white"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, delay: index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </motion.div>
                </div>
                <motion.div
                  className="mt-4 flex items-center text-xs sm:text-sm text-zinc-400 group-hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  View details
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card variant="gradient" className="relative overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 relative z-10">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 relative z-10">
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
          whileHover={{ scale: 1.01 }}
        >
          <Card className="relative overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Calendar className="w-5 h-5 text-zinc-400" />
              </motion.div>
              Upcoming Deadlines
            </h2>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">
                No upcoming deadlines
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3 relative z-10">
                {upcomingDeadlines.map((deadline, index) => (
                  <Link key={index} to={deadline.link}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 sm:p-4 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-zinc-700/0 via-zinc-700/10 to-zinc-700/0 opacity-0 group-hover:opacity-100"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-medium text-white text-sm sm:text-base truncate">
                            {deadline.title}
                          </p>
                          <p className="text-xs sm:text-sm text-zinc-400">
                            {format(new Date(deadline.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
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
                        </motion.div>
                      </div>
                    </motion.div>
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
          whileHover={{ scale: 1.01 }}
        >
          <Card variant="glass" className="relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </motion.div>
              Low Stock Alert
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10">
              {lowStockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgb(234 88 12)' }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-700 cursor-pointer relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <p className="font-medium text-white text-sm sm:text-base relative z-10 truncate">{product.name}</p>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 relative z-10">
                    Only {product.quantityMade - product.quantitySold} left
                  </p>
                </motion.div>
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
