import { SemesterManagement } from '@/pages/semester-management'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_auth/semester-management/')({
  component: SemesterManagement,
})
