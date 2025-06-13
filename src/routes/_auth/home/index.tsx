import { createFileRoute } from '@tanstack/react-router'
import About from '@/pages/about'

export const Route = createFileRoute('/_auth/home/')({
  component: About,
})
