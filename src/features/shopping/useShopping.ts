import { useMaterials } from '../pantry/useMaterials'
import type { Material } from '../../lib/database.types'

export interface ShoppingItem {
  material: Material
  toOrder: number // grams needed to reach threshold
}

export interface SupplierGroup {
  supplier: string
  items: ShoppingItem[]
}

export function useShopping() {
  const { data: materials, isLoading } = useMaterials()

  const lowStockItems: ShoppingItem[] = (materials ?? [])
    .filter((m) => m.quantity_grams <= m.min_threshold)
    .map((m) => ({
      material: m,
      toOrder: m.min_threshold - m.quantity_grams + m.min_threshold, // order enough to reach 2x threshold
    }))

  const grouped: SupplierGroup[] = Object.entries(
    lowStockItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
      const supplier = item.material.supplier || 'ללא ספק'
      if (!acc[supplier]) acc[supplier] = []
      acc[supplier].push(item)
      return acc
    }, {})
  )
    .map(([supplier, items]) => ({ supplier, items }))
    .sort((a, b) => a.supplier.localeCompare(b.supplier, 'he'))

  return { lowStockItems, grouped, isLoading }
}

export function formatShoppingList(grouped: SupplierGroup[]): string {
  return grouped
    .map((g) => {
      const header = `📦 ${g.supplier}`
      const items = g.items
        .map((item) => {
          const kg = item.toOrder / 1000
          const amount = kg >= 1 ? `${kg.toFixed(1)} ק"ג` : `${item.toOrder} גרם`
          return `  • ${item.material.name} — ${amount}`
        })
        .join('\n')
      return `${header}\n${items}`
    })
    .join('\n\n')
}
