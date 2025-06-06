import { createFileRoute } from '@tanstack/react-router'
import Layout from '../layout'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    // const { isAuthenticated } = authStore.getState()
    // if (!isAuthenticated) {
    //   throw redirect({ to: '/login' })
    // }
  },
  component: Layout,
})
