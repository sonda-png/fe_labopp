import { createFileRoute } from '@tanstack/react-router'
import StudentResults from '@/pages/mysubmit'

export const Route = createFileRoute('/_auth/my-submit/')({
  component: StudentResults,
})
