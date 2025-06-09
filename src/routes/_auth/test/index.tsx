import { createFileRoute } from '@tanstack/react-router'
import Login from '../../../pages/test'

export const Route = createFileRoute('/_auth/test/')({
  component: Login,
})
