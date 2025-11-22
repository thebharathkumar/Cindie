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
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    success: 'bg-green-900/50 text-green-300 border border-green-700',
    warning: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    danger: 'bg-red-900/50 text-red-300 border border-red-700',
    info: 'bg-blue-900/50 text-blue-300 border border-blue-700',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
