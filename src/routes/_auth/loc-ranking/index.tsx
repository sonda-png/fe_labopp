import LOCRankingPage from '@/pages/loc-ranking'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/loc-ranking/')({
  component: LOCRankingPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      classId: String(search.classId)
    }
  }
})

