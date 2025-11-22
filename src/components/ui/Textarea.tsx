import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-xl border border-zinc-800 bg-black px-4 py-3
            text-white placeholder:text-zinc-700
            focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 focus:outline-none
            transition-all duration-300 ease-out shadow-smooth
            hover:border-zinc-700
            disabled:bg-zinc-900 disabled:cursor-not-allowed disabled:hover:border-zinc-800
            resize-none
            ${error ? 'border-red-900 focus:border-red-800 focus:ring-red-900/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
