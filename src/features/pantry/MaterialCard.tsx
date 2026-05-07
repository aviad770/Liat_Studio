import type { Material } from '../../lib/database.types'
import { formatWeight, formatDate } from '../../lib/utils'
import { StockBar } from '../../components/ui/StockBar'

interface MaterialCardProps {
  material: Material
  onEdit: (material: Material) => void
  onQuickUpdate: (id: string, quantityGrams: number) => void
  onReceiveStock: (id: string, addedGrams: number) => void
}

export function MaterialCard({ material, onEdit, onQuickUpdate, onReceiveStock }: MaterialCardProps) {
  const isLow = material.quantity_grams <= material.min_threshold

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer active:bg-sand-50 transition-colors ${
        isLow ? 'border-danger/30' : 'border-sand-200'
      }`}
      onClick={() => onEdit(material)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-sand-800">{material.name}</h3>
          {material.supplier && (
            <p className="text-xs text-sand-500">{material.supplier}</p>
          )}
        </div>
        <div className="text-left flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const received = prompt(`כמה גרם התקבלו של ${material.name}?`, '')
              if (received !== null && received.trim() !== '') {
                onReceiveStock(material.id, Number(received))
              }
            }}
            className="text-sm bg-success/10 text-success border border-success/30 rounded-lg px-2 py-1 min-h-[32px] hover:bg-success/20"
            title="קבלת חומר — הוספה למלאי"
          >
            + קבלה
          </button>
          <span
            className={`text-lg font-bold ${isLow ? 'text-danger' : 'text-success'}`}
            onClick={(e) => {
              e.stopPropagation()
              const newQty = prompt('כמות חדשה (גרם):', String(material.quantity_grams))
              if (newQty !== null) {
                onQuickUpdate(material.id, Number(newQty))
              }
            }}
          >
            {formatWeight(material.quantity_grams)}
          </span>
        </div>
      </div>

      <StockBar current={material.quantity_grams} threshold={material.min_threshold} />

      <div className="flex justify-between items-center mt-2 text-xs text-sand-500">
        <span>סף: {formatWeight(material.min_threshold)}</span>
        <span>₪{material.price}</span>
        <span>עודכן: {formatDate(material.updated_at)}</span>
      </div>
    </div>
  )
}
