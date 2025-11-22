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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-red-950/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
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
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-2xl shadow-purple-900/50">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">
            Cindie
          </h1>
          <p className="text-purple-300/70 text-sm font-medium">
            Creative Business Toolkit
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-2xl border border-purple-900/30 rounded-3xl p-8 shadow-2xl shadow-purple-950/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-purple-200/90 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-purple-900/30 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-purple-400/30 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none transition-all duration-300"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-purple-200/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-purple-900/30 rounded-2xl pl-12 pr-12 py-3.5 text-white placeholder:text-purple-400/30 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/30 border border-red-900/30 rounded-xl p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3.5 rounded-2xl shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Footer text */}
          <p className="text-center text-purple-400/40 text-xs mt-6">
            Welcome back to the dark side
          </p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8 text-purple-400/30 text-xs"
        >
          Crafted with darkness and elegance
        </motion.div>
      </motion.div>
    </div>
  )
}
