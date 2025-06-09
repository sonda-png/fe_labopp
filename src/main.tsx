import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { queryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'
import AppProviders from './providers/AppProviders'

const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  </StrictMode>
)
