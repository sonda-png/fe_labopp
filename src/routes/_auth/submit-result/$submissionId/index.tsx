import SubmissionResultPage from '@/pages/submission-result'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/submit-result/$submissionId/')({
  component: SubmissionResultPage,
})
