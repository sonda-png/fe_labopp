import { ForbiddenPage, NotFoundPage } from '@/pages'
import AppProviders from '@/providers/AppProviders'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet, ErrorComponent } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
const enableTanstackRouterDevtools = import.meta.env.DEV

export const Route = createRootRoute({
  component: () => (
    <AppProviders>
      <Outlet />
      {enableTanstackRouterDevtools && <TanStackRouterDevtools />}
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  ),
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error }) => {
    console.log(error)
    // Handle error
    if (
      error?.message?.includes('403') ||
      error?.message?.includes('Forbidden')
    ) {
      return <ForbiddenPage />
    }
    if (
      error?.message?.includes('404') ||
      error?.message?.includes('Not Found')
    ) {
      return <NotFoundPage />
    }
    // Fallback cho các lỗi khác
    return <ErrorComponent error={error} />
  },
})
