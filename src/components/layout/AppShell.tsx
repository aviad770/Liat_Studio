import { Outlet } from 'react-router'
import { Header } from './Header'
import { TabNavigation } from './TabNavigation'

export function AppShell() {
  return (
    <>
      <Header />
      <TabNavigation />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </>
  )
}
