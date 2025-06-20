import { authStore } from '@/stores/authStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues } = authStore.getState()
    if (authValues.isAuthenticated) {
      throw redirect({ to: '/class-manage' })
    }
  },
})
