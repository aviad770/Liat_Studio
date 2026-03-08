import { useState, useRef } from 'react'
import { useUploadCatalogImage } from './useCatalog'
import type { CatalogItem } from '../../lib/database.types'

interface CatalogFormProps {
  initial?: CatalogItem
  onSubmit: (data: Omit<CatalogItem, 'id' | 'created_at'>) => void
  onCancel: () => void
  isLoading: boolean
}

export function CatalogForm({ initial, onSubmit, onCancel, isLoading }: CatalogFormProps) {
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [clayType, setClayType] = useState(initial?.clay_type ?? '')
  const [glazeColor, setGlazeColor] = useState(initial?.glaze_color ?? '')
  const [size, setSize] = useState(initial?.size ?? '')
  const [costPrice, setCostPrice] = useState(initial?.cost_price ?? 0)
  const [salePrice, setSalePrice] = useState(initial?.sale_price ?? 0)
  const [inStock, setInStock] = useState(initial?.in_stock ?? true)
  const [productionDate, setProductionDate] = useState(
    initial?.production_date ?? new Date().toISOString().split('T')[0]
  )
  const [saleDate, setSaleDate] = useState(initial?.sale_date ?? '')
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadImage = useUploadCatalogImage()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    let finalImageUrl = initial?.image_url ?? ''
    if (imageFile) {
      setUploading(true)
      try {
        finalImageUrl = await uploadImage.mutateAsync(imageFile)
      } finally {
        setUploading(false)
      }
    }
    onSubmit({
      image_url: finalImageUrl,
      description,
      clay_type: clayType,
      glaze_color: glazeColor,
      size,
      cost_price: costPrice,
      sale_price: salePrice,
      in_stock: inStock,
      production_date: productionDate,
      sale_date: saleDate || null,
    })
  }

  const isBusy = isLoading || uploading

  return (
    <div className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">תמונה</label>
        <label htmlFor="catalog-image-input" className="cursor-pointer block">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="תצוגה מקדימה"
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
          ) : (
            <div className="w-full h-48 bg-sand-100 rounded-lg flex items-center justify-center text-sand-400 text-5xl mb-2">
              🏺
            </div>
          )}
          <div className="w-full py-2 border border-sand-300 rounded-lg text-sand-700 text-sm min-h-[44px] flex items-center justify-center">
            {imagePreview ? 'החלף תמונה' : 'בחר תמונה'}
          </div>
        </label>
        <input
          id="catalog-image-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">תיאור מוצר *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="למשל: קערת סלט גדולה"
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
        />
      </div>

      {/* Clay type + Glaze color */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">סוג חימר</label>
          <input
            type="text"
            value={clayType}
            onChange={(e) => setClayType(e.target.value)}
            placeholder="למשל: חימר לבן"
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">צבע גלזורה</label>
          <input
            type="text"
            value={glazeColor}
            onChange={(e) => setGlazeColor(e.target.value)}
            placeholder="למשל: טורקיז"
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">גודל</label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="למשל: 20x15 ס״מ"
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
        />
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">עלות ייצור (₪)</label>
          <input
            type="number"
            value={costPrice || ''}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1">מחיר מכירה (₪)</label>
          <input
            type="number"
            value={salePrice || ''}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
          />
        </div>
      </div>

      {/* Production date */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">תאריך ייצור</label>
        <input
          type="date"
          value={productionDate}
          onChange={(e) => setProductionDate(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
        />
      </div>

      {/* In stock checkbox */}
      <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="w-5 h-5 rounded border-sand-300 text-terracotta-600 focus:ring-terracotta-400"
        />
        <span className="text-sm font-medium text-sand-700">במלאי</span>
      </label>

      {/* Sale date (optional) */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1">תאריך מכירה</label>
        <input
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          className="w-full px-3 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white"
        />
        {saleDate && (
          <button
            type="button"
            onClick={() => setSaleDate('')}
            className="text-xs text-sand-500 mt-1 underline"
          >
            נקה תאריך מכירה
          </button>
        )}
      </div>

      {/* Submit / Cancel */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!description || isBusy}
          className="flex-1 py-3 bg-terracotta-600 text-white rounded-lg font-medium disabled:opacity-50 min-h-[44px]"
        >
          {isBusy ? 'שומר...' : initial ? 'עדכן' : 'הוסף'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-sand-300 text-sand-700 rounded-lg min-h-[44px]"
        >
          ביטול
        </button>
      </div>
    </div>
  )
}
