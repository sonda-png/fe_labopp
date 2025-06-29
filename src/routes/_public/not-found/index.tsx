import { NotFoundPage } from '@/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/not-found/')({
  component: NotFoundPage,
})
