import Layout from '@/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    // logic to authen route
    // const { isAuthenticated } = authStore.getState()
    // if (!isAuthenticated) {
    //   throw redirect({ to: '/login' })
    // }
  },
})
