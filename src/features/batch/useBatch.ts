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
  batches: number
): BatchIngredient[] {
  return ingredients.map((ing) => {
    const requiredGrams = Math.round(ing.weight_ratio * batches)
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
    mutationFn: async ({ recipeId, batches }: { recipeId: string; batches: number }) => {
      // Call the database RPC function for atomic deduction
      const { error: rpcError } = await supabase.rpc('deduct_batch', {
        p_recipe_id: recipeId,
        p_quantity_kg: batches,
      })
      if (rpcError) throw rpcError

      // Log the batch (quantity_kg column repurposed as batch multiplier)
      const { error: batchError } = await supabase
        .from('batches')
        .insert({ recipe_id: recipeId, quantity_kg: batches })
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
