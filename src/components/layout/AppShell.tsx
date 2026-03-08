import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { TabNavigation } from './TabNavigation'
import { SideMenu } from './SideMenu'

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isCatalog = location.pathname.startsWith('/catalog')

  return (
    <>
      <Header onMenuClick={() => setMenuOpen(true)} />
      {!isCatalog && <TabNavigation />}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </>
  )
}
