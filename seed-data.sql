-- Seed Data: Materials inventory + Glaze recipes
-- Run this in Supabase SQL Editor AFTER running supabase-schema.sql

-- =============================================
-- 1. MATERIALS (powder inventory from Avkot Mlai)
-- =============================================
INSERT INTO materials (name, supplier, quantity_grams, price, min_threshold) VALUES
  ('פלדספר נתרני', '', 0, 0, 1000),
  ('פלדספר אשלגני', '', 4000, 0, 1000),
  ('גיר', '', 3000, 0, 1000),
  ('קוורץ', '', 4000, 0, 1000),
  ('קאולין', '', 4000, 0, 1000),
  ('דולומיט', '', 3000, 0, 1000),
  ('בולקליי', '', 1000, 0, 1000),
  ('בנטוניט', '', 7000, 0, 1000),
  ('פריטה בורקס 6004', '', 3000, 0, 1000),
  ('טלק מגנזיום', '', 10000, 0, 1000),
  ('פריטה 3110', '', 5000, 0, 1000),
  ('פריטה 3134', '', 6000, 0, 1000),
  ('נפלין', '', 7000, 0, 1000),
  ('מגנזיום קרבונט', '', 1000, 0, 500),
  ('ליתיום', '', 300, 0, 200),
  ('צינק', '', 500, 0, 500),
  ('גרסטלי בורט', '', 4000, 0, 1000),
  ('אולטרקס/צירקון', '', 2000, 0, 1000),
  ('אלומיניום הידראט', '', 1000, 0, 500),
  ('פריטה 2120', '', 1000, 0, 500),
  ('בדיל', '', 500, 0, 500),
  ('נחושת אוקסיד', '', 600, 0, 300),
  ('נחושת קרבונט', '', 750, 0, 300),
  ('נחושת סולפט', '', 650, 0, 300),
  ('רויטל', '', 4000, 0, 1000),
  ('מנגן אוקסיד', '', 350, 0, 200),
  ('קובלט קרבונט', '', 500, 0, 200),
  ('קובלט אוקסיד', '', 100, 0, 100),
  ('ברזל אוקסיד', '', 150, 0, 150),
  ('כרום אוקסיד', '', 150, 0, 150),
  ('טיטן אוקסיד', '', 1000, 0, 500),
  ('בריום', '', 650, 0, 300),
  ('ראוטן', '', 250, 0, 200),
  ('וולסטוניט', '', 4000, 0, 1000),
  ('סודה אש', '', 2000, 0, 1000),
  ('בון אש', '', 1000, 0, 500),
  ('ניקל אוקסיד', '', 120, 0, 100),
  ('מגנזיום סולפט', '', 500, 0, 300),
  ('צבען אדום', '', 0, 0, 100);

-- =============================================
-- 2. COLORANTS (from Avkot Mlai - צבענים section)
-- =============================================
INSERT INTO colorants (color, catalog_number, supplier, quantity, price) VALUES
  ('ירוק בהיר', 'p28', 'אולמן', 120, 0),
  ('ירוק כהה', '2444', 'אולמן', 50, 0),
  ('כחול קובלט', '107', 'אולמן', 120, 0),
  ('צהוב', '2300', 'אולמן', 15, 0),
  ('אדום', '1806', 'אולמן', 40, 0),
  ('כתום בהיר', '301p', 'אולמן', 100, 0),
  ('כתום כהה', '18', 'אולמן', 40, 0),
  ('שחור', '2704', 'אולמן', 100, 0),
  ('חום אדום', '2225', 'אולמן', 120, 0),
  ('תכלת-טורקיז', '2597', 'אולמן', 160, 0),
  ('אוקר', '2323k', 'מינרקו', 80, 0),
  ('טורקיז', 'Gs370', 'מינרקו', 800, 0);

-- =============================================
-- 3. RECIPES (glaze formulas from Matkon Glaz)
-- =============================================
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

-- =============================================
-- 4. RECIPE INGREDIENTS (linking recipes to materials)
-- =============================================

-- Helper: use subqueries to find IDs by name
-- Recipe 1: ירק משתנה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'בולקליי'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'בדיל'), 5),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'נחושת סולפט'), 4),
  ((SELECT id FROM recipes WHERE name = 'ירק משתנה'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 4);

-- Recipe 2: גלזורה לבנה מבריקה
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 15),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 35),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'גיר'), 20),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'קאולין'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'צינק'), 5),
  ((SELECT id FROM recipes WHERE name = 'גלזורה לבנה מבריקה'), (SELECT id FROM materials WHERE name = 'בדיל'), 10);

-- Recipe 3: גלזורה טורקיז אפקטים
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'פריטה 3134'), 56),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'קאולין'), 24),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'קוורץ'), 26),
  ((SELECT id FROM recipes WHERE name = 'גלזורה טורקיז אפקטים'), (SELECT id FROM materials WHERE name = 'נחושת קרבונט'), 4);

-- Recipe 4: סגול אפור/ענת
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'בולקליי'), 8),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'בדיל'), 5),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'מנגן אוקסיד'), 4),
  ((SELECT id FROM recipes WHERE name = 'סגול אפור/ענת'), (SELECT id FROM materials WHERE name = 'קובלט אוקסיד'), 0.5);

-- Recipe 5: גלזורה טורקיז שקוף
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

-- Recipe 6: אדמונית שלי
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'גרסטלי בורט'), 50),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'דולומיט'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'קאולין'), 20),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'רויטל'), 5),
  ((SELECT id FROM recipes WHERE name = 'אדמונית שלי'), (SELECT id FROM materials WHERE name = 'צבען אדום'), 10);

-- Recipe 7: שמפניה סנה
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

-- Recipe 8: גלזורה מנטה
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

-- Recipe 9: גלזורה אמרלד
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'גרסטלי בורט'), 49),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קאולין'), 19),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קוורץ'), 32),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'בנטוניט'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'כרום אוקסיד'), 2),
  ((SELECT id FROM recipes WHERE name = 'גלזורה אמרלד'), (SELECT id FROM materials WHERE name = 'קובלט קרבונט'), 1);

-- Recipe 10: ירוק דשא
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'נפלין'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'גיר'), 15),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'קאולין'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'צינק'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק דשא'), (SELECT id FROM materials WHERE name = 'ניקל אוקסיד'), 4);

-- Recipe 11: ורוד עתיק/ענת
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

-- Recipe 12: גלזורה שחור מט/שולה
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

-- Recipe 13: גלזורה לאטה
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

-- Recipe 14: ירוק בקבוק משחק (TEST)
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'פריטה בורקס 6004'), 45),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'גיר'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'קוורץ'), 10),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'בולקליי'), 30),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'נחושת אוקסיד'), 4),
  ((SELECT id FROM recipes WHERE name = 'ירוק בקבוק משחק'), (SELECT id FROM materials WHERE name = 'טיטן אוקסיד'), 4);

-- Recipe 15: שקופה משי לטבילה 2026 AI
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'פלדספר נתרני'), 20),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 38),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'קוורץ'), 25),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'גיר'), 12),
  ((SELECT id FROM recipes WHERE name = 'שקופה משי לטבילה 2026 AI'), (SELECT id FROM materials WHERE name = 'קאולין'), 5);

-- Recipe 16: לבן מט משי/רמי (TEST)
INSERT INTO recipe_ingredients (recipe_id, material_id, weight_ratio) VALUES
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'פלדספר אשלגני'), 50),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'קוורץ'), 20),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'דולומיט'), 20),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'קאולין'), 5),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'צינק'), 5),
  ((SELECT id FROM recipes WHERE name = 'לבן מט משי/רמי'), (SELECT id FROM materials WHERE name = 'אולטרקס/צירקון'), 20);
