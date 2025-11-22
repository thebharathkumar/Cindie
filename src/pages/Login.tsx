import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Palette, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const login = useStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate loading for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(username, password)

    if (success) {
      navigate('/')
    } else {
      setError('Invalid username or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main animated orbs */}
        <motion.div
          className="absolute top-10 sm:top-20 -left-20 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-zinc-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 -right-20 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-zinc-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.15, 0.25],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Additional floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-zinc-700/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-zinc-600/10 rounded-full blur-2xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.15, 0.05, 0.15],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated grid lines */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Logo and branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-900 border border-zinc-800 mb-4 sm:mb-6 shadow-2xl shadow-black/50"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400" />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl font-semibold text-white mb-2 tracking-tight"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Cindie
          </motion.h1>
          <p className="text-zinc-500 text-sm font-medium">
            Creative Business Toolkit
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}
          className="bg-zinc-950 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Username
              </label>
              <div className="relative group">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                </motion.div>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full bg-black border border-zinc-800 rounded-xl sm:rounded-2xl pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 focus:outline-none transition-all duration-300 hover:border-zinc-700"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative group">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                </motion.div>
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full bg-black border border-zinc-800 rounded-xl sm:rounded-2xl pl-12 pr-12 py-3 sm:py-3.5 text-sm sm:text-base text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 focus:outline-none transition-all duration-300 hover:border-zinc-700"
                  placeholder="Enter your password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-zinc-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 50px rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-medium py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-black/50 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer text */}
          <p className="text-center text-zinc-600 text-xs mt-6">
            Welcome back to the dark side
          </p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8 text-zinc-700 text-xs"
        >
          Crafted with darkness and elegance
        </motion.div>
      </motion.div>
    </div>
  )
}
