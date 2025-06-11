import { createFileRoute } from '@tanstack/react-router'
import AssignmentManagement from '../../../pages/assignment-manage'
export const Route = createFileRoute('/_auth/assignment-manage/')({
  component: AssignmentManagement,
})
