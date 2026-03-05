import { useState } from 'react'
import { useMaterials, useAddMaterial, useUpdateMaterial, useDeleteMaterial } from './useMaterials'
import { MaterialCard } from './MaterialCard'
import { MaterialForm } from './MaterialForm'
import { Modal } from '../../components/ui/Modal'
import type { Material } from '../../lib/database.types'
import type { MaterialInput } from '../../lib/schemas'

export function PantryPage() {
  const { data: materials, isLoading, error } = useMaterials()
  const addMaterial = useAddMaterial()
  const updateMaterial = useUpdateMaterial()
  const deleteMaterial = useDeleteMaterial()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  const handleAdd = (data: MaterialInput) => {
    addMaterial.mutate(data, { onSuccess: () => setShowAddModal(false) })
  }

  const handleUpdate = (data: MaterialInput) => {
    if (!editingMaterial) return
    updateMaterial.mutate(
      { id: editingMaterial.id, ...data },
      { onSuccess: () => setEditingMaterial(null) }
    )
  }

  const handleDelete = () => {
    if (!editingMaterial) return
    if (confirm(`למחוק את ${editingMaterial.name}?`)) {
      deleteMaterial.mutate(editingMaterial.id, {
        onSuccess: () => setEditingMaterial(null),
      })
    }
  }

  const handleQuickUpdate = (id: string, quantityGrams: number) => {
    if (!isNaN(quantityGrams) && quantityGrams >= 0) {
      updateMaterial.mutate({ id, quantity_grams: quantityGrams })
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger mb-2">שגיאה בטעינת נתונים</p>
        <p className="text-sand-500 text-sm">בדוק את החיבור לשרת</p>
      </div>
    )
  }

  const lowStockCount = materials?.filter((m) => m.quantity_grams <= m.min_threshold).length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-sand-800">מחסן חומרים</h2>
          {lowStockCount > 0 && (
            <p className="text-sm text-danger">{lowStockCount} חומרים מתחת לסף</p>
          )}
        </div>
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
            <div key={i} className="bg-sand-100 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : materials?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">אין חומרים במלאי</p>
          <p className="text-sand-400 text-sm">הוסף חומר ראשון כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials?.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onEdit={setEditingMaterial}
              onQuickUpdate={handleQuickUpdate}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="הוסף חומר חדש"
      >
        <MaterialForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          isLoading={addMaterial.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingMaterial}
        onClose={() => setEditingMaterial(null)}
        title={`עריכת ${editingMaterial?.name ?? ''}`}
      >
        {editingMaterial && (
          <>
            <MaterialForm
              initial={editingMaterial}
              onSubmit={handleUpdate}
              onCancel={() => setEditingMaterial(null)}
              isLoading={updateMaterial.isPending}
            />
            <button
              onClick={handleDelete}
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
