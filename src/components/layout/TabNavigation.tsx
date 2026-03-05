import { NavLink } from 'react-router'

const tabs = [
  { path: '/', label: 'מחסן' },
  { path: '/recipes', label: 'מתכונים' },
  { path: '/batch', label: 'הכנת גלזורה' },
  { path: '/shopping', label: 'הזמנות' },
  { path: '/matrix', label: 'מטריצה' },
  { path: '/colorants', label: 'צובענים' },
  { path: '/extras', label: 'חומרים נוספים' },
]

export function TabNavigation() {
  return (
    <nav className="bg-sand-100 border-b border-sand-200 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                isActive
                  ? 'text-terracotta-700 border-b-2 border-terracotta-500 bg-white'
                  : 'text-sand-600 hover:text-sand-800 hover:bg-sand-50'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
