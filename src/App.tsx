import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppShell } from './components/layout/AppShell'
import { PantryPage } from './features/pantry/PantryPage'
import { RecipesPage } from './features/recipes/RecipesPage'
import { BatchPage } from './features/batch/BatchPage'
import { ShoppingPage } from './features/shopping/ShoppingPage'
import { MatrixPage } from './features/matrix/MatrixPage'
import { ColorantsPage } from './features/colorants/ColorantsPage'
import { ExtrasPage } from './features/extras/ExtrasPage'
import { CatalogPage } from './features/catalog/CatalogPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<PantryPage />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="batch" element={<BatchPage />} />
            <Route path="shopping" element={<ShoppingPage />} />
            <Route path="matrix" element={<MatrixPage />} />
            <Route path="colorants" element={<ColorantsPage />} />
            <Route path="extras" element={<ExtrasPage />} />
            <Route path="catalog" element={<CatalogPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            direction: 'rtl',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
