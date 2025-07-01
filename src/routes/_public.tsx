import { authStore } from '@/stores/authStore'
import { getNavigateByRole } from '@/utils/helpers/getNavigateByRole'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getRedirectPath } from '@/utils/helpers/redirectAfterLogin'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues } = authStore.getState()
    if (authValues.isAuthenticated) {
      const path = getNavigateByRole(authValues.role)
      if (path) {
        throw redirect({ to: path, replace: true })
      }
    }
  },
})
