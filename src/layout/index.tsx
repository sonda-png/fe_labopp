import { Outlet } from '@tanstack/react-router'
import { HeaderComponent } from './header'
import { SidebarComponent } from './sidebar'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackRender from './error-boundary'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen min-w-full  bg-gray-50">
        <HeaderComponent />
        <div className="flex w-full pt-16 lg:pt-0">
          <SidebarComponent />
          <div className="flex-grow p-4 lg:p-6">
            <ErrorBoundary fallbackRender={FallbackRender}>
              <Suspense
                fallback={
                  <div className="w-full h-full flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mr-2" />
                    <span>Loading...</span>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
