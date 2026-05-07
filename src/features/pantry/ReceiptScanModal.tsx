import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { supabase } from '../../lib/supabase'
import type { Material } from '../../lib/database.types'
import {
  useParseReceipt,
  uploadReceiptImage,
  type ParsedReceiptItem,
} from './useReceiptScan'

interface ReceiptScanModalProps {
  isOpen: boolean
  onClose: () => void
  materials: Material[]
  onApplied: () => void
}

interface EditableItem {
  material_id: string | null
  material_name: string
  grams_received: number
  raw_text: string
  apply: boolean
}

type Phase = 'idle' | 'uploading' | 'analyzing' | 'done'

export function ReceiptScanModal({ isOpen, onClose, materials, onApplied }: ReceiptScanModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [items, setItems] = useState<EditableItem[]>([])
  const [applying, setApplying] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')

  const parseReceipt = useParseReceipt()

  const handleFileSelect = async (file: File) => {
    setItems([])
    setImageUrl(null)
    setPhase('uploading')
    try {
      const url = await uploadReceiptImage(file)
      setImageUrl(url)

      setPhase('analyzing')
      const result = await parseReceipt.mutateAsync({
        file,
        materials: materials.map((m) => ({ id: m.id, name: m.name })),
      })

      setPhase('done')
      if (result.items.length === 0) {
        toast('לא זוהו חומרים בקבלה', { icon: '⚠️' })
        return
      }

      setItems(
        result.items.map((it: ParsedReceiptItem) => ({
          material_id: it.matched_material_id,
          material_name: it.material_name,
          grams_received: it.grams_received ?? 0,
          raw_text: it.raw_text,
          apply: it.matched_material_id !== null && (it.grams_received ?? 0) > 0,
        }))
      )
      toast.success(`זוהו ${result.items.length} פריטים`)
    } catch (err) {
      setPhase('idle')
      const message = err instanceof Error ? err.message : 'שגיאה בעיבוד הקבלה'
      toast.error(message)
    }
  }

  const handleApply = async () => {
    const toApply = items.filter((it) => it.apply && it.material_id && it.grams_received > 0)
    if (toApply.length === 0) {
      toast.error('בחרי לפחות פריט אחד עם חומר וכמות')
      return
    }

    setApplying(true)
    try {
      for (const item of toApply) {
        const material = materials.find((m) => m.id === item.material_id)
        if (!material) continue
        const newQty = material.quantity_grams + item.grams_received
        const { error } = await supabase
          .from('materials')
          .update({ quantity_grams: newQty })
          .eq('id', material.id)
        if (error) throw error
      }

      if (imageUrl) {
        await supabase.from('receipts').insert({
          image_url: imageUrl,
          parsed_items: toApply.map((it) => ({
            material_id: it.material_id,
            material_name: it.material_name,
            grams_received: it.grams_received,
          })),
        })
      }

      toast.success(`עודכנו ${toApply.length} חומרים`)
      onApplied()
      handleClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'שגיאה בעדכון המלאי'
      toast.error(message)
    } finally {
      setApplying(false)
    }
  }

  const handleClose = () => {
    setImageUrl(null)
    setItems([])
    setPhase('idle')
    onClose()
  }

  const updateItem = (index: number, patch: Partial<EditableItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const isLoading = phase === 'uploading' || phase === 'analyzing'
  const progressPct = phase === 'uploading' ? 25 : phase === 'analyzing' ? 65 : 100
  const phaseLabel =
    phase === 'uploading' ? 'מעלה תמונה...' : phase === 'analyzing' ? 'מנתח את הקבלה...' : ''

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="סריקת קבלה">
      <div className="space-y-4">
        {!isLoading && items.length === 0 && (
          <>
            <p className="text-sm text-sand-600">
              צלמי או בחרי תמונה של הקבלה. המערכת תזהה אוטומטית את החומרים והכמויות, ואת תוכלי לאשר לפני העדכון.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ''
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-terracotta-600 text-white rounded-lg font-medium min-h-[44px]"
            >
              📷 בחרי תמונה / צלמי
            </button>
          </>
        )}

        {isLoading && (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm text-sand-700 font-medium">{phaseLabel}</p>
            <div className="w-full h-3 bg-sand-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-terracotta-600 transition-all duration-500 ease-out ${
                  phase === 'analyzing' ? 'animate-pulse' : ''
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-sand-500">
              {phase === 'uploading' ? 'מעלה את התמונה לאחסון...' : 'Claude קורא את הקבלה (~5 שניות)...'}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <>
            {imageUrl && (
              <img src={imageUrl} alt="קבלה" className="w-full max-h-48 object-contain rounded-lg border border-sand-200" />
            )}

            <div className="space-y-2">
              <p className="text-sm text-sand-700 font-medium">סקרי ואשרי:</p>
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    item.apply ? 'bg-success/5 border-success/30' : 'bg-sand-50 border-sand-200'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={item.apply}
                      onChange={(e) => updateItem(i, { apply: e.target.checked })}
                      className="mt-1"
                    />
                    <div className="flex-1 text-xs text-sand-500">{item.raw_text}</div>
                  </div>
                  <select
                    value={item.material_id ?? ''}
                    onChange={(e) => updateItem(i, { material_id: e.target.value || null })}
                    className="w-full px-2 py-2 border border-sand-300 rounded-lg bg-white text-sm mb-2"
                  >
                    <option value="">— לא נבחר חומר —</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-sand-600">גרם:</label>
                    <input
                      type="number"
                      value={item.grams_received || ''}
                      onChange={(e) => updateItem(i, { grams_received: Number(e.target.value) })}
                      className="flex-1 px-2 py-1 border border-sand-300 rounded bg-white text-sm"
                      min={0}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 py-3 bg-terracotta-600 text-white rounded-lg font-medium min-h-[44px] disabled:opacity-50"
              >
                {applying ? 'מעדכן מלאי...' : '✓ אשרי ועדכני מלאי'}
              </button>
              <button
                onClick={handleClose}
                disabled={applying}
                className="px-4 py-3 border border-sand-300 rounded-lg min-h-[44px]"
              >
                ביטול
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
