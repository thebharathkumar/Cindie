import { NavLink, useNavigate } from 'react-router-dom'
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
  LogOut,
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
  const { sidebarOpen, setSidebarOpen, logout, username } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen w-72 bg-zinc-950 border-r border-zinc-800 z-40 flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-between p-6 border-b border-zinc-800"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
            >
              <Palette className="w-5 h-5 text-zinc-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Cindie</h1>
              <p className="text-xs text-zinc-500">Creative Toolkit</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-zinc-900 text-white font-medium border border-zinc-700'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`
                  }
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <span>{item.label}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="p-6 border-t border-zinc-800 space-y-3"
        >
          {/* User info and logout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
              >
                <span className="text-xs font-semibold text-zinc-300">
                  {username?.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <div>
                <p className="text-sm font-medium text-white">{username}</p>
                <p className="text-xs text-zinc-500">Creative</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-zinc-900 transition-colors group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </motion.button>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer"
          >
            <p className="text-sm font-medium text-white mb-1">
              Need help?
            </p>
            <p className="text-xs text-zinc-500">
              Check out our guide to get started
            </p>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* Mobile menu button */}
      <motion.button
        onClick={() => setSidebarOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg shadow-black/50"
      >
        <Menu className="w-6 h-6 text-zinc-400" />
      </motion.button>
    </>
  )
}
