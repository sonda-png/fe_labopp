import { createFileRoute } from '@tanstack/react-router'
import Layout from '../layout'
import { sleep } from '@/utils/helpers/sleep'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    // const { isAuthenticated } = authStore.getState()
    // if (!isAuthenticated) {
    //   throw redirect({ to: '/login' })
    // }
  },
  loader: async () => {
    await sleep(1000) // ⏳ Delay 2 giây trước khi hiển thị
    return null
  },
  component: Layout,
})
