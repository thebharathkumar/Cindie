import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-950 border border-zinc-800 shadow-sm shadow-black/50',
      glass: 'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 shadow-sm shadow-black/50',
      gradient: 'bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-sm shadow-black/50',
    }

    if (hover) {
      const MotionDiv = motion.div
      return (
        <MotionDiv
          ref={ref}
          className={`rounded-2xl p-6 transition-all ${variants[variant]} ${className}`}
          whileHover={{
            y: -4,
            boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.8)',
            scale: 1.01
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
