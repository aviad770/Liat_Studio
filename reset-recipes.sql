-- Reset all recipes to match the 16 cards from מתכונים לגלזורות.pdf
-- Run in Supabase SQL Editor.
-- Cascades: recipe_ingredients, test_iterations, and batches are all ON DELETE CASCADE.

BEGIN;

-- 0. Ensure all materials referenced by the PDF recipes exist.
--    Current DB was missing 'צבען אדום' (used in 'אדמונית שלי').
INSERT INTO materials (name, supplier, quantity_grams, price, min_threshold)
SELECT 'צבען אדום', '', 0, 0, 100
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE name = 'צבען אדום');

-- 1. Clear all existing recipes (cascades to ingredients, iterations, batches)
DELETE FROM recipes;

-- 2. Insert the 16 recipes from the PDF
INSERT INTO recipes (name, description, is_test) VALUES
  ('ירק משתנה', '', false),
  ('גלזורה לבנה מבריקה', '', false),
  ('גלזורה טורקיז אפקטים', 'אפשרות חלופית: נחושת אוקסיד 2 במקום נחושת קרבונט 4', false),
  ('סגול אפור/ענת', '', false),
  ('גלזורה טורקיז שקוף', 'תוספות: כפית קלגון, 3 כפות מלח אנגלי', false),
  ('אדמונית שלי', '', false),
  ('שמפניה סנה', '', false),
  ('גלזורה מנטה', 'גיר/וולסטונית 3.5 - משתמשים בגיר', false),
  ('גלזורה אמרלד', '', false),
  ('ירוק דשא', '', false),
  ('ורוד עתיק/ענת', '', false),
  ('גלזורה שחור מט/שולה', '', false),
  ('גלזורה לאטה', '', false),
  ('ירוק בקבוק משחק', 'לבדוק מה יצא בניסוי', true),
  ('שקופה משי לטבילה 2026 AI', 'יצא בטסט קטן מצוין 2/2026', false),
  ('לבן מט משי/רמי', 'ללא בדיל. אם יוצא מבריק מדי להעלות קאולין ל-8 ולהוריד קוורץ ל-17. לנסות טסט, אולי להחליף את הגלזורה הלבנה עם בדיל', true);

-- 3. Insert ingredients for each recipe (numbers are grams per batch)

-- 1: ירק משתנה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'בולקליי'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'בדיל'), 5),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'נחושת סולפט'), 4),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 4);

-- 2: גלזורה לבנה מבריקה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 15),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 35),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'גיר'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'קאולין'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'צינק'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'בדיל'), 10);

-- 3: גלזורה טורקיז אפקטים
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'פריטה 3134'), 56),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'קאולין'), 24),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'קוורץ'), 26),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'נחושת קרבונט'), 4);

-- 4: סגול אפור/ענת
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'בולקליי'), 8),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'בדיל'), 5),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'מנגן אוקסיד'), 4),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'קובלט אוקסיד'), 0.5);

-- 5: גלזורה טורקיז שקוף
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'פריטה 3110'), 25),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 25),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 12.5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'בולקליי'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'בדיל'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'נחושת אוקסיד'), 3),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז שקוף'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 20);

-- 6: אדמונית שלי
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'גרסטלי בורט'), 50),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'דולומיט'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'קאולין'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'רויטל'), 5),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'צבען אדום'), 10);

-- 7: שמפניה סנה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 25),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 15),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'בולקליי'), 10),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'פריטה 2120'), 25),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'בריום'), 8),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'וולסטוניט'), 20),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'צינק'), 5),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 12),
  ((SELECT id FROM recipes WHERE name = 'שמפניה סנה'), (SELECT id FROM materials WHERE name = 'ברזל אוקסיד'), 1);

-- 8: גלזורה מנטה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'נפלין'), 34),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'קאולין'), 20.3),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'דולומיט'), 17.6),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 15.9),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'גרסטלי בורט'), 8.8),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'גיר'), 3.5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'רויטל'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה מנטה'), (SELECT id FROM materials WHERE name = 'קובלט קרבונט'), 0.25);

-- 9: גלזורה אמרלד
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'גרסטלי בורט'), 49),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קאולין'), 19),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קוורץ'), 32),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'כרום אוקסיד'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קובלט קרבונט'), 1);

-- 10: ירוק דשא
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'נפלין'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'גיר'), 15),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'קאולין'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'צינק'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'ניקל אוקסיד'), 4);

-- 11: ורוד עתיק/ענת
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'קוורץ'), 23),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'קאולין'), 6),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 37),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'גיר'), 20),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'צינק'), 3),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'דולומיט'), 2),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'בדיל'), 9),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'כרום אוקסיד'), 0.5),
  ((SELECT id FROM recipes WHERE name = 'ורוד עתיק/ענת'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2);

-- 12: גלזורה שחור מט/שולה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 42),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 30),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'גיר'), 12),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'צינק'), 3),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'טלק מגנזיום'), 3),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'קאולין'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'בולקליי'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'ברזל אוקסיד'), 6),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'מנגן אוקסיד'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה שחור מט/שולה'), (SELECT id FROM materials WHERE name = 'קובלט אוקסיד'), 2);

-- 13: גלזורה לאטה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 23),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'קאולין'), 6),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 37),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'גיר'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'צינק'), 3),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'דולומיט'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'אולטרקס/צירקון'), 18),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'כרום אוקסיד'), 0.5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לאטה'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2);

-- 14: ירוק בקבוק משחק (TEST)
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'בולקליי'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'נחושת אוקסיד'), 4),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 4);

-- 15: שקופה משי לטבילה 2026 AI
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 38),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'קוורץ'), 25),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'גיר'), 12),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'קאולין'), 5);

-- 16: לבן מט משי/רמי (TEST)
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 50),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'דולומיט'), 20),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'קאולין'), 5),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'צינק'), 5),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'אולטרקס/צירקון'), 20);

-- 4. Sanity check: verify each recipe has ingredients and no NULL material_ids
DO $$
DECLARE
  missing_count int;
  recipe_count int;
BEGIN
  SELECT count(*) INTO missing_count FROM recipe_ingredients WHERE material_id IS NULL;
  IF missing_count > 0 THEN
    RAISE EXCEPTION 'Found % recipe_ingredients with NULL material_id — a material name lookup failed. Rolling back.', missing_count;
  END IF;

  SELECT count(*) INTO recipe_count FROM recipes;
  IF recipe_count <> 16 THEN
    RAISE EXCEPTION 'Expected 16 recipes after insert, got %. Rolling back.', recipe_count;
  END IF;
END $$;

COMMIT;

-- After commit, verify manually:
-- SELECT r.name, count(ri.id) AS ingredient_count
-- FROM recipes r LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
-- GROUP BY r.name ORDER BY r.created_at;
