import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { useStore } from '@/store/useStore'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
}

const pageTransition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
}

export default function Layout() {
  const { sidebarOpen } = useStore()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Nothing-style dot pattern background */}
      <div className="fixed inset-0 dot-pattern pointer-events-none z-0" />

      {/* Red accent line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent z-50" />

      <Sidebar />
      <motion.main
        animate={{
          marginLeft: sidebarOpen ? 288 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen lg:ml-72 relative z-10"
      >
        <div className="p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto">
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
