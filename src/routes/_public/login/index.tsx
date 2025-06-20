import { LoginPage } from '@/pages/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/login/')({
  component: LoginPage,
})
