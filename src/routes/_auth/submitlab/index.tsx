import StudentSubmission from '@/pages/submit-lab'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/submitlab/')({
  component: StudentSubmission,
})