import { Outlet } from '@tanstack/react-router'
import { HeaderComponent } from './header'
import { SidebarComponent } from './sidebar'
import { Fragment } from 'react'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="flex w-full">
        <SidebarComponent />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
