import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Palette, Eye, EyeOff, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      {/* Red accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo and branding - Nothing style */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <Palette className="w-16 h-16 text-[#FF0000] mx-auto mb-6" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-bold text-white mb-2 tracking-tight">
            CINDIE
          </h1>
          <div className="h-0.5 w-24 bg-[#FF0000] mx-auto my-6" />
          <p className="text-white/60 text-sm uppercase tracking-widest">
            Creative Business Toolkit
          </p>
        </div>

        {/* Login form - Nothing style */}
        <div className="border-2 border-white/10 p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username field */}
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-3">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b-2 border-white/20 px-0 py-3 text-white text-lg focus:border-[#FF0000] focus:outline-none transition-colors"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/20 px-0 py-3 text-white text-lg focus:border-[#FF0000] focus:outline-none transition-colors pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#FF0000] transition-colors"
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
              <div className="border-l-2 border-[#FF0000] pl-4 py-2 text-white/60 text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF0000] text-white font-medium py-4 uppercase tracking-wider text-sm hover:bg-[#CC0000] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-12"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs uppercase tracking-widest mt-8">
            Welcome Back
          </p>
        </div>
      </motion.div>
    </div>
  )
}
