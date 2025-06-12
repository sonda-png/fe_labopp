import { createFileRoute } from '@tanstack/react-router'
import StudentSubmissionScreen from '@/pages/submit_lab'
export const Route = createFileRoute('/_auth/submit_lab/')({
  component: StudentSubmissionScreen,
})

