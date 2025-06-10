import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { routeTree } from './routeTree.gen'
import AppProviders from './providers/AppProviders'

export const router = createRouter({ routeTree, scrollRestoration: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  </StrictMode>
)
