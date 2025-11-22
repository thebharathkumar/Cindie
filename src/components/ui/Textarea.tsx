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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-xl border border-gray-300 bg-white px-4 py-3
            text-gray-800 placeholder:text-gray-400
            focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none
            transition-all duration-300 ease-out shadow-smooth
            hover:border-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:border-gray-300
            resize-none
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
