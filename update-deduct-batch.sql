-- Update deduct_batch RPC: weight_ratio is now stored as grams per single recipe batch.
-- The frontend now passes a batch multiplier (not a kg target), so we drop the *1000 factor.
-- The function signature stays the same to avoid breaking callers; p_quantity_kg is now
-- repurposed as the batch multiplier.
-- Run this in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION deduct_batch(
  p_recipe_id uuid,
  p_quantity_kg numeric
)
RETURNS void AS $$
DECLARE
  ingredient record;
  deduction_grams integer;
BEGIN
  FOR ingredient IN
    SELECT ri.material_id, ri.weight_ratio
    FROM recipe_ingredients ri
    WHERE ri.recipe_id = p_recipe_id
  LOOP
    deduction_grams := round(ingredient.weight_ratio * p_quantity_kg);
    UPDATE materials
    SET quantity_grams = greatest(quantity_grams - deduction_grams, 0)
    WHERE id = ingredient.material_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
