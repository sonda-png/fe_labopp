import { createFileRoute } from '@tanstack/react-router'
import SemesterManagement from '@/pages/semester-management'

export const Route = createFileRoute('/_auth/semester-management/')({
  component: SemesterManagement,
})
