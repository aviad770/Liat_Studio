import { useState } from 'react'
import { useCatalog, useAddCatalogItem, useUpdateCatalogItem, useDeleteCatalogItem } from './useCatalog'
import { CatalogCard } from './CatalogCard'
import { CatalogForm } from './CatalogForm'
import { Modal } from '../../components/ui/Modal'
import type { CatalogItem } from '../../lib/database.types'

type Filter = 'all' | 'in_stock' | 'sold'

export function CatalogPage() {
  const { data: items, isLoading } = useCatalog()
  const addItem = useAddCatalogItem()
  const updateItem = useUpdateCatalogItem()
  const deleteItem = useDeleteCatalogItem()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editing, setEditing] = useState<CatalogItem | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = items?.filter((item) => {
    if (filter === 'in_stock') return item.in_stock && !item.sale_date
    if (filter === 'sold') return !!item.sale_date
    return true
  })

  const handleAdd = (data: Omit<CatalogItem, 'id' | 'created_at'>) => {
    addItem.mutate(data, { onSuccess: () => setShowAddModal(false) })
  }

  const handleUpdate = (data: Omit<CatalogItem, 'id' | 'created_at'>) => {
    if (!editing) return
    updateItem.mutate(
      { id: editing.id, ...data },
      { onSuccess: () => setEditing(null) }
    )
  }

  const handleDelete = () => {
    if (!editing) return
    if (confirm('למחוק את המוצר?')) {
      deleteItem.mutate(editing.id, { onSuccess: () => setEditing(null) })
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'הכל' },
    { key: 'in_stock', label: 'במלאי' },
    { key: 'sold', label: 'נמכרו' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sand-800">קטלוג מכירות</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[44px]"
        >
          + הוסף מוצר
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
              filter === f.key
                ? 'bg-terracotta-600 text-white'
                : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
            }`}
          >
            {f.label}
            {f.key !== 'all' && items && (
              <span className="mr-1 text-xs opacity-75">
                ({items.filter((i) =>
                  f.key === 'in_stock' ? i.in_stock && !i.sale_date : !!i.sale_date
                ).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-sand-100 rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">אין מוצרים להצגה</p>
          <p className="text-sand-400 text-sm">הוסף מוצר ראשון כדי להתחיל</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered?.map((item) => (
            <CatalogCard key={item.id} item={item} onClick={() => setEditing(item)} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="הוסף מוצר">
        <CatalogForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          isLoading={addItem.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="עריכת מוצר">
        {editing && (
          <>
            <CatalogForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              isLoading={updateItem.isPending}
            />
            <button
              onClick={handleDelete}
              disabled={deleteItem.isPending}
              className="w-full mt-4 py-3 text-red-600 border border-red-200 rounded-lg font-medium min-h-[44px] hover:bg-red-50"
            >
              {deleteItem.isPending ? 'מוחק...' : 'מחק מוצר'}
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}
