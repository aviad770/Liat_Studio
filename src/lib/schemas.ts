import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().min(1, 'שם חומר חובה'),
  supplier: z.string().default(''),
  quantity_grams: z.number().min(0, 'כמות חייבת להיות חיובית'),
  price: z.number().min(0, 'מחיר חייב להיות חיובי'),
  min_threshold: z.number().min(0, 'סף מינימום חייב להיות חיובי').default(1000),
})

export type MaterialInput = z.infer<typeof materialSchema>

export const recipeSchema = z.object({
  name: z.string().min(1, 'שם מתכון חובה'),
  description: z.string().default(''),
  is_test: z.boolean().default(false),
})

export type RecipeInput = z.infer<typeof recipeSchema>

export const recipeIngredientSchema = z.object({
  recipe_id: z.string().uuid(),
  material_id: z.string().uuid(),
  weight_ratio: z.number().min(0, 'יחס משקל חייב להיות חיובי'),
})

export type RecipeIngredientInput = z.infer<typeof recipeIngredientSchema>

export const testIterationSchema = z.object({
  recipe_id: z.string().uuid(),
  iteration_number: z.number().int().positive(),
  date: z.string(),
  result_text: z.string().default(''),
})

export type TestIterationInput = z.infer<typeof testIterationSchema>

export const colorantSchema = z.object({
  color: z.string().min(1, 'צבע חובה'),
  catalog_number: z.string().default(''),
  supplier: z.string().default(''),
  quantity: z.number().min(0).default(0),
  price: z.number().min(0).default(0),
})

export type ColorantInput = z.infer<typeof colorantSchema>

export const additionalMaterialSchema = z.object({
  name: z.string().min(1, 'שם חומר חובה'),
  in_stock: z.boolean().default(false),
  quantity: z.number().min(0).default(0),
})

export type AdditionalMaterialInput = z.infer<typeof additionalMaterialSchema>
