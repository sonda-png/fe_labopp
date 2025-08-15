import { createFileRoute } from '@tanstack/react-router'
import { WorkerManagementPage } from '@/pages/worker-management'

export const Route = createFileRoute('/_auth/worker-management/')({
  component: WorkerManagementPage,
})
