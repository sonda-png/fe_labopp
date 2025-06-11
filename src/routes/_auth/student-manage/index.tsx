import { createFileRoute } from '@tanstack/react-router'
import StudentManagement from '../../../pages/student-manage'
export const Route = createFileRoute('/_auth/student-manage/')({
  component: StudentManagement,
})
