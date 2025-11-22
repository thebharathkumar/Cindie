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
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-sm',
      secondary:
        'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 shadow-sm',
      outline:
        'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
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
