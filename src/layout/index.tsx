import { Outlet } from '@tanstack/react-router'
import { HeaderComponent } from './header'
import { SidebarComponent } from './sidebar'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackRender from './error-boundary'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="flex w-full pt-16 lg:pt-0">
        <SidebarComponent />
        <div className="flex-grow p-4 lg:p-6">
          <ErrorBoundary fallbackRender={FallbackRender}>
            <Suspense
              fallback={
                <div className="w-full h-full flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mr-2" />
                  <span>Đang tải...</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
