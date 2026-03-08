import { useMaterials } from '../pantry/useMaterials'
import { useRecipes } from '../recipes/useRecipes'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { RecipeIngredient } from '../../lib/database.types'

function useAllRecipeIngredients(recipeIds: string[]) {
  return useQuery({
    queryKey: ['all_recipe_ingredients', recipeIds],
    enabled: recipeIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .in('recipe_id', recipeIds)
      if (error) throw error
      return data as RecipeIngredient[]
    },
  })
}

export function MatrixPage() {
  const { data: materials, isLoading: loadingMaterials } = useMaterials()
  const { data: recipes, isLoading: loadingRecipes } = useRecipes(false)

  const recipeIds = recipes?.map((r) => r.id) ?? []
  const { data: allIngredients, isLoading: loadingIngredients } = useAllRecipeIngredients(recipeIds)

  const isLoading = loadingMaterials || loadingRecipes || loadingIngredients

  // Build lookup: recipeId -> Set of materialIds
  const recipeMatMap = new Map<string, Set<string>>()
  allIngredients?.forEach((ing) => {
    if (!recipeMatMap.has(ing.recipe_id)) recipeMatMap.set(ing.recipe_id, new Set())
    recipeMatMap.get(ing.recipe_id)!.add(ing.material_id)
  })

  // Filter materials that appear in at least one recipe
  const usedMaterials = materials?.filter((m) =>
    allIngredients?.some((ing) => ing.material_id === m.id)
  ) ?? []

  return (
    <div>
      <h2 className="text-xl font-bold text-sand-800 mb-4">מטריצת חומרים-גלזורות</h2>

      {isLoading ? (
        <div className="bg-sand-100 rounded-xl h-48 animate-pulse" />
      ) : !recipes?.length || !usedMaterials.length ? (
        <div className="text-center py-12">
          <p className="text-sand-500 text-lg mb-2">אין נתונים להצגה</p>
          <p className="text-sand-400 text-sm">הוסף מתכונים עם רכיבים כדי לראות את הטבלה</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky right-0 z-10 bg-sand-100 px-3 py-2 text-right font-bold text-sand-700 border border-sand-200 min-w-[120px]">
                  חומר \ גלזורה
                </th>
                {recipes.map((r) => (
                  <th
                    key={r.id}
                    className="bg-sand-100 px-3 py-2 text-center font-medium text-sand-700 border border-sand-200 min-w-[80px]"
                  >
                    <span className="writing-mode-vertical whitespace-nowrap">{r.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usedMaterials.map((mat) => (
                <tr key={mat.id}>
                  <td className="sticky right-0 z-10 bg-white px-3 py-2 font-medium text-sand-800 border border-sand-200">
                    {mat.name}
                  </td>
                  {recipes.map((r) => {
                    const has = recipeMatMap.get(r.id)?.has(mat.id)
                    return (
                      <td
                        key={r.id}
                        className={`px-3 py-2 text-center border border-sand-200 ${
                          has ? 'bg-terracotta-100 text-terracotta-700' : 'bg-white text-sand-300'
                        }`}
                      >
                        {has ? '●' : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
