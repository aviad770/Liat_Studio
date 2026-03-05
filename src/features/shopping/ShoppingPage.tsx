import { useState } from 'react'
import { useShopping, formatShoppingList } from './useShopping'
import { formatWeight } from '../../lib/utils'
import toast from 'react-hot-toast'

export function ShoppingPage() {
  const { grouped, lowStockItems, isLoading } = useShopping()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = formatShoppingList(grouped)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('רשימה הועתקה')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('שגיאה בהעתקה')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sand-800">רשימת הזמנות</h2>
        {lowStockItems.length > 0 && (
          <button
            onClick={handleCopy}
            className="bg-terracotta-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta-700 min-h-[44px]"
          >
            {copied ? '✓ הועתק' : 'העתק רשימה'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-sand-100 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : lowStockItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">כל החומרים במלאי תקין</p>
          <p className="text-sand-400 text-sm">אין חומרים מתחת לסף המינימום</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.supplier} className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
              <div className="bg-sand-100 px-4 py-2 border-b border-sand-200">
                <h3 className="font-bold text-sand-700">{group.supplier}</h3>
              </div>
              <div className="divide-y divide-sand-100">
                {group.items.map((item) => (
                  <div key={item.material.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sand-800">{item.material.name}</span>
                      <div className="text-xs text-sand-500 mt-0.5">
                        במלאי: {formatWeight(item.material.quantity_grams)} / סף: {formatWeight(item.material.min_threshold)}
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-danger">{formatWeight(item.toOrder)}</span>
                      <div className="text-xs text-sand-500">להזמין</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-xs text-sand-400 mt-4">
            {lowStockItems.length} חומרים מתחת לסף מינימום
          </p>
        </div>
      )}
    </div>
  )
}
