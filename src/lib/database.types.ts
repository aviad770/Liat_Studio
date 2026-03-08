export interface Database {
  public: {
    Tables: {
      materials: {
        Row: Material
        Insert: Omit<Material, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Material, 'id' | 'created_at'>>
      }
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at'>
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>
      }
      recipe_ingredients: {
        Row: RecipeIngredient
        Insert: Omit<RecipeIngredient, 'id'>
        Update: Partial<Omit<RecipeIngredient, 'id'>>
      }
      test_iterations: {
        Row: TestIteration
        Insert: Omit<TestIteration, 'id'>
        Update: Partial<Omit<TestIteration, 'id'>>
      }
      batches: {
        Row: Batch
        Insert: Omit<Batch, 'id' | 'created_at'>
        Update: Partial<Omit<Batch, 'id' | 'created_at'>>
      }
      colorants: {
        Row: Colorant
        Insert: Omit<Colorant, 'id' | 'created_at'>
        Update: Partial<Omit<Colorant, 'id' | 'created_at'>>
      }
      additional_materials: {
        Row: AdditionalMaterial
        Insert: Omit<AdditionalMaterial, 'id' | 'created_at'>
        Update: Partial<Omit<AdditionalMaterial, 'id' | 'created_at'>>
      }
      catalog: {
        Row: CatalogItem
        Insert: Omit<CatalogItem, 'id' | 'created_at'>
        Update: Partial<Omit<CatalogItem, 'id' | 'created_at'>>
      }
    }
  }
}

export interface CatalogItem {
  id: string
  image_url: string
  description: string
  clay_type: string
  glaze_color: string
  size: string
  cost_price: number
  in_stock: boolean
  production_date: string
  sale_price: number
  sale_date: string | null
  created_at: string
}

export interface Material {
  id: string
  name: string
  supplier: string
  quantity_grams: number
  price: number
  min_threshold: number
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  is_test: boolean
  promoted_from_test_id: string | null
  created_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  material_id: string
  weight_ratio: number
}

export interface TestIteration {
  id: string
  recipe_id: string
  iteration_number: number
  date: string
  result_text: string
}

export interface Batch {
  id: string
  recipe_id: string
  quantity_kg: number
  created_at: string
}

export interface Colorant {
  id: string
  color: string
  catalog_number: string
  supplier: string
  quantity: number
  price: number
  created_at: string
}

export interface AdditionalMaterial {
  id: string
  name: string
  in_stock: boolean
  quantity: number
  created_at: string
}
