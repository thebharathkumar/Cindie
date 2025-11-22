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
          <label className="block text-sm font-medium text-gray-800 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5
              ${icon ? 'pl-10' : ''}
              text-gray-800 placeholder:text-gray-400
              focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none
              transition-all duration-300 ease-out shadow-smooth
              hover:border-gray-400
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:border-gray-300
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
