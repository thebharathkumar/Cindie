import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { HexColorPicker } from 'react-colorful'
import { Plus, Trash2, Copy, Check, Palette } from 'lucide-react'
import { db } from '@/lib/db'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { BrandColor } from '@/types'

export default function BrandColors() {
  const colors = useLiveQuery(() => db.brandColors.orderBy('createdAt').reverse().toArray())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [colorName, setColorName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleAddColor = async () => {
    if (!colorName.trim()) return

    const newColor: BrandColor = {
      name: colorName,
      hex: selectedColor,
      createdAt: new Date(),
    }

    await db.brandColors.add(newColor)
    setIsModalOpen(false)
    setColorName('')
    setSelectedColor('#3B82F6')
  }

  const handleDeleteColor = async (id: number) => {
    await db.brandColors.delete(id)
  }

  const handleCopyHex = (hex: string, id: number) => {
    navigator.clipboard.writeText(hex)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Brand Colors</h2>
          <p className="text-slate-600 mt-1">
            Save your brand's hex codes for consistent use
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Color
        </Button>
      </div>

      {/* Colors Grid */}
      {!colors || colors.length === 0 ? (
        <div className="text-center py-16">
          <Palette className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No brand colors yet</p>
          <p className="text-slate-400 mt-2">
            Add your first color to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => (
            <div
              key={color.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all duration-200"
            >
              {/* Color Preview */}
              <div
                className="h-32 relative"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </div>

              {/* Color Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {color.name}
                </h3>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {color.hex}
                  </code>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHex(color.hex, color.id!)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy hex code"
                    >
                      {copiedId === color.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteColor(color.id!)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete color"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Color Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Brand Color"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColor} disabled={!colorName.trim()}>
              Add Color
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Color Name"
            placeholder="e.g., Primary Blue, Accent Pink"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Color
            </label>
            <div className="flex flex-col items-center gap-4">
              <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
              <div
                className="w-full h-20 rounded-xl border-2 border-slate-200"
                style={{ backgroundColor: selectedColor }}
              />
              <code className="text-lg font-mono text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
                {selectedColor}
              </code>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
