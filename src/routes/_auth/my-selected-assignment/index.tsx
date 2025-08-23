import SelectedAssignments from '@/pages/my-selected-assignment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/my-selected-assignment/')({
  component: SelectedAssignments ,
})


