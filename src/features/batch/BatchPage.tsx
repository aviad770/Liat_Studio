import { useState } from 'react'
import { useRecipes, useRecipeWithIngredients } from '../recipes/useRecipes'
import { useMaterials } from '../pantry/useMaterials'
import { calculateBatch, useConfirmBatch } from './useBatch'
import { formatWeight } from '../../lib/utils'
import type { Material } from '../../lib/database.types'

export function BatchPage() {
  const { data: recipes } = useRecipes(false)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [quantityKg, setQuantityKg] = useState<number>(1)
  const { data: recipeData } = useRecipeWithIngredients(selectedRecipeId || null)
  const { data: allMaterials } = useMaterials()
  const confirmBatch = useConfirmBatch()

  const batchItems = recipeData && allMaterials
    ? calculateBatch(
        recipeData.ingredients.map((ing) => ({
          ...ing,
          materials: allMaterials.find((m) => m.id === ing.material_id) as Material,
        })).filter((ing) => ing.materials),
        quantityKg
      )
    : []

  const hasDeficit = batchItems.some((b) => b.deficit > 0)

  const handleConfirm = () => {
    const msg = hasDeficit
      ? 'יש חוסרים בחלק מהחומרים. להמשיך בכל זאת?'
      : 'לאשר הכנה ולעדכן מלאי?'
    if (confirm(msg)) {
      confirmBatch.mutate(
        { recipeId: selectedRecipeId, quantityKg },
        {
          onSuccess: () => {
            setSelectedRecipeId('')
            setQuantityKg(1)
          },
        }
      )
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-sand-800 mb-4">הכנת גלזורה</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">בחר מתכון</label>
          <select
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
            className="w-full px-3 py-3 border border-sand-300 rounded-lg bg-white min-h-[44px]"
          >
            <option value="">— בחר מתכון —</option>
            {recipes?.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {selectedRecipeId && (
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1">כמות (ק״ג)</label>
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              min={0.1}
              step={0.1}
              className="w-full px-3 py-3 border border-sand-300 rounded-lg bg-white min-h-[44px]"
            />
          </div>
        )}

        {batchItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-sand-700">חומרים נדרשים:</h3>
            {batchItems.map((item) => (
              <div
                key={item.material.id}
                className={`bg-white rounded-xl p-3 border ${
                  item.deficit > 0 ? 'border-danger/30' : 'border-sand-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sand-800">{item.material.name}</span>
                  <span className="text-sm text-sand-600">{formatWeight(item.requiredGrams)}</span>
                </div>
                <div className="h-3 bg-sand-200 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    {/* Remaining after deduction */}
                    <div
                      className="h-full bg-success transition-all"
                      style={{
                        width: `${
                          item.material.quantity_grams > 0
                            ? (item.remainingAfter / item.material.quantity_grams) * 100
                            : 0
                        }%`,
                      }}
                    />
                    {/* What will be used */}
                    <div
                      className={`h-full ${item.deficit > 0 ? 'bg-danger' : 'bg-warning'} transition-all`}
                      style={{
                        width: `${
                          item.material.quantity_grams > 0
                            ? (Math.min(item.requiredGrams, item.material.quantity_grams) /
                                item.material.quantity_grams) *
                              100
                            : 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-sand-500 mt-1">
                  <span>במלאי: {formatWeight(item.material.quantity_grams)}</span>
                  <span>
                    {item.deficit > 0
                      ? `⚠️ חסרים ${formatWeight(item.deficit)}`
                      : `יישאר: ${formatWeight(item.remainingAfter)}`}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={handleConfirm}
              disabled={confirmBatch.isPending}
              className={`w-full py-3 rounded-lg font-bold min-h-[44px] ${
                hasDeficit
                  ? 'bg-warning text-white'
                  : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
              } disabled:opacity-50`}
            >
              {confirmBatch.isPending
                ? 'מעדכן מלאי...'
                : hasDeficit
                  ? '⚠️ אשר הכנה (יש חוסרים)'
                  : '✓ אשר הכנה'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
