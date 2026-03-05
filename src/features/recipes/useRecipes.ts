import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Recipe, RecipeIngredient } from '../../lib/database.types'

export function useRecipes(isTest = false) {
  return useQuery({
    queryKey: ['recipes', isTest],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_test', isTest)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Recipe[]
    },
  })
}

export function useRecipeWithIngredients(recipeId: string | null) {
  return useQuery({
    queryKey: ['recipe', recipeId],
    enabled: !!recipeId,
    queryFn: async () => {
      const [recipeRes, ingredientsRes] = await Promise.all([
        supabase.from('recipes').select('*').eq('id', recipeId!).single(),
        supabase
          .from('recipe_ingredients')
          .select('*, materials(name)')
          .eq('recipe_id', recipeId!),
      ])
      if (recipeRes.error) throw recipeRes.error
      if (ingredientsRes.error) throw ingredientsRes.error
      return {
        recipe: recipeRes.data as Recipe,
        ingredients: ingredientsRes.data as (RecipeIngredient & { materials: { name: string } })[],
      }
    },
  })
}

export function useAddRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { name: string; description: string; is_test: boolean }) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Recipe
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recipes', data.is_test] })
      toast.success('מתכון נוסף בהצלחה')
    },
    onError: () => toast.error('שגיאה בהוספת מתכון'),
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('recipes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('מתכון נמחק')
    },
    onError: () => toast.error('שגיאה במחיקת מתכון'),
  })
}

export function useAddIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { recipe_id: string; material_id: string; weight_ratio: number }) => {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', vars.recipe_id] })
      toast.success('רכיב נוסף')
    },
    onError: () => toast.error('שגיאה בהוספת רכיב'),
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, recipeId }: { id: string; recipeId: string }) => {
      const { error } = await supabase.from('recipe_ingredients').delete().eq('id', id)
      if (error) throw error
      return recipeId
    },
    onSuccess: (recipeId) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
    },
    onError: () => toast.error('שגיאה במחיקת רכיב'),
  })
}

export function usePromoteToRegular() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (recipeId: string) => {
      const { error } = await supabase
        .from('recipes')
        .update({ is_test: false, promoted_from_test_id: recipeId })
        .eq('id', recipeId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('מתכון הועבר למתכונים שוטפים')
    },
    onError: () => toast.error('שגיאה בהעברת מתכון'),
  })
}

export function useTestIterations(recipeId: string | null) {
  return useQuery({
    queryKey: ['test_iterations', recipeId],
    enabled: !!recipeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_iterations')
        .select('*')
        .eq('recipe_id', recipeId!)
        .order('iteration_number')
      if (error) throw error
      return data
    },
  })
}

export function useAddTestIteration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      recipe_id: string
      iteration_number: number
      date: string
      result_text: string
    }) => {
      const { data, error } = await supabase
        .from('test_iterations')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['test_iterations', vars.recipe_id] })
      toast.success('טסט נוסף')
    },
    onError: () => toast.error('שגיאה בהוספת טסט'),
  })
}
