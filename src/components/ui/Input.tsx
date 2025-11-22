import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5
              ${icon ? 'pl-10' : ''}
              text-white placeholder:text-zinc-700
              focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 focus:outline-none
              transition-all duration-300 ease-out shadow-smooth
              hover:border-zinc-700
              disabled:bg-zinc-900 disabled:cursor-not-allowed disabled:hover:border-zinc-800
              ${error ? 'border-red-900 focus:border-red-800 focus:ring-red-900/10' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
