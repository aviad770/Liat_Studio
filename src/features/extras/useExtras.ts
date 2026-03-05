import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { AdditionalMaterial } from '../../lib/database.types'

export function useExtras() {
  return useQuery({
    queryKey: ['additional_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('additional_materials')
        .select('*')
        .order('name')
      if (error) throw error
      return data as AdditionalMaterial[]
    },
  })
}

export function useAddExtra() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { name: string; in_stock: boolean; quantity: number }) => {
      const { data, error } = await supabase
        .from('additional_materials')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional_materials'] })
      toast.success('חומר נוסף בהצלחה')
    },
    onError: () => toast.error('שגיאה בהוספת חומר'),
  })
}

export function useUpdateExtra() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<AdditionalMaterial> & { id: string }) => {
      const { data, error } = await supabase
        .from('additional_materials')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional_materials'] })
      toast.success('חומר עודכן')
    },
    onError: () => toast.error('שגיאה בעדכון חומר'),
  })
}

export function useDeleteExtra() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('additional_materials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional_materials'] })
      toast.success('חומר נמחק')
    },
    onError: () => toast.error('שגיאה במחיקת חומר'),
  })
}
