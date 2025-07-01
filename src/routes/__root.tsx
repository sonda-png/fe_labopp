import { NotFoundPage } from '@/pages'
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
    // Fallback other error
    return <ErrorComponent error={error} />
  },
})
