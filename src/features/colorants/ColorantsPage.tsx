import { useState } from 'react'
import { useColorants, useAddColorant, useUpdateColorant, useDeleteColorant } from './useColorants'
import { Modal } from '../../components/ui/Modal'
import type { Colorant } from '../../lib/database.types'

export function ColorantsPage() {
  const { data: colorants, isLoading } = useColorants()
  const addColorant = useAddColorant()
  const updateColorant = useUpdateColorant()
  const deleteColorant = useDeleteColorant()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editing, setEditing] = useState<Colorant | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sand-800">צובענים</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-terracotta-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta-700 min-h-[44px]"
        >
          + הוסף צובע
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-sand-100 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : colorants?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">אין צובענים</p>
          <p className="text-sand-400 text-sm">הוסף צובע ראשון כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-3">
          {colorants?.map((c) => (
            <div
              key={c.id}
              onClick={() => setEditing(c)}
              className="bg-white rounded-xl p-4 shadow-sm border border-sand-200 cursor-pointer active:bg-sand-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sand-800">{c.color}</h3>
                  <p className="text-sm text-sand-500">קטלוג: {c.catalog_number}</p>
                </div>
                <div className="text-left">
                  <span className={`font-bold ${c.quantity <= 0 ? 'text-danger' : 'text-sand-800'}`}>
                    {c.quantity} יח׳
                  </span>
                  <p className="text-xs text-sand-500">{c.supplier}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="הוסף צובע">
        <ColorantForm
          onSubmit={(data) => {
            addColorant.mutate(data, { onSuccess: () => setShowAddModal(false) })
          }}
          onCancel={() => setShowAddModal(false)}
          isLoading={addColorant.isPending}
        />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`עריכת ${editing?.color ?? ''}`}>
        {editing && (
          <>
            <ColorantForm
              initial={editing}
              onSubmit={(data) => {
                updateColorant.mutate({ id: editing.id, ...data }, { onSuccess: () => setEditing(null) })
              }}
              onCancel={() => setEditing(null)}
              isLoading={updateColorant.isPending}
            />
            <button
              onClick={() => {
                if (confirm(`למחוק את ${editing.color}?`)) {
                  deleteColorant.mutate(editing.id, { onSuccess: () => setEditing(null) })
                }
              }}
              className="w-full mt-4 py-3 text-danger border border-danger/30 rounded-lg hover:bg-danger/5 min-h-[44px]"
            >
              מחק צובע
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

function ColorantForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initial?: Colorant
  onSubmit: (data: { color: string; catalog_number: string; supplier: string; quantity: number; price: number }) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [color, setColor] = useState(initial?.color ?? '')
  const [catalogNumber, setCatalogNumber] = useState(initial?.catalog_number ?? '')
  const [supplier, setSupplier] = useState(initial?.supplier ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0)
  const [price, setPrice] = useState(initial?.price ?? 0)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">צבע *</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">מק״ט</label>
        <input
          type="text"
          value={catalogNumber}
          onChange={(e) => setCatalogNumber(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">ספק</label>
        <input
          type="text"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">כמות</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={0}
            className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">מחיר (₪)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={0.1}
            className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSubmit({ color, catalog_number: catalogNumber, supplier, quantity, price })}
          disabled={!color || isLoading}
          className="flex-1 py-3 bg-terracotta-600 text-white rounded-lg font-medium disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? 'שומר...' : initial ? 'עדכן' : 'הוסף'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-sand-300 rounded-lg min-h-[44px]"
        >
          ביטול
        </button>
      </div>
    </div>
  )
}
