import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm',
      glass: 'glass shadow-sm',
      gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm',
    }

    if (hover) {
      const MotionDiv = motion.div
      return (
        <MotionDiv
          ref={ref}
          className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
          whileHover={{ y: -2, boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)' }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
