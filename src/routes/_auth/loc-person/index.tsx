import ClassTrackingDashboard from '@/pages/loc-person'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/loc-person/')({
  component: ClassTrackingDashboard,
})


