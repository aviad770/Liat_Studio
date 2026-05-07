import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface ParsedReceiptItem {
  material_name: string
  matched_material_id: string | null
  grams_received: number | null
  raw_text: string
}

interface ParseReceiptResponse {
  items: ParsedReceiptItem[]
  usage?: { input_tokens: number; output_tokens: number }
  error?: string
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function useParseReceipt() {
  return useMutation({
    mutationFn: async ({
      file,
      materials,
    }: {
      file: File
      materials: Array<{ id: string; name: string }>
    }): Promise<ParseReceiptResponse> => {
      const imageBase64 = await fileToBase64(file)

      const { data, error } = await supabase.functions.invoke<ParseReceiptResponse>('parse-receipt', {
        body: { imageBase64, mimeType: file.type, materials },
      })

      if (error) throw error
      if (!data) throw new Error('No data returned from edge function')
      if (data.error) throw new Error(data.error)

      return data
    },
  })
}

export async function uploadReceiptImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage.from('receipts').upload(path, file)
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('receipts').getPublicUrl(path)
  return data.publicUrl
}
