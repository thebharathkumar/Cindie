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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen w-72 glass border-r border-gray-200 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Cindie</h1>
              <p className="text-xs text-gray-500">Creative Toolkit</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
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
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-100 text-primary font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          {/* User info and logout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">Creative</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors" />
            </motion.button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Need help?
            </p>
            <p className="text-xs text-gray-500">
              Check out our guide to get started
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 rounded-xl glass shadow"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>
    </>
  )
}
