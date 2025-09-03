import { createFileRoute } from '@tanstack/react-router'
import AICodeReviewPage from '@/pages/ai-code-review'

export const Route = createFileRoute(
  '/_auth/my-submit/review/$submissionId/$assignmentId'
)({
  component: AICodeReviewPage,
})
