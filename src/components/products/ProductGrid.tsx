import { Edit, Trash2, TrendingUp, Package } from 'lucide-react'
import { db } from '@/lib/db'
import { Product } from '@/types'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

interface Props {
  products: Product[]
  onEdit: (id: number) => void
}

export default function ProductGrid({ products, onEdit }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await db.products.delete(id)
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      journal: '📔',
      candle: '🕯️',
      card: '💌',
      print: '🖼️',
      sticker: '✨',
      other: '🎨',
    }
    return icons[type] || '🎨'
  }

  if (products.length === 0) {
    return (
      <Card variant="gradient">
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products yet</p>
          <p className="text-gray-400 mt-2">Add your first product to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const remaining = product.quantityMade - product.quantitySold
        const isLowStock = remaining > 0 && remaining < 5
        const isBestSeller = product.quantitySold > 10

        return (
          <Card key={product.id} hover className="group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getTypeIcon(product.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(product.id!)}
                  className="p-2 rounded-lg hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(product.id!)}
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-900">
                  ${product.retailPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">In Stock:</span>
                <span className={`font-semibold ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                  {remaining}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sold:</span>
                <span className="font-semibold text-green-600">{product.quantitySold}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isLowStock && <Badge variant="warning">Low Stock</Badge>}
              {isBestSeller && (
                <Badge variant="success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Best Seller
                </Badge>
              )}
              {remaining === 0 && <Badge variant="danger">Out of Stock</Badge>}
            </div>

            {/* Revenue */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue:</span>
                <span className="font-semibold text-green-600">
                  ${(product.retailPrice * product.quantitySold).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
