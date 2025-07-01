import { createFileRoute } from '@tanstack/react-router'
import { TeacherDashboard } from '@/pages'

export const Route = createFileRoute('/_auth/dashboard/teacher/')({
  component: TeacherDashboard,
})
