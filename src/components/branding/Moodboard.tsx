import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { db } from '@/lib/db'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { MoodboardImage } from '@/types'

export default function Moodboard() {
  const images = useLiveQuery(() =>
    db.moodboardImages.orderBy('createdAt').reverse().toArray()
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productLine, setProductLine] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProductLine, setSelectedProductLine] = useState<string>('all')

  const productLines = Array.from(
    new Set(images?.map((img) => img.productLine) || [])
  )

  const handleAddImage = async () => {
    if (!productLine.trim() || !imageUrl.trim()) return

    const newImage: MoodboardImage = {
      productLine,
      imageUrl,
      description: description || undefined,
      createdAt: new Date(),
    }

    await db.moodboardImages.add(newImage)
    setIsModalOpen(false)
    setProductLine('')
    setImageUrl('')
    setDescription('')
  }

  const handleDeleteImage = async (id: number) => {
    await db.moodboardImages.delete(id)
  }

  const filteredImages =
    selectedProductLine === 'all'
      ? images
      : images?.filter((img) => img.productLine === selectedProductLine)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Moodboard</h2>
          <p className="text-slate-600 mt-1">
            Keep inspiration for each product line
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Image
        </Button>
      </div>

      {/* Filter by Product Line */}
      {productLines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedProductLine('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedProductLine === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {productLines.map((line) => (
            <button
              key={line}
              onClick={() => setSelectedProductLine(line)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedProductLine === line
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {!filteredImages || filteredImages.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No moodboard images yet</p>
          <p className="text-slate-400 mt-2">
            Add your first inspiration image
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all duration-200"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={image.imageUrl}
                  alt={image.description || 'Moodboard image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {image.productLine}
                  </span>
                  <button
                    onClick={() => handleDeleteImage(image.id!)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {image.description && (
                  <p className="text-sm text-slate-600">{image.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Moodboard Image"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddImage}
              disabled={!productLine.trim() || !imageUrl.trim()}
            >
              Add Image
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Line"
            placeholder="e.g., Gothic Florals, Minimalist, Vintage"
            value={productLine}
            onChange={(e) => setProductLine(e.target.value)}
          />

          <Input
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Notes about this inspiration..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {imageUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preview
              </label>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle"%3EInvalid URL%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
