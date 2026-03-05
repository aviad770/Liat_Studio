import { useState } from 'react'
import { useExtras, useAddExtra, useUpdateExtra, useDeleteExtra } from './useExtras'
import { Modal } from '../../components/ui/Modal'
import type { AdditionalMaterial } from '../../lib/database.types'

export function ExtrasPage() {
  const { data: extras, isLoading } = useExtras()
  const addExtra = useAddExtra()
  const updateExtra = useUpdateExtra()
  const deleteExtra = useDeleteExtra()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editing, setEditing] = useState<AdditionalMaterial | null>(null)

  const handleToggleStock = (item: AdditionalMaterial) => {
    updateExtra.mutate({ id: item.id, in_stock: !item.in_stock })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sand-800">חומרים נוספים</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-terracotta-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta-700 min-h-[44px]"
        >
          + הוסף חומר
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-sand-100 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : extras?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">אין חומרים נוספים</p>
          <p className="text-sand-400 text-sm">הוסף חומר כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-3">
          {extras?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-sand-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1" onClick={() => setEditing(item)}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStock(item)
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                    item.in_stock
                      ? 'bg-success border-success text-white'
                      : 'bg-white border-sand-300 text-sand-300'
                  }`}
                >
                  {item.in_stock ? '✓' : ''}
                </button>
                <div className="cursor-pointer">
                  <h3 className="font-medium text-sand-800">{item.name}</h3>
                  <p className="text-xs text-sand-500">
                    {item.quantity > 0 ? `${item.quantity} יח׳` : ''}
                    {!item.in_stock && <span className="text-danger mr-2">חסר במלאי</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="הוסף חומר נוסף">
        <ExtraForm
          onSubmit={(data) => {
            addExtra.mutate(data, { onSuccess: () => setShowAddModal(false) })
          }}
          onCancel={() => setShowAddModal(false)}
          isLoading={addExtra.isPending}
        />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`עריכת ${editing?.name ?? ''}`}>
        {editing && (
          <>
            <ExtraForm
              initial={editing}
              onSubmit={(data) => {
                updateExtra.mutate({ id: editing.id, ...data }, { onSuccess: () => setEditing(null) })
              }}
              onCancel={() => setEditing(null)}
              isLoading={updateExtra.isPending}
            />
            <button
              onClick={() => {
                if (confirm(`למחוק את ${editing.name}?`)) {
                  deleteExtra.mutate(editing.id, { onSuccess: () => setEditing(null) })
                }
              }}
              className="w-full mt-4 py-3 text-danger border border-danger/30 rounded-lg hover:bg-danger/5 min-h-[44px]"
            >
              מחק חומר
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

function ExtraForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initial?: AdditionalMaterial
  onSubmit: (data: { name: string; in_stock: boolean; quantity: number }) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [inStock, setInStock] = useState(initial?.in_stock ?? true)
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">שם חומר *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
        />
      </div>
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
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="w-5 h-5 rounded border-sand-300"
        />
        <span className="text-sand-700">במלאי</span>
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onSubmit({ name, in_stock: inStock, quantity })}
          disabled={!name || isLoading}
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
