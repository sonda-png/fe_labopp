import { authStore } from '@/stores/authStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getRedirectPath } from '@/utils/helpers/redirectAfterLogin'

export const Route = createFileRoute('/_public')({
   beforeLoad: async () => {
  //   // logic to authen route
    const { authValues } = authStore.getState()
    if (authValues.isAuthenticated) {
      // Get redirect parameter from URL if available
      const urlParams = new URLSearchParams(window.location.search)
      const redirectParam = urlParams.get('redirect')
      const redirectTo = redirectParam || '/class-manage'
      
      throw redirect({ to: redirectTo })
    }
   },
})
