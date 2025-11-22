import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm shadow-smooth',
      glass: 'glass shadow-sm shadow-smooth',
      gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm shadow-smooth',
    }

    if (hover) {
      const MotionDiv = motion.div
      return (
        <MotionDiv
          ref={ref}
          className={`rounded-2xl p-6 transition-all ${variants[variant]} ${className}`}
          whileHover={{
            y: -4,
            boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.12)'
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
