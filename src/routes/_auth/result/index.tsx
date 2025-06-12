import { createFileRoute } from '@tanstack/react-router'
import StudentResults from '@/pages/result'

export const Route = createFileRoute('/_auth/result/')({
  component: StudentResults,
})


