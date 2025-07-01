import ClassProgressDashboard from '../../../pages/assignment-statistic'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/assignment-statistic/')({
  component: ClassProgressDashboard,
})


