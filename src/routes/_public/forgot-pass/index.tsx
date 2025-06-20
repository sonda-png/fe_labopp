import { ForgotPasswordPage } from '@/pages/forgot-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/forgot-pass/')({
  component: ForgotPasswordPage,
})
