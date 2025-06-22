import { ManageAccountPage } from '@/pages/manage-account'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/manage-account/')({
  component: ManageAccountPage,
})
