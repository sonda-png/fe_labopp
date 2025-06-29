import { ForbiddenPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_public/forbidden/')({
  component: ForbiddenPage,
})
