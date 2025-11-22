import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { useStore } from '@/store/useStore'

export default function Layout() {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen">
      <Sidebar />
      <motion.main
        animate={{
          marginLeft: sidebarOpen ? 288 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen lg:ml-72"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
