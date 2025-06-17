import { createFileRoute } from '@tanstack/react-router'
import FAPSyncPage from '../../../pages/fap-sync'

export const Route = createFileRoute('/_auth/fap-sync/')({
  component: FAPSyncPage,
})
