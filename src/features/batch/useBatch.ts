import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { RecipeIngredient, Material } from '../../lib/database.types'

export interface BatchIngredient {
  material: Material
  ingredient: RecipeIngredient
  requiredGrams: number
  remainingAfter: number
  deficit: number
}

export function calculateBatch(
  ingredients: (RecipeIngredient & { materials: Material })[],
  quantityKg: number
): BatchIngredient[] {
  const totalRatio = ingredients.reduce((sum, i) => sum + i.weight_ratio, 0)

  return ingredients.map((ing) => {
    const fraction = totalRatio > 0 ? ing.weight_ratio / totalRatio : 0
    const requiredGrams = Math.round(fraction * quantityKg * 1000)
    const remainingAfter = ing.materials.quantity_grams - requiredGrams
    const deficit = remainingAfter < 0 ? Math.abs(remainingAfter) : 0

    return {
      material: ing.materials,
      ingredient: ing,
      requiredGrams,
      remainingAfter: Math.max(remainingAfter, 0),
      deficit,
    }
  })
}

export function useConfirmBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ recipeId, quantityKg }: { recipeId: string; quantityKg: number }) => {
      // Call the database RPC function for atomic deduction
      const { error: rpcError } = await supabase.rpc('deduct_batch', {
        p_recipe_id: recipeId,
        p_quantity_kg: quantityKg,
      })
      if (rpcError) throw rpcError

      // Log the batch
      const { error: batchError } = await supabase
        .from('batches')
        .insert({ recipe_id: recipeId, quantity_kg: quantityKg })
      if (batchError) throw batchError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('הכנה אושרה — המלאי עודכן')
    },
    onError: () => toast.error('שגיאה באישור הכנה'),
  })
}
