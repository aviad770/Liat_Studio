# Liat Studio — הסטודיו של ליאת

Ceramic studio management web app for Liat, a ceramic artist. Single-user app with Hebrew RTL UI.

## Quick Reference

- **Live site**: https://aviad770.github.io/Liat_Studio/
- **Repo**: https://github.com/aviad770/Liat_Studio
- **Supabase project**: `imkcmsomzxfahkmvkozd` (Free tier, Southeast Asia region)
- **Supabase URL**: https://imkcmsomzxfahkmvkozd.supabase.co

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 (strict mode) |
| Build | Vite | 7.3 |
| Styling | Tailwind CSS v4 | 4.2 (`@tailwindcss/vite` plugin) |
| Backend | Supabase (PostgreSQL) | JS SDK 2.98 |
| Data Fetching | TanStack React Query | 5.90 |
| Routing | React Router | 7.13 |
| Validation | Zod | 4.3 |
| Notifications | react-hot-toast | 2.6 |
| Hosting | GitHub Pages | via Actions |
| CI/CD | GitHub Actions | Node 20 |

## Project Structure

```
liat-studio/
├── .github/workflows/deploy.yml   # CI/CD: build & deploy to GitHub Pages
├── .env                            # Local env (NOT committed)
├── .env.example                    # Template for env vars
├── supabase-schema.sql             # Full DB schema — run in Supabase SQL Editor
├── index.html                      # Entry point (lang="he" dir="rtl")
├── vite.config.ts                  # Vite + React + Tailwind, base: '/Liat_Studio/'
├── src/
│   ├── main.tsx                    # React root mount
│   ├── App.tsx                     # QueryClient + BrowserRouter + Routes + Toaster
│   ├── index.css                   # Tailwind v4 @theme: sand/terracotta/clay palettes
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client (untyped — no Database generic)
│   │   ├── database.types.ts       # All 7 table interfaces + Database type
│   │   ├── schemas.ts              # Zod validation schemas (Hebrew error messages)
│   │   └── utils.ts                # formatDate, formatWeight, gramsToKg, kgToGrams
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Terracotta header: ב״ה top-right, title centered
│   │   │   ├── TabNavigation.tsx   # 7 horizontal scroll tabs with NavLink
│   │   │   └── AppShell.tsx        # Header + TabNav + Outlet
│   │   └── ui/
│   │       ├── Modal.tsx           # Bottom-sheet dialog (native <dialog>)
│   │       └── StockBar.tsx        # Visual stock level indicator
│   └── features/
│       ├── pantry/                 # Materials inventory (CRUD + quick update)
│       │   ├── PantryPage.tsx
│       │   ├── MaterialCard.tsx
│       │   ├── MaterialForm.tsx
│       │   └── useMaterials.ts     # useQuery/useMutation hooks
│       ├── recipes/                # Glaze recipes + test iterations
│       │   ├── RecipesPage.tsx     # Tabs: regular/test, RecipeDetail inline
│       │   └── useRecipes.ts       # 8 hooks: CRUD, ingredients, iterations, promote
│       ├── batch/                  # Batch preparation with stock projection
│       │   ├── BatchPage.tsx       # Visual bars, deficit warnings, confirm
│       │   └── useBatch.ts         # calculateBatch (pure fn) + useConfirmBatch (RPC)
│       ├── shopping/               # Auto-generated shopping list
│       │   ├── ShoppingPage.tsx    # Grouped by supplier, copy to clipboard
│       │   └── useShopping.ts     # Derives from materials below threshold
│       ├── matrix/                 # Materials × Recipes cross-reference table
│       │   └── MatrixPage.tsx      # Fetches all recipe_ingredients, builds grid
│       ├── colorants/              # Pigment inventory (CRUD)
│       │   ├── ColorantsPage.tsx
│       │   └── useColorants.ts
│       └── extras/                 # Additional materials (toggle in-stock)
│           ├── ExtrasPage.tsx
│           └── useExtras.ts
```

## Database Schema (7 tables)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `materials` | Powder/ingredient inventory | name, supplier, quantity_grams, price, min_threshold |
| `recipes` | Glaze formulas | name, description, is_test, promoted_from_test_id |
| `recipe_ingredients` | Recipe ↔ Material join | recipe_id, material_id, weight_ratio |
| `test_iterations` | Lab test results | recipe_id, iteration_number, date, result_text |
| `batches` | Production/preparation log | recipe_id, quantity_kg |
| `colorants` | Pigment inventory | color, catalog_number, supplier, quantity, price |
| `additional_materials` | Misc studio items | name, in_stock, quantity |

### Database Functions
- `update_updated_at()` — trigger on materials to auto-update `updated_at`
- `deduct_batch(p_recipe_id, p_quantity_kg)` — RPC for atomic inventory deduction during batch confirmation

### RLS
- All tables have RLS enabled with permissive "allow all" policies (single-user app, no auth)

### Seed Data
- 7 default additional materials: חימר נוזלי, גלזורה שקופה ירוקה, גבס, CMC, מנגן, מי זכוכית, ליינר שחור

## Routes

| Path | Page | Tab Label |
|------|------|-----------|
| `/` | PantryPage | מחסן |
| `/recipes` | RecipesPage | מתכונים |
| `/batch` | BatchPage | הכנת גלזורה |
| `/shopping` | ShoppingPage | הזמנות |
| `/matrix` | MatrixPage | מטריצה |
| `/colorants` | ColorantsPage | צובענים |
| `/extras` | ExtrasPage | חומרים נוספים |

## Key Patterns

### Data Flow
- **Supabase client** (`lib/supabase.ts`) — untyped `createClient()` (no Database generic, avoids type conflicts)
- **Hooks** — each feature has a `use*.ts` file with `useQuery`/`useMutation` hooks
- **Query keys**: `['materials']`, `['recipes', isTest]`, `['recipe', recipeId]`, `['colorants']`, `['additional_materials']`, `['test_iterations', recipeId]`, `['batches']`, `['all_recipe_ingredients', recipeIds]`
- **Mutations** invalidate relevant query keys and show toast notifications
- **QueryClient config**: `staleTime: 0`, `refetchOnWindowFocus: true`

### Core Value Chain
Materials → Recipes (weight ratios) → Batch Preparation (deducts inventory) → Shopping List (auto from low stock)

### Batch Calculation (`useBatch.ts`)
1. `calculateBatch()` — pure function: takes ingredients + quantity_kg, returns required grams, remaining, deficit per material
2. `useConfirmBatch()` — calls `deduct_batch` RPC (atomic), then logs to `batches` table

### Shopping List Logic (`useShopping.ts`)
- Filters materials where `quantity_grams <= min_threshold`
- Calculates order amount: `min_threshold - quantity_grams + min_threshold` (order to reach 2x threshold)
- Groups by supplier, supports copy-to-clipboard as formatted text

### UI Conventions
- **RTL Hebrew** — `dir="rtl"` on `<html>`, all text in Hebrew
- **Mobile-first** — max-width 700px centered, touch targets ≥ 44px
- **Bottom-sheet modals** — native `<dialog>`, max-height 85vh, rounded-t-2xl
- **Color theme** — sand (neutral), terracotta (primary/CTA), clay (secondary), success/warning/danger
- **Loading states** — skeleton placeholders with `animate-pulse`
- **Empty states** — centered text with description
- **Confirmations** — `window.confirm()` for destructive actions

### Naming Conventions
- **DB columns**: snake_case (`quantity_grams`, `weight_ratio`)
- **Components**: PascalCase (`MaterialCard`, `BatchPage`)
- **Hooks**: camelCase with `use` prefix (`useMaterials`, `useConfirmBatch`)
- **Feature folders**: lowercase (`pantry/`, `batch/`)
- **Quantities**: stored in grams (integers) in DB, displayed as kg/g in UI

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |

These are set as GitHub Actions secrets for CI/CD builds.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173/Liat_Studio/)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Deployment

- Push to `main` → GitHub Actions builds and deploys to GitHub Pages
- Manual deploy: `gh workflow run deploy.yml`
- Base path: `/Liat_Studio/` (configured in `vite.config.ts` and `BrowserRouter`)

## Important Notes

- **No auth** — single user app with anon Supabase key + permissive RLS
- **Supabase Free tier** — 500MB DB, 1GB bandwidth, may pause after 1 week inactivity
- **Supabase client is untyped** — Database generic was removed to avoid type conflicts with supabase-js SDK. Types are cast manually in hooks.
- **All UI text is Hebrew** — error messages, labels, placeholders, toasts
- **Header displays ב״ה** (with God's help) in top-right corner — required by the user
- **Title**: "הסטודיו של ליאת" (Liat's Studio)
