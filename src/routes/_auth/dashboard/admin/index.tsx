import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/pages'

export const Route = createFileRoute('/_auth/dashboard/admin/')({
  component: AdminDashboard,
})
