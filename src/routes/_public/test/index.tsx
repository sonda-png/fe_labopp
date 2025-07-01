import { TestPage } from '@/pages/test'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/test/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TestPage />
}
