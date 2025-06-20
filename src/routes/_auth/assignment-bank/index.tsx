import { createFileRoute } from '@tanstack/react-router'
import AssignmentBank from '@/pages/assignment-bank'
export const Route = createFileRoute('/_auth/assignment-bank/')({
  component: AssignmentBank,
})
