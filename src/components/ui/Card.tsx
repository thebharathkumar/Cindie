import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-slate-200 shadow-lg',
      glass: 'glass',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-xl',
    }

    if (hover) {
      const MotionDiv = motion.div
      return (
        <MotionDiv
          ref={ref}
          className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {children}
        </MotionDiv>
      )
    }

    return (
      <div
        ref={ref}
        className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
