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
          <div className="w-20 h-20 rounded-3xl bg-white mx-auto mb-6 flex items-center justify-center">
            <Package className="w-10 h-10 text-black" />
          </div>
          <p className="text-zinc-300 text-lg font-medium">No products yet</p>
          <p className="text-zinc-500 mt-2">Add your first product to get started</p>
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
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-zinc-400 capitalize">{product.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(product.id!)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Edit className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => handleDelete(product.id!)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300 transition-colors" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Price:</span>
                <span className="font-semibold text-white">
                  ${product.retailPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">In Stock:</span>
                <span className={`font-semibold ${isLowStock ? 'text-orange-400' : 'text-white'}`}>
                  {remaining}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Sold:</span>
                <span className="font-semibold text-green-400">{product.quantitySold}</span>
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
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total Revenue:</span>
                <span className="font-semibold text-green-400">
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
