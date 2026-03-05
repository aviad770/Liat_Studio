import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Colorant } from '../../lib/database.types'

export function useColorants() {
  return useQuery({
    queryKey: ['colorants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colorants')
        .select('*')
        .order('color')
      if (error) throw error
      return data as Colorant[]
    },
  })
}

export function useAddColorant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { color: string; catalog_number: string; supplier: string; quantity: number; price: number }) => {
      const { data, error } = await supabase
        .from('colorants')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colorants'] })
      toast.success('צובע נוסף בהצלחה')
    },
    onError: () => toast.error('שגיאה בהוספת צובע'),
  })
}

export function useUpdateColorant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Colorant> & { id: string }) => {
      const { data, error } = await supabase
        .from('colorants')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colorants'] })
      toast.success('צובע עודכן')
    },
    onError: () => toast.error('שגיאה בעדכון צובע'),
  })
}

export function useDeleteColorant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('colorants').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colorants'] })
      toast.success('צובע נמחק')
    },
    onError: () => toast.error('שגיאה במחיקת צובע'),
  })
}
