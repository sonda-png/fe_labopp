import { TeacherAssignmentPage } from '@/pages/teacher-assignment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/teacher-assignment/$classId/')({
  component: TeacherAssignmentPage,
})
