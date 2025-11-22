import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Palette,
  Briefcase,
  Package,
  Store,
  ShoppingCart,
  Users,
  DollarSign,
  Menu,
  X,
} from 'lucide-react'
import { useStore } from '@/store/useStore'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/branding', icon: Palette, label: 'Branding' },
  { path: '/commissions', icon: Briefcase, label: 'Commissions' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/craft-fairs', icon: Store, label: 'Craft Fairs' },
  { path: '/sales', icon: ShoppingCart, label: 'Sales' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/finance', icon: DollarSign, label: 'Finance' },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen w-72 glass border-r border-slate-200 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Cindie</h1>
              <p className="text-xs text-slate-500">Creative Toolkit</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="ml-auto w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-900 mb-1">
              Need help?
            </p>
            <p className="text-xs text-slate-600">
              Check out our guide to get started
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 rounded-xl glass shadow-lg"
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>
    </>
  )
}
