import { createFileRoute, redirect } from '@tanstack/react-router'
import Layout from '../layout'
import { sleep } from '@/utils/helpers/sleep'
import { authStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues } = authStore.getState()
    if (!authValues.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirectTo: location.pathname + location.search,
        },
      })
    }
  },
  loader: async () => {
    await sleep(1000) // ⏳ Delay 1s before show
    return null
  },
  component: Layout,
})
