import type { CatalogItem } from '../../lib/database.types'
import { formatDate } from '../../lib/utils'

interface CatalogCardProps {
  item: CatalogItem
  onClick: () => void
}

export function CatalogCard({ item, onClick }: CatalogCardProps) {
  const isSold = !!item.sale_date

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden cursor-pointer active:bg-sand-50"
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.description}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-sand-100 flex items-center justify-center text-sand-400 text-4xl">
          🏺
        </div>
      )}

      <div className="p-3">
        <p className="font-bold text-sand-800 text-sm mb-1 line-clamp-2">{item.description}</p>
        {item.glaze_color && (
          <p className="text-xs text-sand-500 mb-1">גלזורה: {item.glaze_color}</p>
        )}
        {item.clay_type && (
          <p className="text-xs text-sand-500 mb-1">חימר: {item.clay_type}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-terracotta-600">₪{item.sale_price}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              isSold
                ? 'bg-sand-200 text-sand-600'
                : item.in_stock
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isSold ? 'נמכר' : item.in_stock ? 'במלאי' : 'אזל'}
          </span>
        </div>
        {isSold && item.sale_date && (
          <p className="text-xs text-sand-400 mt-1">נמכר: {formatDate(item.sale_date)}</p>
        )}
      </div>
    </div>
  )
}
