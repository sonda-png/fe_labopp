import Layout from '@/layout'
import AppProviders from '@/providers/AppProviders'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
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
})
