import { FileText } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Templates() {
  const templateTypes = [
    {
      name: 'Product Label',
      description: 'Professional labels for your products',
      icon: '🏷️',
    },
    {
      name: 'Thank You Card',
      description: 'Show appreciation to your customers',
      icon: '💌',
    },
    {
      name: 'Price Tag',
      description: 'Beautiful pricing tags for craft fairs',
      icon: '💰',
    },
    {
      name: 'Packaging Design',
      description: 'Mockups for candles and journals',
      icon: '📦',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Automatic Template Generator
        </h2>
        <p className="text-slate-600 mt-1">
          Generate consistent templates using your brand colors and fonts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templateTypes.map((template, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-200"
          >
            <div className="text-4xl mb-4">{template.icon}</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {template.name}
            </h3>
            <p className="text-slate-600 mb-4">{template.description}</p>
            <Button variant="outline" icon={<FileText className="w-4 h-4" />}>
              Create Template
            </Button>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Coming Soon: Advanced Template Editor
        </h3>
        <p className="text-slate-600 mb-4">
          We're working on a drag-and-drop template editor that will use your
          brand colors and fonts to create beautiful, consistent designs.
          Templates will be exportable as PDF or PNG for printing.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-sm font-medium bg-white text-blue-700 rounded-full">
            Drag & Drop Editor
          </span>
          <span className="px-3 py-1 text-sm font-medium bg-white text-blue-700 rounded-full">
            PDF Export
          </span>
          <span className="px-3 py-1 text-sm font-medium bg-white text-blue-700 rounded-full">
            Print-Ready
          </span>
          <span className="px-3 py-1 text-sm font-medium bg-white text-blue-700 rounded-full">
            Auto-Apply Brand
          </span>
        </div>
      </div>
    </div>
  )
}
