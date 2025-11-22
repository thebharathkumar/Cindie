import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { useStore } from '@/store/useStore'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
}

export default function Layout() {
  const { sidebarOpen } = useStore()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <motion.main
        animate={{
          marginLeft: sidebarOpen ? 288 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen lg:ml-72"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
