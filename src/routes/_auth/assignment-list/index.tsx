import { createFileRoute } from '@tanstack/react-router'
import { StudentAssignmentList } from '@/components/features/student-assignment/student-assignment-list'

export const Route = createFileRoute('/_auth/assignment-list/')({
  component: StudentAssignmentList,
})
