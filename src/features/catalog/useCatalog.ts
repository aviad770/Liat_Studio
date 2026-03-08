import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { CatalogItem } from '../../lib/database.types'

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalog')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as CatalogItem[]
    },
  })
}

export function useAddCatalogItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<CatalogItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('catalog')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      toast.success('מוצר נוסף בהצלחה')
    },
    onError: () => toast.error('שגיאה בהוספת מוצר'),
  })
}

export function useUpdateCatalogItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CatalogItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('catalog')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      toast.success('מוצר עודכן')
    },
    onError: () => toast.error('שגיאה בעדכון מוצר'),
  })
}

export function useDeleteCatalogItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('catalog').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      toast.success('מוצר נמחק')
    },
    onError: () => toast.error('שגיאה במחיקת מוצר'),
  })
}

export function useUploadCatalogImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const { error } = await supabase.storage
        .from('catalog-images')
        .upload(fileName, file)
      if (error) throw error
      const { data: urlData } = supabase.storage
        .from('catalog-images')
        .getPublicUrl(fileName)
      return urlData.publicUrl
    },
    onError: () => toast.error('שגיאה בהעלאת תמונה'),
  })
}
