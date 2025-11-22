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
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider text-sm'

    const variants = {
      primary:
        'bg-[#FF0000] text-white hover:bg-[#CC0000] active:bg-[#990000] px-8 py-3',
      secondary:
        'bg-white text-black border-2 border-black hover:bg-black hover:text-white active:bg-gray-900 px-8 py-3',
      outline:
        'border-2 border-white text-white hover:bg-white hover:text-black active:bg-gray-100 px-8 py-3',
      ghost: 'text-white hover:text-[#FF0000] px-4 py-2',
      danger:
        'bg-black text-[#FF0000] border-2 border-[#FF0000] hover:bg-[#FF0000] hover:text-white active:bg-[#CC0000] px-8 py-3',
    }

    const sizes = {
      sm: 'text-xs px-6 py-2',
      md: 'text-sm px-8 py-3',
      lg: 'text-base px-10 py-4',
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
