import { createFileRoute } from '@tanstack/react-router'
import StudentDashboard from '@/pages/studentdashboard'

export const Route = createFileRoute('/_auth/studentdashboard/')({
  component: StudentDashboard,
})

