import { createFileRoute, redirect } from '@tanstack/react-router'
import Layout from '../layout'
import { sleep } from '@/utils/helpers/sleep'
import { authStore } from '@/stores/authStore'
import { getLoginUrlWithRedirect } from '@/utils/helpers/redirectAfterLogin'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues, clearTokens } = authStore.getState()
    if (!authValues.isAuthenticated || !authValues.token) {
      clearTokens()
      const loginUrl = getLoginUrlWithRedirect()
      throw redirect({ to: loginUrl })
    }
  },
  loader: async () => {
    await sleep(1000) // ⏳ Delay 2 giây trước khi hiển thị
    return null
  },
  component: Layout,
})
