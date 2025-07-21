import { createFileRoute } from '@tanstack/react-router'
import LabAssignmentList from '@/pages/lab_assignment_list'
export const Route = createFileRoute('/_auth/assignmentlist/')({
  component: LabAssignmentList,
})
