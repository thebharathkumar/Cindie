import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 pr-10
              text-white
              focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 focus:outline-none
              transition-all duration-300 ease-out shadow-smooth
              hover:border-zinc-700
              disabled:bg-zinc-900 disabled:cursor-not-allowed disabled:hover:border-zinc-800
              appearance-none cursor-pointer
              ${error ? 'border-red-900 focus:border-red-800 focus:ring-red-900/10' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-zinc-950 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
