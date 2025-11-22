import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Type } from 'lucide-react'
import { db } from '@/lib/db'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { BrandFont } from '@/types'

export default function BrandFonts() {
  const fonts = useLiveQuery(() => db.brandFonts.orderBy('createdAt').reverse().toArray())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fontName, setFontName] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [fontUrl, setFontUrl] = useState('')

  const handleAddFont = async () => {
    if (!fontName.trim() || !fontFamily.trim()) return

    const newFont: BrandFont = {
      name: fontName,
      fontFamily: fontFamily,
      url: fontUrl || undefined,
      createdAt: new Date(),
    }

    await db.brandFonts.add(newFont)
    setIsModalOpen(false)
    setFontName('')
    setFontFamily('')
    setFontUrl('')
  }

  const handleDeleteFont = async (id: number) => {
    await db.brandFonts.delete(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Brand Fonts</h2>
          <p className="text-slate-600 mt-1">
            Keep track of your approved fonts for labels and packaging
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Font
        </Button>
      </div>

      {/* Fonts List */}
      {!fonts || fonts.length === 0 ? (
        <div className="text-center py-16">
          <Type className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No brand fonts yet</p>
          <p className="text-slate-400 mt-2">
            Add your first font to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fonts.map((font) => (
            <div
              key={font.id}
              className="group p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {font.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Font Family: <code className="bg-slate-100 px-2 py-1 rounded">{font.fontFamily}</code>
                  </p>
                  {font.url && (
                    <a
                      href={font.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Font Source →
                    </a>
                  )}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p
                      className="text-2xl"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p
                      className="text-sm mt-2 text-slate-600"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </p>
                    <p
                      className="text-sm text-slate-600"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      abcdefghijklmnopqrstuvwxyz 0123456789
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFont(font.id!)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete font"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Font Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Brand Font"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFont}
              disabled={!fontName.trim() || !fontFamily.trim()}
            >
              Add Font
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Font Name"
            placeholder="e.g., Heading Font, Body Font"
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
          />

          <Input
            label="Font Family (CSS)"
            placeholder="e.g., 'Helvetica Neue', Arial, sans-serif"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          />

          <Input
            label="Font URL (Optional)"
            placeholder="https://fonts.google.com/..."
            value={fontUrl}
            onChange={(e) => setFontUrl(e.target.value)}
          />

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> You can use Google Fonts, Adobe Fonts, or any
              web-safe font families.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
