import Layout from '@/layout'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
const enableTanstackRouterDevtools = import.meta.env.DEV

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {enableTanstackRouterDevtools && <TanStackRouterDevtools />}
    </>
  ),
})
