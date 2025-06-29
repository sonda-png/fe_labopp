import { createFileRoute } from '@tanstack/react-router'
import { StudentDashboard } from '@/pages'

export const Route = createFileRoute('/_auth/dashboard/student/')({
  component: StudentDashboard,
})
