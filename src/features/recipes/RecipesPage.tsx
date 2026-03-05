import { useState } from 'react'
import { useRecipes, useAddRecipe, useDeleteRecipe, usePromoteToRegular, useRecipeWithIngredients, useAddIngredient, useDeleteIngredient, useTestIterations, useAddTestIteration } from './useRecipes'
import { useMaterials } from '../pantry/useMaterials'
import { Modal } from '../../components/ui/Modal'
import { formatDate } from '../../lib/utils'
import type { Recipe } from '../../lib/database.types'

export function RecipesPage() {
  const [activeTab, setActiveTab] = useState<'regular' | 'test'>('regular')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const { data: recipes, isLoading } = useRecipes(activeTab === 'test')
  const addRecipe = useAddRecipe()
  const deleteRecipe = useDeleteRecipe()
  const promoteToRegular = usePromoteToRegular()

  const handleAdd = () => {
    addRecipe.mutate(
      { name: newName, description: newDesc, is_test: activeTab === 'test' },
      {
        onSuccess: () => {
          setShowAddModal(false)
          setNewName('')
          setNewDesc('')
        },
      }
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sand-800">מתכונים</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-terracotta-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta-700 min-h-[44px]"
        >
          + הוסף מתכון
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('regular')}
          className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] ${
            activeTab === 'regular'
              ? 'bg-terracotta-600 text-white'
              : 'bg-sand-100 text-sand-600'
          }`}
        >
          מתכונים שוטפים
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] ${
            activeTab === 'test'
              ? 'bg-terracotta-600 text-white'
              : 'bg-sand-100 text-sand-600'
          }`}
        >
          טסט מעבדה
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-sand-100 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : recipes?.length === 0 ? (
        <p className="text-center text-sand-500 py-8">
          {activeTab === 'regular' ? 'אין מתכונים שוטפים' : 'אין מתכוני טסט'}
        </p>
      ) : (
        <div className="space-y-3">
          {recipes?.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-xl p-4 shadow-sm border border-sand-200 cursor-pointer active:bg-sand-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sand-800">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="text-sm text-sand-500">{recipe.description}</p>
                  )}
                </div>
                <span className="text-xs text-sand-400">{formatDate(recipe.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Recipe Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="הוסף מתכון">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1">שם מתכון *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1">תיאור</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
              rows={2}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName || addRecipe.isPending}
            className="w-full py-3 bg-terracotta-600 text-white rounded-lg font-medium disabled:opacity-50 min-h-[44px]"
          >
            {addRecipe.isPending ? 'שומר...' : 'הוסף'}
          </button>
        </div>
      </Modal>

      {/* Recipe Detail Modal */}
      <Modal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.name ?? ''}
      >
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onDelete={() => {
              if (confirm(`למחוק את ${selectedRecipe.name}?`)) {
                deleteRecipe.mutate(selectedRecipe.id, {
                  onSuccess: () => setSelectedRecipe(null),
                })
              }
            }}
            onPromote={
              selectedRecipe.is_test
                ? () => {
                    promoteToRegular.mutate(selectedRecipe.id, {
                      onSuccess: () => setSelectedRecipe(null),
                    })
                  }
                : undefined
            }
          />
        )}
      </Modal>
    </div>
  )
}

function RecipeDetail({
  recipe,
  onDelete,
  onPromote,
}: {
  recipe: Recipe
  onDelete: () => void
  onPromote?: () => void
}) {
  const { data } = useRecipeWithIngredients(recipe.id)
  const { data: materials } = useMaterials()
  const addIngredient = useAddIngredient()
  const deleteIngredient = useDeleteIngredient()
  const { data: iterations } = useTestIterations(recipe.is_test ? recipe.id : null)
  const addIteration = useAddTestIteration()

  const [addingIngredient, setAddingIngredient] = useState(false)
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [weightRatio, setWeightRatio] = useState(0)
  const [newResult, setNewResult] = useState('')

  const totalRatio = data?.ingredients.reduce((sum, i) => sum + i.weight_ratio, 0) ?? 0

  return (
    <div className="space-y-4">
      {recipe.description && <p className="text-sand-600">{recipe.description}</p>}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sand-700">רכיבים</h4>
          <button
            onClick={() => setAddingIngredient(true)}
            className="text-sm text-terracotta-600 font-medium"
          >
            + הוסף רכיב
          </button>
        </div>

        {data?.ingredients.length === 0 ? (
          <p className="text-sm text-sand-400">אין רכיבים</p>
        ) : (
          <div className="space-y-2">
            {data?.ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between bg-sand-50 rounded-lg px-3 py-2">
                <span className="text-sand-800">{ing.materials.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-sand-600">
                    {totalRatio > 0 ? ((ing.weight_ratio / totalRatio) * 100).toFixed(1) : 0}%
                  </span>
                  <button
                    onClick={() => deleteIngredient.mutate({ id: ing.id, recipeId: recipe.id })}
                    className="text-danger text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addingIngredient && (
          <div className="mt-3 p-3 bg-sand-50 rounded-lg space-y-2">
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
            >
              <option value="">בחר חומר</option>
              {materials?.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="יחס משקל"
              value={weightRatio || ''}
              onChange={(e) => setWeightRatio(Number(e.target.value))}
              className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white"
              min={0}
              step={0.1}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  addIngredient.mutate(
                    { recipe_id: recipe.id, material_id: selectedMaterialId, weight_ratio: weightRatio },
                    {
                      onSuccess: () => {
                        setAddingIngredient(false)
                        setSelectedMaterialId('')
                        setWeightRatio(0)
                      },
                    }
                  )
                }}
                disabled={!selectedMaterialId || weightRatio <= 0}
                className="flex-1 py-2 bg-terracotta-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                הוסף
              </button>
              <button
                onClick={() => setAddingIngredient(false)}
                className="px-4 py-2 border border-sand-300 rounded-lg text-sm"
              >
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Test iterations */}
      {recipe.is_test && (
        <div>
          <h4 className="font-bold text-sand-700 mb-2">איטרציות טסט</h4>
          {iterations?.map((iter) => (
            <div key={iter.id} className="bg-sand-50 rounded-lg px-3 py-2 mb-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">טסט {iter.iteration_number}</span>
                <span className="text-sand-500">{formatDate(iter.date)}</span>
              </div>
              <p className="text-sm text-sand-600 mt-1">{iter.result_text}</p>
            </div>
          ))}
          <div className="mt-2 space-y-2">
            <textarea
              placeholder="תוצאת טסט חדש..."
              value={newResult}
              onChange={(e) => setNewResult(e.target.value)}
              className="w-full px-3 py-2 border border-sand-300 rounded-lg bg-white text-sm"
              rows={2}
            />
            <button
              onClick={() => {
                addIteration.mutate(
                  {
                    recipe_id: recipe.id,
                    iteration_number: (iterations?.length ?? 0) + 1,
                    date: new Date().toISOString().split('T')[0],
                    result_text: newResult,
                  },
                  { onSuccess: () => setNewResult('') }
                )
              }}
              disabled={!newResult}
              className="w-full py-2 bg-clay-600 text-white rounded-lg text-sm disabled:opacity-50"
            >
              + הוסף טסט {(iterations?.length ?? 0) + 1}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {onPromote && (
          <button
            onClick={onPromote}
            className="flex-1 py-3 bg-success text-white rounded-lg font-medium min-h-[44px]"
          >
            העבר למתכונים שוטפים
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-6 py-3 text-danger border border-danger/30 rounded-lg min-h-[44px]"
        >
          מחק
        </button>
      </div>
    </div>
  )
}
