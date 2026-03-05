import { useState } from 'react'
import type { Material } from '../../lib/database.types'
import type { MaterialInput } from '../../lib/schemas'

interface MaterialFormProps {
  initial?: Material
  onSubmit: (data: MaterialInput) => void
  onCancel: () => void
  isLoading: boolean
}

export function MaterialForm({ initial, onSubmit, onCancel, isLoading }: MaterialFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [supplier, setSupplier] = useState(initial?.supplier ?? '')
  const [quantityGrams, setQuantityGrams] = useState(initial?.quantity_grams ?? 0)
  const [price, setPrice] = useState(initial?.price ?? 0)
  const [minThreshold, setMinThreshold] = useState(initial?.min_threshold ?? 1000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      supplier,
      quantity_grams: quantityGrams,
      price,
      min_threshold: minThreshold,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">שם חומר *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          placeholder="למשל: קאולין"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">ספק</label>
        <input
          type="text"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          placeholder="למשל: מינרקו"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">כמות (גרם)</label>
          <input
            type="number"
            value={quantityGrams}
            onChange={(e) => setQuantityGrams(Number(e.target.value))}
            min={0}
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">מחיר (₪)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={0.01}
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">סף מינימום (גרם)</label>
        <input
          type="number"
          value={minThreshold}
          onChange={(e) => setMinThreshold(Number(e.target.value))}
          min={0}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
        />
        <p className="text-xs text-sand-500 mt-1">כשהכמות יורדת מתחת לסף — החומר ייכנס לרשימת הזמנות</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || !name}
          className="flex-1 py-3 bg-terracotta-600 text-white rounded-lg font-medium hover:bg-terracotta-700 disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? 'שומר...' : initial ? 'עדכן' : 'הוסף'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-sand-300 text-sand-700 rounded-lg hover:bg-sand-50 min-h-[44px]"
        >
          ביטול
        </button>
      </div>
    </form>
  )
}
