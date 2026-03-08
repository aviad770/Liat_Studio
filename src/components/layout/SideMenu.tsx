import { useNavigate, useLocation } from 'react-router'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isCatalog = location.pathname === '/catalog'

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 overflow-y-auto transition-transform">
        <div className="p-4">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand-100 text-sand-500 text-xl mb-6"
            aria-label="סגור תפריט"
          >
            ✕
          </button>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-sand-400 uppercase tracking-wider mb-2">סטודיו</h3>
            <button
              onClick={() => handleNavigate('/')}
              className={`w-full text-right px-3 py-3 rounded-lg min-h-[44px] text-sm font-medium transition-colors ${
                !isCatalog
                  ? 'bg-terracotta-50 text-terracotta-700'
                  : 'text-sand-700 hover:bg-sand-50'
              }`}
            >
              ניהול סטודיו
            </button>
          </div>

          <div>
            <h3 className="text-xs font-bold text-sand-400 uppercase tracking-wider mb-2">מכירות</h3>
            <button
              onClick={() => handleNavigate('/catalog')}
              className={`w-full text-right px-3 py-3 rounded-lg min-h-[44px] text-sm font-medium transition-colors ${
                isCatalog
                  ? 'bg-terracotta-50 text-terracotta-700'
                  : 'text-sand-700 hover:bg-sand-50'
              }`}
            >
              קטלוג מכירות
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
