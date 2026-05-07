# Receipt Scan Setup

הסבר איך להפעיל את פיצ'ר סריקת הקבלות (📷 קבלה במחסן).

## דרישות

- חשבון Anthropic API עם credit (https://console.anthropic.com)
- גישה ל-Supabase Dashboard של הפרויקט

## שלב 1 — SQL (storage + table)

הריצי את [setup-receipts.sql](setup-receipts.sql) ב-Supabase SQL Editor.
זה יוצר bucket `receipts` בסטורג' וטבלת `receipts` להיסטוריה.

## שלב 2 — Anthropic API key

1. לכי ל-https://console.anthropic.com/settings/keys
2. צרי API key חדש (העתיקי אותו מיד — לא ניתן לראותו שוב)
3. ב-Supabase Dashboard → Project Settings → Edge Functions → Secrets
4. הוסיפי secret:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: ה-key שיצרת

## שלב 3 — Deploy של Edge Function

יש 2 אופציות:

### אופציה A — דרך Supabase CLI (מומלץ)

```bash
# התקנה חד-פעמית
npm install -g supabase

# מתוך תיקיית liat-studio:
supabase login
supabase link --project-ref imkcmsomzxfahkmvkozd
supabase functions deploy parse-receipt
```

### אופציה B — דרך הדשבורד

1. Supabase Dashboard → Edge Functions → New Function
2. שם: `parse-receipt`
3. הדביקי את התוכן של [supabase/functions/parse-receipt/index.ts](supabase/functions/parse-receipt/index.ts)
4. Deploy

## שלב 4 — בדיקה

1. רענני את https://liat-st.com (Ctrl+F5)
2. במסך מחסן, לחצי על **📷 קבלה**
3. צלמי או העלי תמונה של קבלה
4. בדקי שהמערכת מזהה את החומרים
5. סקרי, ערכי במידת הצורך, ולחצי **אשרי ועדכני מלאי**

## עלויות

- כל סריקה עולה **~$0.005-0.02** (Claude Sonnet vision)
- אין מנוי — תשלום לפי שימוש בלבד
- היסטוריית הסריקות נשמרת ב-Supabase Storage (1GB חינם)

## פתרון בעיות

| שגיאה | פתרון |
|---|---|
| "ANTHROPIC_API_KEY not configured" | ה-secret לא הוגדר נכון בשלב 2 |
| "Function not found" | ה-edge function לא נפרסה — חזרי לשלב 3 |
| לא זוהו חומרים | התמונה מטושטשת/חתוכה. נסי לצלם מחדש בתאורה טובה |
| חומר לא מזוהה | השם לא תואם — בחרי ידנית מהרשימה במסך האישור |
