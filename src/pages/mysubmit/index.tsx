import { mySubmissionsQueries } from '@/api/actions/my-submissions/my-submissions.queries'
import { useQuery } from '@/hooks'
import { MySubmissions } from '@/api/actions/my-submissions/my-submissions.type'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { MySubmissionStatsCard } from '@/components/features/my-submissions/submission-stat-card'
import { SubmissionSearchAndFilter } from '@/components/features/my-submissions/submission-search-filter'
import { SubmissionDetailDialog } from '@/components/features/my-submissions/submission-detail-dialog'
import { SubmissionCard } from '@/components/features/my-submissions/submission-card'

// Loading Component
const LoadingState = () => (
  <div className="container mx-auto p-6">
    <div className="mb-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="w-full">
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
      ))}
    </div>
  </div>
)

// Error Component
const ErrorState = () => (
  <div className="container mx-auto p-6">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        An error occurred while loading data. Please try again later.
      </AlertDescription>
    </Alert>
  </div>
)

// Empty State Component
const EmptyState = () => (
  <div className="container mx-auto p-6">
    <div className="text-center py-12">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No submissions yet
      </h3>
      <p className="text-gray-500">
        You haven't submitted any assignments yet. Start with your first
        assignment!
      </p>
    </div>
  </div>
)

// No Results Component
const NoResultsState = () => (
  <div className="text-center py-12">
    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No submissions found
    </h3>
    <p className="text-gray-500">
      Try changing your filters or search keywords
    </p>
  </div>
)

// Main Component
const StudentResults = () => {
  const {
    data: mySubmissionsData,
    isLoading,
    error,
  } = useQuery({
    ...mySubmissionsQueries.getAll(),
  })
  const [selectedSubmission, setSelectedSubmission] =
    useState<MySubmissions | null>(null)

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('submittedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!mySubmissionsData) return []

    const filtered = mySubmissionsData.filter(submission => {
      const matchesSearch =
        submission.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.assignmentId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || submission.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'fileName':
          aValue = a.fileName.toLowerCase()
          bValue = b.fileName.toLowerCase()
          break
        case 'submittedAt':
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
          break
        case 'locResult':
          aValue = a.locResult || 0
          bValue = b.locResult || 0
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [mySubmissionsData, searchTerm, statusFilter, sortBy, sortOrder])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />
  if (!mySubmissionsData || mySubmissionsData.length === 0)
    return <EmptyState />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Submissions
        </h1>
        <p className="text-gray-600">Manage and track all your submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MySubmissionStatsCard
          icon={FileText}
          title="Total Submissions"
          value={mySubmissionsData?.length || 0}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <MySubmissionStatsCard
          icon={CheckCircle}
          title="Passed"
          value={
            mySubmissionsData?.filter(s => s.status === 'PASSED').length || 0
          }
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <MySubmissionStatsCard
          icon={Clock}
          title="Pending"
          value={
            mySubmissionsData?.filter(s => s.status === 'PENDING').length || 0
          }
          bgColor="bg-yellow-100"
          textColor="text-yellow-600"
        />
        <MySubmissionStatsCard
          icon={XCircle}
          title="Rejected"
          value={
            mySubmissionsData?.filter(s => s.status === 'REJECTED').length || 0
          }
          bgColor="bg-red-100"
          textColor="text-red-600"
        />
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <SubmissionSearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filteredCount={filteredAndSortedData.length}
          totalCount={mySubmissionsData?.length || 0}
        />
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredAndSortedData.map((submission: MySubmissions) => (
          <SubmissionCard
            key={submission.submissionId}
            submission={submission}
            onCardClick={setSelectedSubmission}
            onDownload={handleDownload}
            onView={handleView}
          />
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredAndSortedData.length === 0 &&
        mySubmissionsData &&
        mySubmissionsData.length > 0 && <NoResultsState />}

      {/* Detail Dialog */}
      {selectedSubmission && (
        <SubmissionDetailDialog
          submission={selectedSubmission}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
}

export default StudentResults
