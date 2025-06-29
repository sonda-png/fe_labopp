import { createFileRoute } from '@tanstack/react-router'
import { HeadSubjectDashboard } from '@/pages'

export const Route = createFileRoute('/_auth/dashboard/head-subject/')({
  component: HeadSubjectDashboard,
})
