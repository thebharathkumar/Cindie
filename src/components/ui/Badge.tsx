import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export default function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white border border-white/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
