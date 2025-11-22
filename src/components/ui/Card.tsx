import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-black border-2 border-white/10',
      glass: 'bg-black/50 border-2 border-white/20',
      gradient: 'bg-black border-2 border-[#FF0000]/30',
    }

    if (hover) {
      const MotionDiv = motion.div
      return (
        <MotionDiv
          ref={ref}
          className={`p-6 sm:p-8 transition-all ${variants[variant]} ${className}`}
          whileHover={{
            borderColor: 'rgba(255, 0, 0, 0.6)',
            scale: 1.01
          }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          {...(props as any)}
        >
          {children}
        </MotionDiv>
      )
    }

    return (
      <div
        ref={ref}
        className={`p-6 sm:p-8 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
