import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Material } from '../../lib/database.types'
import type { MaterialInput } from '../../lib/schemas'

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name')
      if (error) throw error
      return data as Material[]
    },
  })
}

export function useAddMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MaterialInput) => {
      const { data, error } = await supabase
        .from('materials')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('חומר נוסף בהצלחה')
    },
    onError: () => toast.error('שגיאה בהוספת חומר'),
  })
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<MaterialInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('materials')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('חומר עודכן')
    },
    onError: () => toast.error('שגיאה בעדכון חומר'),
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('חומר נמחק')
    },
    onError: () => toast.error('שגיאה במחיקת חומר'),
  })
}
