import { AssignmentDetailPage } from '@/pages/assignment-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_auth/student-assignment/$assignmentId/'
)({
  component: AssignmentDetailPage,
})
