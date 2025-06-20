import { createFileRoute, redirect } from '@tanstack/react-router'
import Layout from '../layout'
import { sleep } from '@/utils/helpers/sleep'
import { authStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues } = authStore.getState()
    if (!authValues.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    await sleep(1000) // ⏳ Delay 2 giây trước khi hiển thị
    return null
  },
  component: Layout,
})
