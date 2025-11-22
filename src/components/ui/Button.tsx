import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-smooth'

    const variants = {
      primary:
        'bg-white text-black hover:bg-zinc-100 hover:shadow-lg hover:shadow-black/50 active:bg-zinc-200',
      secondary:
        'bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 hover:shadow-md hover:shadow-black/50 active:bg-zinc-950',
      outline:
        'border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:shadow-sm',
      ghost: 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
      danger:
        'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:shadow-black/50 active:bg-red-800',
    }

    const sizes = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-5 py-2.5',
      lg: 'text-lg px-7 py-3',
    }

    const MotionButton = motion.button

    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
