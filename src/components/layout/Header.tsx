interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-terracotta-600 text-white px-4 py-3 relative text-center">
      <span className="absolute top-1 right-3 text-xs font-medium">ב״ה</span>
      <button
        onClick={onMenuClick}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="תפריט"
      >
        <span className="text-xl leading-none">☰</span>
      </button>
      <h1 className="text-lg font-bold">הסטודיו של ליאת</h1>
    </header>
  )
}
