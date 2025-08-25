import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { AssignmentDetail } from '@/components/features/student-assignment/assignment-detail'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@/hooks'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

// Loading Component
const LoadingState = () => (
  <div className="container mx-auto p-6">
    <div className="mb-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  </div>
)

// Error Component
const ErrorState = () => (
  <div className="container mx-auto p-6">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        An error occurred while loading assignment details. Please try again
        later.
      </AlertDescription>
    </Alert>
  </div>
)

// Assignment Detail Page Component
export const AssignmentDetailPage = () => {
  const navigate = useNavigate()
  const { assignmentId } = useParams({
    from: '/_auth/student-assignment/$assignmentId/',
  })

  const {
    data: assignment,
    isLoading,
    error,
  } = useQuery({
    ...assignmentQueries.getById(assignmentId),
  })

  const handleBack = () => {
    navigate({ to: '/student-assignment' })
  }

  const handleSubmitAssignment = () => {
    navigate({
      to: '/submitlab',
      search: { assignmentId: assignmentId },
    })
  }

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />
  if (!assignment) return <ErrorState />

  return (
    <AssignmentDetail
      assignment={assignment}
      onBack={handleBack}
      onSubmit={handleSubmitAssignment}
    />
  )
}
